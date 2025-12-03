import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import useCategories from "@/hooks/useCategories";
import { courseService } from "@/services/courseService";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Video,
  FileText,
  CheckCircle2,
  PenTool,
  Clock,
  Upload,
  ArrowLeft,
  ArrowRight,
  File,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";

import { ResourceType } from "../../types/resource";
import { cn } from "@/lib/utils";
import { object } from "zod";

type CourseCreationFormProps = {
  courseId?: number;
  isEditing?: boolean;
  onSuccess?: () => void;
};

interface Resource {
  id: string | number;
  title: string;
  type: string;
  file_url: string | File;
  file_urls?: string[];
  is_downloadable: boolean;
  lesson_id?: number;
  file_size?: number;
}

interface Lesson {
  id?: string;
  title?: string;
  description?: string;
  order?: number;
  video_url?: string;
  videoFile?: File | null;
  duration?: number | string; // Accepter les deux types pour la compatibilité
  resources?: Resource[];
  content_type?: "video" | "pdf" | "article" | "quiz" | "assignment";
  content_url?: string | File;
  pdf_url?: string;
  preview?: boolean;
  attachments?: Resource[]; // Type plus précis
}

interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface CourseData {
  id?: number;
  title: string;
  description: string;
  category_id: number | string;
  thumbnail_url?: string;
  thumbnailFile?: File | null;
  sections: Section[];
  tags: string[];
  resources: Resource[];
  subtitle?: string;
  level?: string;
  language?: string;
  price?: number;
  discount?: number;
  instructor_id?: number;
  status?: string;
  image_url?: string;
  what_you_will_learn?: string[];
  requirements?: string[];
  subcategory?: string;
  salePrice?: number;
}

/**
 * Composant pour la création et la modification de cours
 * 
 * Processus complet de création d'un cours:
 * 1. Saisie des informations de base (titre, description, catégorie, prix...)
 * 2. Ajout de sections
 * 3. Ajout de leçons dans les sections 
 * 4. Ajout de tags et ressources au cours
 * 5. Soumission du formulaire qui crée le cours en base
 * 
 * Pour chaque entité, le processus est:
 * - Pour le cours: création via courseService.createCourse()
 * - Pour les sections: création via courseService.addSection() pour chaque section
 * - Pour les leçons: création via courseService.addLesson() pour chaque leçon de chaque section
 * - Pour les tags: création via courseService.addTag() pour chaque tag
 * - Pour les ressources: création via courseService.addResource() pour chaque ressource
 * 
 * Lors de l'édition, le processus est similaire mais utilise les méthodes update correspondantes
 */
const CourseCreationForm = ({ courseId, isEditing = false, onSuccess }: CourseCreationFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  // État pour les données du cours
  const [course, setCourse] = useState<CourseData>({
    title: '',
    description: '',
    category_id: 0,
    sections: [],
    tags: [],
    resources: [],
    subtitle: '',
    level: 'beginner',
    language: 'fr',
    price: 0,
    discount: 0,
    image_url: '',
    status: 'draft',
    subcategory: '',
    what_you_will_learn: [],
    requirements: []
  });

  // Charger les données du cours si on est en mode édition
  useEffect(() => {
    const fetchCourseData = async () => {
      if (isEditing && courseId) {
        try {
          // Récupérer les données du cours depuis l'API
          const response = await courseService.getCourseById(courseId.toString());
          
          // Vérifier le format de la réponse et extraire les données du cours
          let courseData;
          if (response && response.data) {
            // Si la réponse contient un objet data, c'est le format attendu
            courseData = response.data;
          } else {
            // Sinon, la réponse elle-même est le cours
            courseData = response;
          }
          
          console.log("Données du cours chargées pour édition:", courseData);
          
          // Transformation des données du cours pour correspondre à notre structure
          const formattedCourse: CourseData = {
            id: typeof courseData.id === 'string' ? parseInt(courseData.id) : courseData.id,
            title: courseData.title || "",
            description: courseData.description || "",
            category_id: typeof courseData.category_id === 'string' ? parseInt(courseData.category_id) : courseData.category_id || 0,
            sections: [],
            tags: [],
            resources: [],
            subtitle: courseData.subtitle || "",
            level: courseData.level || "beginner",
            language: courseData.language || "en",
            price: typeof courseData.price === 'string' ? parseFloat(courseData.price) : (courseData.price || 0),
            discount: typeof courseData.discount === 'string' ? parseFloat(courseData.discount) : (courseData.discount || 0),
            image_url: courseData.image_url || "",
            instructor_id: courseData.instructor_id || parseInt(localStorage.getItem("userId") || "0", 10),
            status: courseData.status || "draft",
            subcategory: courseData.subcategory || "",
            what_you_will_learn: Array.isArray(courseData.what_you_will_learn) ? courseData.what_you_will_learn : [],
            requirements: Array.isArray(courseData.requirements) ? courseData.requirements : []
          };

          // Traitement des sections et leçons
          if (Array.isArray(courseData.sections)) {
            formattedCourse.sections = courseData.sections.map((section: any) => ({
              id: section.id.toString(),
              title: section.title || "",
              description: section.description || "",
              order: section.order || 0,
              lessons: Array.isArray(section.lessons) 
                ? section.lessons.map((lesson: any) => ({
                    id: lesson.id?.toString() || `temp-${Date.now()}`,
                    title: lesson.title || "",
                    description: lesson.description || "",
                    duration: typeof lesson.duration === 'string' ? parseInt(lesson.duration) : (lesson.duration || 0),
                    content_type: (lesson.content_type as "video" | "article" | "quiz" | "assignment" | "pdf") || "video",
                    preview: lesson.preview || false,
                    content_url: lesson.content_url || "",
                    order: lesson.order || 0,
                    video_url: lesson.video_url || "",
                    pdf_url: lesson.pdf_url || "",
                    attachments: Array.isArray(lesson.attachments) ? lesson.attachments.map((att: any) => ({
                      id: att.id?.toString() || `resource-${Date.now()}`,
                      title: att.title || "",
                      type: att.type || "",
                      file_url: att.file_url || "",
                      is_downloadable: att.is_downloadable || false,
                      lesson_id: att.lesson_id || 0,
                      file_size: att.file_size || 0
                    })) : []
                  }))
                : []
            }));
          }

          // Traitement des tags
          if (Array.isArray(courseData.tags)) {
            formattedCourse.tags = courseData.tags.map((tag: any) => {
              if (typeof tag === 'object' && tag !== null) {
                // Si c'est un objet Tag, extraire le nom
                return 'name' in tag ? tag.name : tag.toString();
              }
              return tag.toString();
            });
          }

          // Traitement des ressources
          if (Array.isArray(courseData.resources)) {
            formattedCourse.resources = courseData.resources.map((resource: any) => ({
              id: resource.id?.toString() || `resource-${Date.now()}`,
              title: resource.title || "",
              type: resource.type || "",
              file_url: resource.file_url || "",
              is_downloadable: resource.is_downloadable || false,
              lesson_id: resource.lesson_id || 0,
              file_size: resource.file_size || 0
            }));
          }

          // Définir le prix de vente si applicable
          if (formattedCourse.discount && formattedCourse.discount > 0 && formattedCourse.price) {
            formattedCourse.salePrice = formattedCourse.price * (1 - formattedCourse.discount / 100);
          }

          console.log("Données formatées pour le formulaire:", formattedCourse);
          
          // Mettre à jour l'état du cours avec les données formatées
          setCourse(formattedCourse);

          // Étendre toutes les sections pour l'édition
          if (formattedCourse.sections.length > 0) {
            setExpandedSections(formattedCourse.sections.map(section => section.id));
          }
          
          // Revenir au premier onglet pour visualiser les données
          setCurrentStep(1);
          
        } catch (err) {
          console.error("Erreur lors du chargement du cours:", err);
          toast({
            title: "Erreur",
            description: "Impossible de charger les données du cours",
            variant: "destructive"
          });
        }
      }
    };

    fetchCourseData();
  }, [isEditing, courseId, toast]);

  //les states pour les lessons et les coures
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "section" | "lesson";
    id: string;
    sectionId?: string;
  } | null>(null);

  // les states pour les inputes
  const [newRequirement, setNewRequirement] = useState("");
  const [newLearningOutcome, setNewLearningOutcome] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for resource attachments
  const [newResource, setNewResource] = useState({
    title: "",
    lesson_id : 0,
    type: "PDF",
    file_url: "",
    files: [] as File[],
    is_downloadable: true
  });
  const [resourceFileUploading, setResourceFileUploading] = useState(false);
  const [expandedResources, setExpandedResources] = useState<string[]>([]);

  // les states pour aploading
  const [fileUploading, setFileUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedContentFile, setSelectedContentFile] = useState<File | null>(
    null
  );

  console.log('currentLesson====158====>>',currentLesson)
  // handler la selection de file
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedContentFile(file);
      console.log("file", file);
      
      try {
        if (file.type === "application/pdf") {
          // Pour les PDFs
          const contentUrl = URL.createObjectURL(file);
          setCurrentLesson({
            ...currentLesson,
            content_type: "pdf",
            content_url: file, // Stocker l'objet File directement pour l'upload ultérieur
            pdf_url: contentUrl, // URL locale pour l'aperçu
            video_url: "", // Réinitialiser l'URL vidéo
            duration: 0,
          });
          console.log("PDF sélectionné, URL locale créée:", contentUrl);
        } else if (file.type.startsWith("video/")) {
          // Pour les vidéos
          const contentUrl = URL.createObjectURL(file);
          console.log("contentUrl vidéo:", contentUrl);
          setCurrentLesson({
            ...currentLesson,
            content_type: "video",
            content_url: file, // Stocker l'objet File directement pour l'upload ultérieur
            video_url: contentUrl, // URL locale pour l'aperçu
            pdf_url: "", // Réinitialiser l'URL PDF
            duration: 0, // Utiliser un nombre au lieu d'une chaîne
          });
          console.log("Vidéo sélectionnée, URL locale créée:", contentUrl);
        }
        } catch (error) {
        console.error("Erreur lors de la sélection du fichier:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la sélection du fichier",
          variant: "destructive"
        });
      }
    }
  };

  // Toggle section expand/collapse
  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Add a new section
  const handleAddSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: "",
      description: "",
      order: course.sections ? course.sections.length + 1 : 1,
      lessons: [],
    };

    setCurrentSection(newSection);
    setShowSectionDialog(true);
  };

  // Save section
  const handleSaveSection = async () => {
    if (!currentSection) return;

    if (currentSection.title.trim() === "") {
      toast({
        title: "Titre de section requis",
        description: "Veuillez fournir un titre pour la section.",
        variant: "destructive",
      });
      return;
    }

    // Afficher un toast de chargement
    toast({
      title: "Sauvegarde en cours",
      description: "Enregistrement de la section...",
    });

    try {
      // Préparer les données de la section
      const sectionData = {
        ...currentSection,
        title: currentSection.title.trim(),
        description: currentSection.description || "",
        order: currentSection.order || course.sections.length + 1
      };

      console.log("Données de section à sauvegarder:", sectionData);

      // Vérifier si la section existe déjà
      const isEditing = course.sections.some(
      (section) => section.id === currentSection.id
    );

      let updatedSections;
    if (isEditing) {
        updatedSections = course.sections.map((section) =>
          section.id === currentSection.id ? sectionData : section
      );
    } else {
        updatedSections = [
          ...course.sections,
          sectionData
        ];
      }

      // Mettre à jour le cours avec la nouvelle section
    setCourse({
      ...course,
      sections: updatedSections,
    });

      // Si le cours a déjà été créé, enregistrer la section immédiatement sur le serveur
      if (course.id) {
        try {
          const courseId = course.id.toString();
          
          const sectionToSave = {
            title: sectionData.title,
            description: sectionData.description || "",
            order: sectionData.order || 1
          };
          
          console.log("Tentative de sauvegarde de la section sur le serveur:", {
            courseId,
            sectionData: sectionToSave
          });
          
          if (isEditing && !sectionData.id.startsWith('section-')) {
            // Mise à jour d'une section existante
            await courseService.updateSection(
              courseId,
              sectionData.id,
              sectionToSave
            );
            console.log("Section mise à jour avec succès sur le serveur");
          } else {
            // Création d'une nouvelle section
            const createdSection = await courseService.addSection(
              courseId,
              sectionToSave
            );
            console.log("Nouvelle section créée avec succès sur le serveur:", createdSection);
            
            // Mettre à jour l'ID de la section avec celui retourné par le serveur
            if (createdSection && createdSection.id) {
              const updatedSectionsWithId = course.sections.map((section) => 
                section.id === sectionData.id ? { ...section, id: createdSection.id.toString() } : section
              );
              
              setCourse({
                ...course,
                sections: updatedSectionsWithId
              });
            }
          }
        } catch (serverError) {
          console.error("Erreur lors de la sauvegarde de la section sur le serveur:", serverError);
          toast({
            title: "Avertissement",
            description: "La section a été sauvegardée localement mais pas sur le serveur. Elle sera synchronisée lors de la soumission finale.",
            variant: "destructive"
          });
        }
      }

    // Expand the new section
    if (!isEditing) {
      setExpandedSections([...expandedSections, currentSection.id]);
    }

      // Notification pour confirmer l'action
      toast({
        title: isEditing ? "Section mise à jour" : "Section ajoutée",
        description: isEditing ? "La section a été mise à jour avec succès" : "La section a été ajoutée avec succès",
        variant: "default"
      });

    setShowSectionDialog(false);
    setCurrentSection(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la section:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la section: " + ((error as Error).message || "Erreur inconnue"),
        variant: "destructive"
      });
    }
  };

  // Edit section
  const handleEditSection = (section: Section) => {
    setCurrentSection({ ...section });
    setShowSectionDialog(true);
  };

  // Add a new lesson to a section
  const handleAddLesson = (sectionId: string) => {
    console.log("handleAddLesson appelé avec sectionId:", sectionId);
    const section = course.sections.find((s) => s.id === sectionId);
    
    if (!section) {
      console.error("Section non trouvée avec l'ID:", sectionId);
      toast({
        title: "Erreur",
        description: "Section non trouvée",
        variant: "destructive",
      });
      return;
    }

    console.log("Section trouvée:", section);

    const newLesson: Lesson = {
      id: `temp-lesson-${Date.now()}`,
      title: "",
      description: "",
      content_type: "video",
      content_url: "",
      duration: 0,
      order: section.lessons.length + 1,
      attachments: [],
    };

    console.log("Nouvelle leçon créée:", newLesson);
    console.log("Ouverture du dialogue de leçon");

    setCurrentSection({ ...section });
    setCurrentLesson(newLesson);
    setShowLessonDialog(true);
  };

  // Edit lesson
  const handleEditLesson = (sectionId: string, lessonId: string) => {
    const section = course.sections?.find((s) => s.id === sectionId);
    if (!section) return;

    const lesson = section.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    console.log("Édition de la leçon:", lesson);
    
    setCurrentSection({ ...section });
    setCurrentLesson({ 
      ...lesson,
      title: lesson.title || "",
      description: lesson.description || "",
      content_type: lesson.content_type || "video",
      duration: lesson.duration || 0,
      order: lesson.order || 1,
      preview: lesson.preview || false,
      content_url: lesson.content_url || "",
      video_url: lesson.video_url || "",
      pdf_url: lesson.pdf_url || "",
      attachments: lesson.attachments || []
    });
    
    setShowLessonDialog(true);
  };

  // Save lesson
  const handleSaveLesson = async () => {
    console.log("Début de handleSaveLesson");
    console.log("currentLesson:", currentLesson);
    console.log("currentSection:", currentSection);
    
    if (!currentLesson || !currentSection) {
      toast({
        title: "Erreur",
        description: "Informations manquantes pour enregistrer la leçon",
        variant: "destructive",
      });
      return;
    }

    try {
    // Validation des champs requis
      if (!currentLesson.title || currentLesson.title.trim() === "") {
      toast({
        title: "Erreur",
        description: "Le titre de la leçon est requis",
        variant: "destructive",
      });
      return;
    }

      // Afficher un indicateur de chargement
      toast({
        title: "Sauvegarde en cours",
        description: "Enregistrement de la leçon en cours...",
      });

      // Préparation des données de la leçon avec durée par défaut selon le type
      let durationValue = currentLesson.duration || 0;
      if (currentLesson.content_type === "pdf" && !durationValue) {
        durationValue = 0;
      }

      // Créer une copie de la leçon actuelle pour éviter les problèmes de référence
      // Conservons l'objet File tel quel dans l'état local
    const lessonData = {
      ...currentLesson,
        title: currentLesson.title.trim(),
        description: currentLesson.description || "",
        duration: durationValue,
        content_type: currentLesson.content_type || "video",
        preview: currentLesson.preview || false,
        order: currentLesson.order || 1,
      };
      
      console.log("lessonData", lessonData);
      console.log("Données de la leçon à sauvegarder:", lessonData);
      console.log("Section parent:", currentSection);

      // Vérifier si la leçon existe déjà dans la section
    const isEditing = currentSection.lessons.some(
      (lesson) => lesson.id === currentLesson.id
    );

      // Mettre à jour les données de la section
      let updatedLessons = [];
    if (isEditing) {
      updatedLessons = currentSection.lessons.map((lesson) =>
        lesson.id === currentLesson.id ? lessonData : lesson
      );
    } else {
      updatedLessons = [...currentSection.lessons, lessonData];
    }

      // Créer une nouvelle copie de la section pour éviter les problèmes de référence
    const updatedSection = {
      ...currentSection,
      lessons: updatedLessons,
    };

      // Mettre à jour les sections dans le cours
      const updatedSections = course.sections.map((section) =>
      section.id === updatedSection.id ? updatedSection : section
    );

      console.log("Sections mises à jour:", updatedSections);

      // Mettre à jour le cours avec la nouvelle leçon
    setCourse({
      ...course,
      sections: updatedSections,
    });

      // Notification pour confirmer l'action
      toast({
        title: isEditing ? "Leçon mise à jour" : "Leçon ajoutée",
        description: isEditing ? "La leçon a été mise à jour avec succès" : "La leçon a été ajoutée avec succès",
        variant: "default"
      });

      console.log("Fin de handleSaveLesson - succès");
    setShowLessonDialog(false);
    setCurrentLesson(null);
    setCurrentSection(null);
    setSelectedContentFile(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la leçon:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la leçon: " + ((error as Error).message || "Erreur inconnue"),
        variant: "destructive"
      });
    }
  };

  // Delete section or lesson
  const handleDelete = (
    type: "section" | "lesson",
    id: string,
    sectionId?: string
  ) => {
    setItemToDelete({ type, id, sectionId });
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "section") {
      setCourse({
        ...course,
        sections: course.sections?.filter(
          (section) => section.id !== itemToDelete.id
        ),
      });
    } else if (itemToDelete.type === "lesson" && itemToDelete.sectionId) {
      const section = course.sections?.find(
        (s) => s.id === itemToDelete.sectionId
      );
      if (!section) return;

      const updatedSection = {
        ...section,
        lessons: section.lessons.filter(
          (lesson) => lesson.id !== itemToDelete.id
        ),
      };

      setCourse({
        ...course,
        sections: course.sections?.map((s) =>
          s.id === itemToDelete.sectionId ? updatedSection : s
        ),
      });
    }

    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    // Dropped outside the list
    if (!destination) return;

    // No movement
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Reordering sections
    if (type === "SECTION") {
      const reorderedSections = Array.from(course.sections || []);
      const [removed] = reorderedSections.splice(source.index, 1);
      reorderedSections.splice(destination.index, 0, removed);

      // Update order property
      const updatedSections = reorderedSections.map((section, index) => ({
        ...section,
        order: index + 1,
      }));

      setCourse({
        ...course,
        sections: updatedSections,
      });
      return;
    }

    // Reordering lessons within the same section
    if (type === "LESSON" && source.droppableId === destination.droppableId) {
      const sectionId = source.droppableId;
      const section = course.sections?.find((s) => s.id === sectionId);
      if (!section) return;

      const reorderedLessons = Array.from(section.lessons);
      const [removed] = reorderedLessons.splice(source.index, 1);
      reorderedLessons.splice(destination.index, 0, removed);

      // Update order property
      const updatedLessons = reorderedLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));

      const updatedSections = course.sections?.map((s) =>
        s.id === sectionId ? { ...s, lessons: updatedLessons } : s
      );

      setCourse({
        ...course,
        sections: updatedSections,
      });
    }
  };

  // Add a requirement
  const handleAddRequirement = () => {
    if (newRequirement.trim() === "") return;
    setCourse({
      ...course,
      requirements: course.requirements
        ? [...course.requirements, newRequirement]
        : [newRequirement],
    });
    setNewRequirement("");
  };

  // Remove a requirement
  const handleRemoveRequirement = (index: number) => {
    setCourse({
      ...course,
      requirements: course.requirements?.filter((_, i) => i !== index),
    });
  };

  // Add a learning outcome
  const handleAddLearningOutcome = () => {
    if (newLearningOutcome.trim() === "") return;
    setCourse({
      ...course,
      what_you_will_learn: course.what_you_will_learn
        ? [...course.what_you_will_learn, newLearningOutcome]
        : [newLearningOutcome],
    });
    setNewLearningOutcome("");
  };

  // Remove a learning outcome
  const handleRemoveLearningOutcome = (index: number) => {
    setCourse({
      ...course,
      what_you_will_learn: course.what_you_will_learn?.filter(
        (_, i) => i !== index
      ),
    });
  };

  // Add a tag
  const handleAddTag = () => {
    if (!selectedTag || selectedTag.trim() === "") {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un tag valide",
        variant: "destructive",
      });
      return;
    }
    
    // Vérifier si le tag existe déjà
    if (course.tags.includes(selectedTag.trim())) {
      toast({
        title: "Tag déjà existant",
        description: "Ce tag existe déjà dans la liste",
        variant: "destructive",
      });
      return;
    }
    
      setCourse({
        ...course,
      tags: [...course.tags, selectedTag.trim()],
      });
    
    toast({
      title: "Tag ajouté",
      description: `Le tag "${selectedTag}" a été ajouté avec succès`,
      variant: "default",
    });
    
      setSelectedTag("");
  };

  // Remove a tag
  const handleRemoveTag = (tag: string) => {
    setCourse({
      ...course,
      tags: course.tags.filter((t) => t !== tag),
    });
    
    toast({
      title: "Tag supprimé",
      description: `Le tag "${tag}" a été supprimé`,
      variant: "default",
    });
  };

  // Handle resource file selection
  const handleResourceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to array and append to existing files
      const newFiles = Array.from(e.target.files);
      console.log(newFiles)
      setNewResource({
        ...newResource,
        files: [...newResource.files, ...newFiles],
        file_url: "" // Clear file_url when files are selected
      });
    }
  };

  // Remove a file from the files array
  const handleRemoveFile = (index: number) => {
    setNewResource({
      ...newResource,
      files: newResource.files.filter((_, i) => i !== index)
    });
  };

  // Handle resource type change
  const handleResourceTypeChange = (type: ResourceType) => {
    setNewResource({
      ...newResource,
      type,
      // Clear the appropriate field based on type
      files: type === ResourceType.LINK ? [] : newResource.files,
      file_url: type !== ResourceType.LINK ? "" : newResource.file_url
    });
  };

  // Add a resource to the course
  const handleAddResource = async () => {
    // Validate resource data
    if (!newResource.title.trim()) {
      toast({
        title: "Information manquante",
        description: "Le titre de la ressource est requis",
        variant: "destructive",
      });
      return;
    }

    if (newResource.type !== ResourceType.LINK && newResource.files.length === 0) {
      toast({
        title: "Fichiers manquants",
        description: "Veuillez sélectionner au moins un fichier à télécharger",
        variant: "destructive",
      });
      return;
    }

    if (newResource.type === ResourceType.LINK && !newResource.file_url.trim()) {
      toast({
        title: "URL manquante",
        description: "Veuillez entrer une URL valide",
        variant: "destructive",
      });
      return;
    }

    // Si des fichiers sont sélectionnés, les télécharger
    const fileUrls: string[] = [];
    let resourceFileUploading = true;

      try {
      if (newResource.files.length > 0) {
        // Télécharger chaque fichier et collecter les URLs
        for (const file of newResource.files) {
          // Télécharger le fichier en utilisant courseService
          const uploadResponse = await courseService.uploadFile(
            "courseResource", 
            file
          );

          if (uploadResponse.fileUrl) {
            fileUrls.push(uploadResponse.fileUrl);
          }
        }
      }

      resourceFileUploading = false;

      // Ajouter la ressource au cours pour chaque fichier ou lien
      if (newResource.type === ResourceType.LINK) {
        // Pour les liens, créer une ressource unique
        const newResourceItem: Resource = {
          id: Date.now().toString(),
      title: newResource.title,
      type: newResource.type,
          file_url: newResource.file_url,
          is_downloadable: newResource.is_downloadable,
          lesson_id: 0,
          file_size: 0
    };

    setCourse({
      ...course,
      resources: [...course.resources, newResourceItem]
    });
      } else {
        // Pour les fichiers, créer une ressource pour chaque fichier
        const newResources = fileUrls.map((fileUrl, index) => {
          return {
            id: (Date.now() + index).toString(),
            title: fileUrls.length > 1 ? `${newResource.title} (${index + 1})` : newResource.title,
            type: newResource.type,
            file_url: fileUrl,
            is_downloadable: newResource.is_downloadable,
            lesson_id: 0,
            file_size: newResource.files[index]?.size || 0
          };
        });
        
        setCourse({
          ...course,
          resources: [...course.resources, ...newResources]
        });
      }

      // Réinitialiser le formulaire
    setNewResource({
      title: "",
      lesson_id: 0,
      type: "PDF",
      files: [],
      file_url: "",
      is_downloadable: true
    });
      
      toast({
        title: "Ressource ajoutée",
        description: "La ressource a été ajoutée avec succès",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la ressource:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout de la ressource",
        variant: "destructive",
      });
    }
  };

  // Add a resource to a lesson
  const handleAddLessonResource = async () => {
    // Validate resource data
    console.log(newResource)
    if (!newResource.title.trim()) {
      toast({
        title: "Missing information",
        description: "Resource title is required",
        variant: "destructive",
      });
      return;
    }

    if (newResource.type !== ResourceType.LINK && newResource.files.length === 0) {
      toast({
        title: "Missing files",
        description: "Please select at least one file to upload",
        variant: "destructive",
      });
      return;
    }

    if (newResource.type === ResourceType.LINK && !newResource.file_url.trim()) {
      toast({
        title: "Missing URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    if (!currentLesson) {
      toast({
        title: "Error",
        description: "No lesson selected",
        variant: "destructive",
      });
      return;
    }

    // If files are selected, upload them
    const fileUrls: string[] = [];
    let fileSize = 0;

    if (newResource.files.length > 0) {
      setFileUploading(true);
      try {
        // Upload each file and collect the URLs
        for (const file of newResource.files) {
          fileSize += file.size;
          // Upload the file using the courseService
          const uploadResponse = await courseService.uploadFile(
            "lessonResource", 
            file
          );

          if (uploadResponse.fileUrl) {
            fileUrls.push(uploadResponse.fileUrl);
          }
        }
      } catch (error) {
        console.error("Error uploading resource files:", error);
        toast({
          title: "Upload failed",
          description: "There was an error uploading your files. Please try again.",
          variant: "destructive",
        });
        setFileUploading(false);
        return;
      }

      setFileUploading(false);
    }

    // Create resources for each file or link
    const newResources: Resource[] = [];

    if (newResource.type === ResourceType.LINK) {
      // For links, create a single resource
      newResources.push({
        id: Date.now(),
        lesson_id: currentLesson?.id ? parseInt(currentLesson.id) : 0,
        title: newResource.title,
        type: newResource.type,
        file_url: newResource.file_url,
        file_size: fileSize || 0,
        is_downloadable: newResource.is_downloadable,
      });
    } else {
      // For files, create a resource for each file
      fileUrls.forEach((fileUrl, index) => {
        const fileName = newResource.files[index]?.name || newResource.title;
        newResources.push({
          id: Date.now() + index,
          lesson_id: currentLesson?.id ? parseInt(currentLesson.id) : 0,
          title: fileUrls.length > 1 ? `${newResource.title} (${index + 1})` : newResource.title,
          type: newResource.type,
          file_url: fileUrl,
          file_size: newResource.files[index]?.size || 0,
          is_downloadable: newResource.is_downloadable
        });
      });
    }

    // Add the resources to the lesson's attachments
    setCurrentLesson({
      ...currentLesson,
      attachments: [...(currentLesson.attachments || []), ...newResources]
    });

    // Reset the form
    setNewResource({
      title: "",
      lesson_id: 0,
      type: "PDF",
      files: [],
      file_url: "",
      is_downloadable: true
    });
  };

  // Remove a resource
  const handleRemoveResource = (resourceId: string) => {
    setCourse({
      ...course,
      resources: course.resources.filter((resource) => resource.id !== resourceId)
    });
  };

  // Remove a resource from a lesson
  const handleRemoveLessonResource = (resourceId: string | number) => {
    if (!currentLesson) return;

    setCurrentLesson({
      ...currentLesson,
      attachments: currentLesson.attachments?.filter((resource) => resource.id !== resourceId) || []
    });
  };

  // Toggle resource expanded state
  const toggleResourceExpanded = (resourceId: string) => {
    setExpandedResources(prev => 
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Début de la soumission du formulaire. Mode édition:", isEditing);
    console.log("Données du cours à soumettre:", course);

    try {
      console.log(course.title , course.description , course.category_id)
      // Validation des données du cours
    if (!course.title || !course.description || !course.category_id) {
      toast({
          title: "Informations manquantes",
          description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      setIsSubmitting(false);
       
      return;
    }

      // Récupérer le token d'authentification
    const authDataString = localStorage.getItem("auth-storage");
    if (!authDataString) {
      toast({
        title: "Erreur d'authentification",
          description: "Aucune donnée d'authentification trouvée. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const authData = JSON.parse(authDataString);
      const token = authData?.state?.token;
    const userId = authData?.state?.user?.id;

      console.log("Token récupéré:", token ? "Token disponible" : "Token manquant");
      console.log("ID utilisateur:", userId);

      // Mettre le token dans localStorage pour être sûr qu'il est disponible pour l'API
      if (token) {
        localStorage.setItem('token', token);
        console.log("Token mis à jour dans localStorage");
      }

      if (!token || !userId) {
      toast({
        title: "Erreur d'authentification",
          description: "Session expirée ou informations d'authentification manquantes. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

      // Préparer les données du cours
      const courseData = {
        title: course.title,
        description: course.description,
        category_id: typeof course.category_id === 'number' ? course.category_id.toString() : course.category_id,
        level: course.level || "beginner",
        language: course.language || "en",
        instructor_id: userId,
        price: typeof course.price === 'number' ? course.price : Number(course.price || 0),
        discount: typeof course.discount === 'number' ? course.discount : Number(course.discount || 0),
        image_url: course.image_url,
        status: course.status || "draft",
        subtitle: course.subtitle,
        what_you_will_learn: course.what_you_will_learn || [],
        requirements: course.requirements || []
      };
      
      console.log("Données du cours formatées pour envoi API:", courseData);
      let courseId;
      
      // Créer ou mettre à jour le cours en fonction du mode
      if (isEditing && course.id) {
        console.log("Mode édition détecté - ID du cours:", course.id);
        
        // Convertir l'ID en string s'il est un nombre
        const idToUse = typeof course.id === 'number' ? course.id.toString() : course.id;
        console.log("ID converti pour la mise à jour:", idToUse);
        
        try {
          // Appeler le service de cours pour la mise à jour
          console.log("Appel de courseService.updateCourse avec:", {
            courseId: idToUse,
            courseData: courseData
          });
          
          // Assurez-vous que le token est à jour dans localStorage pour que le service puisse l'utiliser
          if (token) {
            localStorage.setItem('token', token);
          }
          
          const updatedCourse = await courseService.updateCourse(idToUse, courseData);
          console.log("Réponse de la mise à jour du cours:", updatedCourse);
          courseId = idToUse;
        } catch (updateError: any) {
          console.error("Erreur complète lors de la mise à jour:", updateError);
          if (updateError.response) {
            console.error("Détails de l'erreur:", {
              status: updateError.response.status,
              data: updateError.response.data,
              headers: updateError.response.headers
            });
          } else if (updateError.request) {
            console.error("Requête envoyée mais pas de réponse:", updateError.request);
          } else {
            console.error("Erreur pendant la configuration de la requête:", updateError.message);
          }
          throw updateError;
        }
      } else {
        console.log("Création d'un nouveau cours");
      const createdCourse = await courseService.createCourse(courseData);
        console.log("Réponse de la création du cours:", createdCourse);

        // Vérifier si la réponse contient l'ID du cours
        if (createdCourse && (typeof createdCourse.id === 'string' || typeof createdCourse.id === 'number')) {
          courseId = createdCourse.id.toString();
          console.log("ID du cours créé:", courseId);
        } else if (typeof createdCourse === 'object' && createdCourse !== null && 'data' in createdCourse && createdCourse.data && typeof createdCourse.data.id !== 'undefined') {
          courseId = createdCourse.data.id.toString();
          console.log("ID du cours créé (via data):", courseId);
        } else {
          console.error("Réponse de création de cours invalide:", createdCourse);
          throw new Error("ID du cours non trouvé dans la réponse.");
        }
      }
      
      if (!courseId) {
        throw new Error("L'ID du cours est manquant après création/mise à jour");
      }

      // Créer les sections et leçons une à une
      console.log("Traitement des sections du cours. Nombre de sections:", course.sections.length);

      // Ajouter ou mettre à jour les sections et leurs leçons
      for (const section of course.sections) {
        let sectionId;
        
        try {
          if (isEditing && section.id && !section.id.startsWith('section-')) {
            // Mettre à jour la section existante
            console.log("Mise à jour de la section existante:", section.id);
            const sectionData = {
          title: section.title,
              description: section.description || "",
              order: section.order || 0,
            };
            console.log("Données de section à mettre à jour:", sectionData);
            
            const updatedSection = await courseService.updateSection(courseId, section.id, sectionData);
            console.log("Réponse de la mise à jour de la section:", updatedSection);
            sectionId = section.id;
          } else {
            // Créer une nouvelle section
            console.log("Création d'une nouvelle section");
            const sectionToCreate = {
              title: section.title,
              description: section.description || "",
              order: section.order || 0,
            };
            console.log("Données de la section à créer:", sectionToCreate);
            
            const createdSection = await courseService.addSection(courseId, sectionToCreate);
            console.log("Réponse de la création de la section:", createdSection);
            sectionId = createdSection;
          }
        } catch (sectionError) {
          console.error("Erreur lors de la création/mise à jour de la section:", sectionError);
          toast({
            title: "Avertissement",
            description: `Problème avec une section: ${section.title}`,
            variant: "destructive"
          });
          continue; // Passer à la section suivante en cas d'erreur
        }
       console.log("sectionId", sectionId);

        if (!sectionId) {
          console.error("ID de section manquant, passage à la section suivante");
          continue;
        }

        // Traiter les leçons de cette section
        console.log(`Traitement des leçons de la section ${sectionId}. Nombre de leçons:`, section.lessons.length);
        for (const lesson of section.lessons) {
          console.log("lesson", lesson);
          console.log(typeof lesson.duration);
          
          // Traiter le fichier content_url si c'est un objet File
          let processedContentUrl = lesson.content_url;
          
          if (lesson.content_url && typeof lesson.content_url === 'object' && 'name' in lesson.content_url) {
            try {
              console.log("Détection d'un fichier pour content_url, préparation pour upload...");
              
              // Uploader le fichier directement sans FormData intermédiaire
              const uploadResponse = await courseService.uploadFile(
                'lesson', 
                lesson.content_url
              );
              
              console.log("Réponse de l'upload:", uploadResponse);
              
              // Extraire l'URL du fichier selon la structure de la réponse
              let fileUrl = '';
              
              if (uploadResponse && uploadResponse.status === 'success' && uploadResponse.data && uploadResponse.data.file_url) {
                // Format API Laravel
                fileUrl = uploadResponse.data.file_url;
                console.log("URL du fichier uploadé (format API Laravel):", fileUrl);
              } else if (uploadResponse && uploadResponse.url) {
                // Format précédent - fallback
                fileUrl = uploadResponse.url;
                console.log("URL du fichier uploadé (format précédent):", fileUrl);
              } else if (uploadResponse && uploadResponse.fileUrl) {
                // Autre format possible - fallback
                fileUrl = uploadResponse.fileUrl;
                console.log("URL du fichier uploadé (via fileUrl):", fileUrl);
              } else {
                console.warn("L'upload a réussi mais aucune URL n'a été retournée");
                fileUrl = lesson.content_url.name; // Fallback sur le nom du fichier
              }
              
              processedContentUrl = fileUrl;
            } catch (uploadError) {
              console.error("Erreur pendant l'upload du fichier content_url:", uploadError);
              // On garde le nom du fichier comme référence en cas d'erreur
              if (lesson.content_url && typeof lesson.content_url === 'object' && 'name' in lesson.content_url) {
                processedContentUrl = lesson.content_url.name;
              }
            }
          }

          const lessonData = {
            title: lesson.title,
            description: lesson.description,
            content_type: lesson.content_type,
            content_url: processedContentUrl,
            duration: typeof lesson.duration === 'number' ? lesson.duration.toString() : lesson.duration,
            order: lesson.order,
            preview: lesson.preview,
          };

          // TODO: FIX le problem de tag Dans backend
          console.log("lessonData", lessonData);

          try {
            console.log("lesson.id", lesson.id );
            if (lesson.id && !lesson.id.startsWith('temp-')) {
              // Mettre à jour une leçon existante
              console.log("Mise à jour de la leçon existante:", lesson.id);
              await courseService.updateLesson(courseId, sectionId.toString(), lesson.id, lessonData);
            } else {
              // Créer une nouvelle leçon
              console.log("Création d'une nouvelle leçon");
              await courseService.addLesson(courseId, sectionId.toString(), lessonData, token);
        }
          } catch (lessonError) {
            console.error("Erreur lors de la création/mise à jour de la leçon:", lessonError);
            toast({
              title: "Avertissement",
              description: `Problème avec une leçon: ${lesson.title || "Sans titre"}`,
              variant: "destructive"
            });
            // Continuer avec la leçon suivante
          }
        }
      }

      // Gestion des tags
      if (course.tags && course.tags.length > 0) {
        console.log("Ajout des tags...");
        try {
          // Récupérer tous les tags existants d'abord
          const existingTags = await courseService.getTags();
          console.log("Tags existants:", existingTags);
          
          // Ajouter chaque tag individuellement en gérant les erreurs
          for (const tagName of course.tags) {
            if (tagName && tagName.trim()) {
              try {
                console.log(`Traitement du tag "${tagName.trim()}"`);
                
                // Vérifier si le tag existe déjà
                const trimmedTagName = tagName.trim();
                const existingTag = existingTags.find(tag => 
                  tag.name.toLowerCase() === trimmedTagName.toLowerCase()
                );
                
                let tagId;
                
                if (existingTag) {
                  // Si le tag existe, utiliser son ID
                  console.log(`Le tag "${trimmedTagName}" existe déjà avec l'ID ${existingTag.id}`);
                  tagId = existingTag.id;
                } else {
                  // Si le tag n'existe pas, le créer
                  console.log(`Création du tag "${trimmedTagName}"...`);
                  const token = localStorage.getItem('token');
                  const createResponse = await fetch(`http://localhost:8000/api/tags`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: JSON.stringify({ name: trimmedTagName })
                  });
                  
                  if (createResponse.ok) {
                    const createdTag = await createResponse.json();
                    console.log(`Tag "${trimmedTagName}" créé avec succès:`, createdTag);
                    tagId = createdTag.id;
                  } else {
                    console.warn(`Échec de la création du tag "${trimmedTagName}":`, await createResponse.json());
                    continue; // Passer au tag suivant
                  }
                }
                
                // Maintenant attacher le tag au cours par son ID
                if (tagId) {
                  console.log(`Attachement du tag ${tagId} au cours ${courseId}...`);
                  // Utiliser la fonction du service pour attacher le tag au cours
                  const attachResult = await courseService.attachTagToCourse(courseId.toString(), tagId);
                  console.log(`Résultat de l'attachement du tag:`, attachResult);
                }
              } catch (error) {
                console.warn(`Erreur lors du traitement du tag "${tagName}":`, error);
                // Continuer avec le tag suivant
              }
            }
          }
        } catch (error) {
          console.error("Erreur générale lors de la gestion des tags:", error);
          // Afficher une notification mais ne pas bloquer le processus
          toast({
            title: "Avertissement",
            description: "Certains tags n'ont pas pu être ajoutés. Ils pourront être ajoutés ultérieurement.",
            variant: "destructive"
          });
        }
      }

      // Gestion des ressources
      if (course.resources && course.resources.length > 0) {
        console.log("Ajout des ressources...");
        for (const resource of course.resources) {
          try {
            console.log("Ajout de la ressource:", resource.title);
              await courseService.addResource(courseId, {
                title: resource.title,
                type: resource.type,
              file_url: typeof resource.file_url === 'string' ? resource.file_url : '',
                is_downloadable: resource.is_downloadable
              });
          } catch (resourceError) {
            console.error(`Erreur lors de l'ajout de la ressource "${resource.title}":`, resourceError);
          }
        }
      }

      // Finalisation
      console.log("Soumission du formulaire terminée avec succès");

      // Le reste du code pour les sections, leçons, etc.
      
      // Notification finale
      toast({
        title: isEditing ? "Cours mis à jour" : "Cours créé avec succès",
        description: isEditing 
          ? "Votre cours a été mis à jour avec succès." 
          : "Votre cours a été créé et est maintenant en mode brouillon.",
      });

      // Navigation après succès
      if (onSuccess) {
        console.log("Appel du callback onSuccess");
        onSuccess();
      } else {
        console.log("Redirection vers la page d'accueil");
      navigate("/");
      }
    } catch (error: any) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast({
        title: isEditing ? "Erreur lors de la mise à jour" : "Erreur lors de la création",
        description: `Une erreur s'est produite: ${error.message || "Erreur inconnue"}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation between steps
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Basic Information</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={course.title || ""}
                  onChange={(e) =>
                    setCourse({ ...course, title: e.target.value })
                  }
                  placeholder="e.g. Complete Web Development Bootcamp 2023"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subtitle">Course Subtitle *</Label>
                <Input
                  id="subtitle"
                  value={course.subtitle}
                  onChange={(e) =>
                    setCourse({ ...course, subtitle: e.target.value })
                  }
                  placeholder="e.g. Learn web development from scratch"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  value={course.description}
                  onChange={(e) =>
                    setCourse({ ...course, description: e.target.value })
                  }
                  placeholder="Provide a detailed description of your course"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={course.category_id ? course.category_id.toString() : ''}
                    onValueChange={(value: string) => {
                      console.log("Nouvelle catégorie sélectionnée:", value);
                      setCourse({
                        ...course,
                        category_id: Number(value),
                        subcategory: "",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories &&
                        categories.map((category) => {
                          console.log(`Affichage catégorie: ${category.id} (${typeof category.id})`); 
                          return (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={course.subcategory}
                    onValueChange={(value: string) =>
                      setCourse({ ...course, subcategory: value })
                    }
                    disabled={!course.category_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {course.category_id &&
                        Array.isArray(categories) && (
                        (() => {
                          // Conversion explicite en string pour la comparaison
                          const categoryIdStr = course.category_id.toString();
                          console.log("Recherche de sous-catégories pour:", categoryIdStr);
                          
                          const foundCategory = categories.find(cat => {
                            console.log(`Comparaison: ${cat.id} vs ${categoryIdStr} => ${cat.id === categoryIdStr}`);
                            return cat.id === categoryIdStr;
                          });
                          
                          return foundCategory?.subcategories?.map((subcategory) => (
                            <SelectItem
                              key={subcategory.id}
                              value={subcategory.id}
                            >
                              {subcategory.title}
                            </SelectItem>
                          ));
                        })()
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={course.level}
                    onValueChange={(value) =>
                      setCourse({
                        ...course,
                        level: value as
                          | "beginner"
                          | "intermediate"
                          | "advanced",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="language">Language *</Label>
                  <Select
                    value={course.language}
                    onValueChange={(value) =>
                      setCourse({ ...course, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Regular Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={course.price !== undefined ? course.price : 0}
                    onChange={(e) =>
                      setCourse({
                        ...course,
                        price: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="salePrice">Sale Price ($)</Label>
                    <Checkbox
                      checked={course.salePrice !== undefined}
                      onCheckedChange={handleSalePriceChange}
                    />
                  </div>
                  <Input
                    id="salePrice"
                    type="number"
                    value={course.salePrice !== undefined ? course.salePrice : ""}
                    onChange={(e) =>
                      setCourse({
                        ...course,
                        salePrice: Number.parseFloat(e.target.value),
                      })
                    }
                    disabled={course.salePrice === undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Course Content</h2>
            <p className="text-muted-foreground">
              Create sections and lessons for your course. Drag and drop to
              reorder them.
            </p>

            <Button
              onClick={handleAddSection}
              variant="outline"
              className="w-full py-8 border-dashed flex items-center justify-center"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Section
            </Button>

            {course.sections && course.sections.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections" type="SECTION">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {course.sections.map((section, sectionIndex) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={sectionIndex}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border rounded-lg ${
                                snapshot.isDragging
                                  ? "bg-muted shadow-lg"
                                  : "bg-card"
                              }`}
                            >
                              <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mr-2 cursor-grab"
                                  >
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <div
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => toggleSection(section.id)}
                                  >
                                    <button className="mr-1">
                                      {expandedSections.includes(section.id) ? (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </button>
                                    <div>
                                      <h3 className="font-medium text-lg">
                                        {sectionIndex + 1}. {section.title}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        {section.lessons.length} lessons •{" "}
                                        {section.lessons.reduce(
                                          (acc, lesson) => {
                                            // Si la durée est un nombre, l'utiliser directement
                                            if (typeof lesson.duration === 'number') {
                                              return acc + (lesson.duration || 0);
                                            }
                                            // Sinon, si c'est une chaîne au format "min:sec"
                                            else if (typeof lesson.duration === 'string' && lesson.duration.includes(':')) {
                                              const [min, sec] = lesson.duration.split(':').map(Number);
                                            return acc + min * 60 + (sec || 0);
                                            }
                                            // Pour tout autre cas, retourner simplement l'accumulateur
                                            return acc;
                                          },
                                          0
                                        ) / 60}{" "}
                                        min
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditSection(section)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="ml-1 hidden md:inline">
                                      Edit
                                    </span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAddLesson(section.id)}
                                  >
                                    <Plus className="h-4 w-4" />
                                    <span className="ml-1 hidden md:inline">
                                      Add Lesson
                                    </span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600"
                                    onClick={() =>
                                      handleDelete("section", section.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Lessons container */}
                              {expandedSections.includes(section.id) && (
                                <div className="border-t px-4 py-2">
                                  <Droppable
                                    droppableId={section.id}
                                    type="LESSON"
                                  >
                                    {(provided) => (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-2"
                                      >
                                        {section.lessons.map(
                                          (lesson, lessonIndex) => (
                                            <Draggable
                                              key={lesson.id || `new-lesson-${lessonIndex}`}
                                              draggableId={lesson.id || `new-lesson-${lessonIndex}`}
                                              index={lessonIndex}
                                            >
                                              {(provided, snapshot) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  className={`flex items-center p-2 rounded-md ${
                                                    snapshot.isDragging
                                                      ? "bg-muted shadow-md"
                                                      : "hover:bg-muted/50"
                                                  }`}
                                                >
                                                  <div className="flex items-center flex-1">
                                                    <div
                                                      {...provided.dragHandleProps}
                                                      className="mr-2 cursor-grab"
                                                    >
                                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                    </div>

                                                    <div
                                                      className={`mr-3 flex h-7 w-7 items-center justify-center rounded-full
                                                    ${
                                                      lesson.content_type ===
                                                      "video"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : lesson.content_type ===
                                                          "article"
                                                        ? "bg-purple-100 text-purple-600"
                                                        : lesson.content_type ===
                                                          "quiz"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-amber-100 text-amber-600"
                                                    }`}
                                                    >
                                                      {lesson.content_type ===
                                                      "video" ? (
                                                        <Video className="h-3.5 w-3.5" />
                                                      ) : lesson.content_type ===
                                                        "article" ? (
                                                        <FileText className="h-3.5 w-3.5" />
                                                      ) : lesson.content_type ===
                                                        "quiz" ? (
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                      ) : (
                                                        <PenTool className="h-3.5 w-3.5" />
                                                      )}
                                                    </div>

                                                    <div className="flex-1">
                                                      <div className="flex items-center">
                                                        <span className="font-medium">
                                                          {sectionIndex + 1}.
                                                          {lessonIndex + 1}{" "}
                                                          {lesson.title}
                                                        </span>
                                                        {lesson.preview && (
                                                          <Badge className="ml-2 text-xs bg-purple-100 text-purple-600 hover:bg-purple-100">
                                                            Preview
                                                          </Badge>
                                                        )}
                                                      </div>
                                                      <div className="flex items-center text-xs text-muted-foreground">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        {lesson.duration}
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div className="flex items-center gap-1">
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() =>
                                                        handleEditLesson(
                                                          section.id,
                                                          lesson.id || `temp-lesson-${Date.now()}`
                                                        )
                                                      }
                                                    >
                                                      <Edit className="h-4 w-4" />
                                                      <span className="ml-1 hidden md:inline">
                                                        Edit
                                                      </span>
                                                    </Button>

                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="text-red-600"
                                                      onClick={() =>
                                                        handleDelete(
                                                          "lesson",
                                                          lesson.id || `temp-lesson-${Date.now()}`,
                                                          section.id
                                                        )
                                                      }
                                                    >
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              )}
                                            </Draggable>
                                          )
                                        )}
                                        {provided.placeholder}

                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            handleAddLesson(section.id)
                                          }
                                          className="w-full mt-2 border border-dashed text-muted-foreground"
                                        >
                                          <Plus className="mr-2 h-4 w-4" />
                                          Add Lesson
                                        </Button>
                                      </div>
                                    )}
                                  </Droppable>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Aucun section pour l'instant
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding a section to your course. Each section can
                  contain multiple lessons.
                </p>
                <Button
                  onClick={handleAddSection}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Section
                </Button>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Course Details</h2>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Image du cours</CardTitle>
                  <CardDescription>
                    Téléchargez une image de haute qualité qui représente votre
                    cours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative aspect-video overflow-hidden rounded-lg border">
                      <img
                        src={
                          course.image_url ||
                          "/placeholder.svg?height=400&width=600"
                        }
                        alt="Miniature du cours"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="cursor-pointer">
                        <input
                            id="course-image-upload"
                          type="file"
                          accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setCourse({
                                    ...course,
                                    image_url: event.target?.result as string
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <Button 
                            variant="secondary" 
                            type="button"
                            onClick={() => {
                              document.getElementById('course-image-upload')?.click();
                            }}
                          >
                          <Upload className="mr-2 h-4 w-4" />
                          Télécharger l'image
                        </Button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Taille recommandée : 1280x720 pixels (ratio 16:9)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Tags</CardTitle>
                  <CardDescription>
                    Add tags to help students find your course.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {course.tags &&
                        course.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-sm"
                        >
                          {tag}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                      {course.tags && course.tags.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No tags added yet
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Entrez un tag personnalisé"
                          value={selectedTag}
                          onChange={(e) => setSelectedTag(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button variant="outline" onClick={handleAddTag}>
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What Students Will Learn</CardTitle>
                  <CardDescription>
                    List the key learning outcomes for your course.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.what_you_will_learn &&
                      course.what_you_will_learn.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex gap-2">
                            <p className="flex-1">{item}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                                onClick={() =>
                                  handleRemoveLearningOutcome(index)
                                }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {course.what_you_will_learn &&
                      course.what_you_will_learn.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No learning outcomes added yet
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a learning outcome"
                        value={newLearningOutcome}
                        onChange={(e) => setNewLearningOutcome(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddLearningOutcome();
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={handleAddLearningOutcome}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                  <CardDescription>
                    List any prerequisites or requirements for taking this
                    course.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.requirements?.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-500 mt-2" />
                        <div className="flex-1">
                          <div className="flex gap-2">
                            <p className="flex-1">{item}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveRequirement(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {course.requirements?.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Aucun prérequis ajouté pour l'instant
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a requirement"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddRequirement();
                          }
                        }}
                      />
                      <Button variant="outline" onClick={handleAddRequirement}>
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Review & Submit</h2>
            <p className="text-muted-foreground">
              Review your course details before submitting. Your course will be
              created in draft mode.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Course Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Title
                      </h3>
                      <p>{course.title}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Subtitle
                      </h3>
                      <p>{course.subtitle}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Description
                    </h3>
                    <p className="line-clamp-3">{course.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Category
                      </h3>
                      <p>
                        {categories &&
                          course.category_id &&
                          categories.find((c) => c.id === course.category_id)
                            ?.title}
                        {course.subcategory &&
                          categories &&
                          course.category_id &&
                          ` / ${
                            categories
                              .find((c) => c.id === course.category_id)
                              ?.subcategories?.find(
                                (s) => s.id === course.subcategory
                              )?.title || ""
                          }`}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Level
                      </h3>
                      <p>
                        {course.level ? course.level.charAt(0).toUpperCase() +
                          course.level.slice(1) : 'Débutant'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Language
                      </h3>
                      <p>
                        {course.language ? course.language.charAt(0).toUpperCase() +
                          course.language.slice(1) : 'Français'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Price
                      </h3>
                      <p>${typeof course.price === 'number' ? course.price.toFixed(2) : Number(course.price).toFixed(2)}</p>
                    </div>
                    {course.salePrice && (
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground">
                          Sale Price
                        </h3>
                        <p>${typeof course.salePrice === 'number' ? course.salePrice.toFixed(2) : Number(course.salePrice).toFixed(2)}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Course Content
                    </h3>
                    <p>
                      {course.sections?.length || 0} sections •{" "}
                      {course.sections?.reduce(
                        (total, section) => total + section.lessons.length,
                        0
                      ) || 0}
                      lessons
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {course.tags &&
                        course.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                      {course.tags && course.tags.length === 0 && (
                        <p>No tags added</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>After creating your course, you'll be able to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Upload videos and other content for your lessons</li>
                    <li>Preview your course as a student would see it</li>
                    <li>Set up quizzes and assignments</li>
                    <li>
                      Submit your course for review when it's ready to publish
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? "Creating Course..." : "Create Course"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  function handleFileUpload(id: string): void {
    throw new Error("Function not implemented.");
  }

  const handleEditTag = (oldTag: string, newTag: string) => {
    setCourse((prevCourse: CourseData) => ({
      ...prevCourse,
      tags: prevCourse.tags.map(tag => tag === oldTag ? newTag : tag)
    }));
  };

  const handleEditResource = (resourceId: string, updatedResource: Partial<Resource>) => {
    setCourse((prevCourse: CourseData) => ({
      ...prevCourse,
      resources: prevCourse.resources.map(resource => 
        resource.id === resourceId ? { ...resource, ...updatedResource } : resource
      )
    }));
  };

  // Correction de la gestion du prix dans le sélecteur de vente
  const handleSalePriceChange = (checked: boolean) => {
    if (checked) {
      const currentPrice = typeof course.price === 'number' ? course.price : Number(course.price || 0);
      setCourse({
        ...course,
        salePrice: currentPrice * 0.8,
      });
    } else {
      const { salePrice, ...rest } = course;
      setCourse(rest as CourseData);
    }
  };

  // Extraction de la préparation des données de cours dans une fonction séparée
  const prepareCourseDataForApi = () => {
    return {
      title: course.title,
      description: course.description,
      category_id: course.category_id.toString(), // Conversion en string pour l'API
      level: course.level,
      language: course.language,
      instructor_id: course.instructor_id,
      price: typeof course.price === 'number' ? course.price : Number(course.price || 0),
      discount: typeof course.discount === 'number' ? course.discount : Number(course.discount || 0),
      image_url: course.image_url,
      status: course.status || "draft",
      subtitle: course.subtitle
    };
  };

  // Modifier la partie qui gère le `content_url` pour mieux traiter les objets File
  // Dans handleSaveLesson, conservons l'objet File dans l'état local mais utilisons une URL pour l'API
  const prepareContentUrlForApi = (contentUrl: any): string => {
    if (typeof contentUrl === 'string') {
      return contentUrl;
    } else if (contentUrl && typeof contentUrl === 'object' && 'name' in contentUrl) {
      // Pour l'API, nous devons uploader le fichier et obtenir une URL
      console.log("Fichier détecté dans prepareContentUrlForApi:", contentUrl.name);
      
      // Pour l'instant, retourner le nom du fichier comme référence
      // Dans un système complet, il faudrait d'abord uploader le fichier et attendre l'URL
      return contentUrl.name;
    }
    return '';
  };

  return (
    <div className="max-w-full">
      {/* Progress steps */}
      <div className="mb-6">
        <div className="flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center ${index > 0 ? "flex-1" : ""}`}
              onClick={() => setCurrentStep(index + 1)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index + 1 <= currentStep
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-500"
                } cursor-pointer`}
              >
                {index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    index + 1 < currentStep ? "bg-purple-600" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-sm">Info. basiques</div>
          <div className="text-sm">Contenu</div>
          <div className="text-sm">Détails</div>
          <div className="text-sm">Révision</div>
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg border p-6 mb-6 overflow-y-auto max-h-[calc(70vh-200px)]">
        {renderStepContent()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>
        {currentStep < totalSteps ? (
          <Button
            onClick={goToNextStep}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Suivant
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting 
              ? isEditing ? "Mise à jour..." : "Création..." 
              : isEditing ? "Mettre à jour" : "Créer"}
          </Button>
        )}
      </div>

      {/* Section Dialog */}
      <Dialog
        open={showSectionDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowSectionDialog(false);
            setCurrentSection(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentSection?.title ? "Edit Section" : "Add New Section"}
            </DialogTitle>
            <DialogDescription>
              {currentSection?.title
                ? "Update the details for this section"
                : "Add a new section to your course"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sectionTitle">Section Title *</Label>
              <Input
                id="sectionTitle"
                value={currentSection?.title || ""}
                onChange={(e) =>
                  currentSection &&
                  setCurrentSection({
                    ...currentSection,
                    title: e.target.value,
                  })
                }
                placeholder="e.g. Introduction to the Course"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sectionDescription">Description (Optional)</Label>
              <Textarea
                id="sectionDescription"
                value={currentSection?.description || ""}
                onChange={(e) =>
                  currentSection &&
                  setCurrentSection({
                    ...currentSection,
                    description: e.target.value,
                  })
                }
                placeholder="Briefly describe what this section covers"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSectionDialog(false);
                setCurrentSection(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSection}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog
        open={showLessonDialog}
        onOpenChange={(open) => {
          console.log("État du dialogue de leçon modifié:", open);
          if (!open) {
            // Uniquement fermer sans sauvegarder
            setShowLessonDialog(false);
            setCurrentLesson(null);
            setCurrentSection(null);
            console.log("Dialogue de leçon fermé sans sauvegarde");
          }
        }}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentLesson?.id && !currentLesson.id.startsWith("temp-lesson")
                ? "Modifier la leçon"
                : "Ajouter une leçon"}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="lessonTitle">Lesson Title *</Label>
                <Input
                  id="lessonTitle"
                  value={currentLesson?.title || ""}
                  onChange={(e) =>
                    currentLesson &&
                    setCurrentLesson({
                      ...currentLesson,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Introduction to HTML"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lessonDescription">
                  Description (Optional)
                </Label>
                <Textarea
                  id="lessonDescription"
                  value={currentLesson?.description || ""}
                  onChange={(e) =>
                    currentLesson &&
                    setCurrentLesson({
                      ...currentLesson,
                      description: e.target.value,
                    })
                  }
                  placeholder="Briefly describe what this lesson covers"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lessonType">Content Type *</Label>
                <Select
                  value={currentLesson?.content_type || "video"}
                  onValueChange={(value) =>
                    currentLesson &&
                    setCurrentLesson({
                      ...currentLesson,
                      content_type: value as "video" | "pdf" | "article" | "quiz" | "assignment",
                      // Réinitialiser les URLs spécifiques au type lors du changement
                      ...(value === "video" ? { pdf_url: undefined } : {}),
                      ...(value === "pdf" ? { video_url: undefined } : {})
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={currentLesson?.duration || ""}
                  onChange={(e) =>
                    currentLesson &&
                    setCurrentLesson({
                      ...currentLesson,
                      duration: e.target.value,
                    })
                  }
                  placeholder="e.g. 10:30"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the duration in format MM:SS (e.g. 10:30 for 10 minutes
                  and 30 seconds)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              {currentLesson?.content_type === "video" && (
                <div className="border rounded-lg p-6">
                  <div className="text-lg font-medium mb-4">Video Upload</div>
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Video className="h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Glissez-déposez votre vidéo ici ou cliquez pour sélectionner
                      </p>
                      <label htmlFor="video-upload" className="mt-2">
                        <div className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}>
                          Upload Video
                        </div>
                      <input
                        type="file"
                          id="video-upload"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      </label>
                    </div>
                  </div>

                  {/* Aperçu si vidéo déjà uploadée */}
                  {currentLesson.video_url && (
                    <div className="mt-4">
                      <video
                        controls
                        className="w-full rounded-lg border"
                        src={currentLesson.video_url}
                      />
                </div>
              )}
                </div>
              )}
              {currentLesson?.content_type === "pdf" && (
                <div className="border rounded-lg p-6">
                  <div className="text-lg font-medium mb-4">PDF Upload</div>
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Glissez-déposez votre PDF ici ou cliquez pour sélectionner
                      </p>
                      <label htmlFor="pdf-upload" className="mt-2">
                        <div className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}>
                          Upload PDF
                        </div>
                      <input
                        type="file"
                          id="pdf-upload"
                          accept="application/pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      </label>
                    </div>
                  </div>

                  {/* Aperçu si PDF déjà uploadé */}
                  {currentLesson.pdf_url && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        <File className="h-5 w-5 text-red-500" />
                        <span className="flex-1 text-sm">Document PDF</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Ouvrir le PDF dans un nouvel onglet
                            window.open(currentLesson.pdf_url, "_blank");
                          }}
                        >
                          Voir
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentLesson?.content_type === "article" && (
                <div className="grid gap-2">
                  <Label htmlFor="articleContent">Article Content</Label>
                  <Textarea
                    id="articleContent"
                    value={typeof currentLesson?.content_url === 'string' ? currentLesson.content_url : ""}
                    onChange={(e) =>
                      currentLesson &&
                      setCurrentLesson({
                        ...currentLesson,
                        content_url: e.target.value,
                      })
                    }
                    rows={12}
                    placeholder="Write your article content here..."
                  />
                </div>
              )}

              {currentLesson?.content_type === "quiz" && (
                <div className="text-center p-6 border rounded-lg">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Quiz Builder</h3>
                  <p className="text-muted-foreground mb-4">
                    You'll be able to create your quiz after the course is
                    created
                  </p>
                  <Button disabled>Open Quiz Builder</Button>
                </div>
              )}

              {currentLesson?.content_type === "assignment" && (
                <div className="grid gap-2">
                  <Label htmlFor="assignmentInstructions">
                    Assignment Instructions
                  </Label>
                  <Textarea
                    id="assignmentInstructions"
                    value={typeof currentLesson?.content_url === 'string' ? currentLesson.content_url : ""}
                    onChange={(e) =>
                      currentLesson &&
                      setCurrentLesson({
                        ...currentLesson,
                        content_url: e.target.value,
                      })
                    }
                    rows={8}
                    placeholder="Provide detailed instructions for the assignment..."
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preview"
                  checked={currentLesson?.preview || false}
                  onCheckedChange={(checked) =>
                    currentLesson &&
                    setCurrentLesson({
                      ...currentLesson,
                      preview: !!checked,
                    })
                  }
                />
                <Label htmlFor="preview">
                  Make this lesson available as a free preview
                </Label>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Resources</CardTitle>
                  <CardDescription>
                    Add downloadable resources for this lesson (PDF, documents, audio, video, or links).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Display current lesson resources */}
                    <div className="space-y-2">
                      {currentLesson?.attachments && currentLesson.attachments.length > 0 ? (
                        currentLesson.attachments.map((resource, index) => (
                          <div
                            key={index}
                            className="border rounded-md overflow-hidden"
                          >
                            <div 
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                              onClick={() => toggleResourceExpanded(resource.id.toString())}
                            >
                              <div className="flex items-center gap-2">
                                {resource.type === "PDF" ? (
                                  <File className="h-5 w-5 text-red-500" />
                                ) : resource.type === "DOCUMENT" ? (
                                  <FileText className="h-5 w-5 text-blue-500" />
                                ) : resource.type === "VIDEO" ? (
                                  <Video className="h-5 w-5 text-purple-500" />
                                ) : resource.type === "AUDIO" ? (
                                  <File className="h-5 w-5 text-green-500" />
                                ) : (
                                  <FileText className="h-5 w-5 text-gray-500" />
                                )}
                                <div>
                                  <div className="flex items-center">
                                    <p className="font-medium">{resource.title}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {resource.type} • {resource.is_downloadable ? "Downloadable" : "Not downloadable"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveLessonResource(resource.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No resources added to this lesson yet
                        </p>
                      )}
                    </div>

                    {/* Add new resource form */}
                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="font-medium">Add New Resource</h3>

                      <div className="grid gap-3">
                        <div className="grid gap-2">
                          <Label htmlFor="resourceTitle">Title *</Label>
                          <Input
                            id="resourceTitle"
                            value={newResource.title}
                            onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                            placeholder="e.g. Lesson Slides, Exercise Files, etc."
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="resourceType">Type *</Label>
                          <Select
                            value={newResource.type}
                            onValueChange={handleResourceTypeChange}
                          >
                            <SelectTrigger id="resourceType">
                              <SelectValue placeholder="Select resource type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ResourceType.PDF}>PDF</SelectItem>
                              <SelectItem value={ResourceType.DOCUMENT}>Document</SelectItem>
                              <SelectItem value={ResourceType.VIDEO}>Video</SelectItem>
                              <SelectItem value={ResourceType.AUDIO}>Audio</SelectItem>
                              <SelectItem value={ResourceType.LINK}>Link</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {newResource.type !== ResourceType.LINK ? (
                          <div className="grid gap-2">
                            <Label htmlFor="resourceFile">Files *</Label>
                            <Input
                              id="resourceFile"
                              type="file"
                              multiple
                              onChange={handleResourceFileSelect}
                              accept={
                                newResource.type === ResourceType.PDF ? ".pdf" :
                                newResource.type === ResourceType.DOCUMENT ? ".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" :
                                newResource.type === ResourceType.VIDEO ? ".mp4,.mov,.avi" :
                                newResource.type === ResourceType.AUDIO ? ".mp3,.wav" : ""
                              }
                            />
                            <p className="text-xs text-muted-foreground">
                              Max file size: 100MB per file. You can select multiple files.
                            </p>

                            {/* Display selected files */}
                            {newResource.files.length > 0 && (
                              <div className="mt-2 space-y-2">
                                <Label>Selected Files ({newResource.files.length})</Label>
                                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                                  {newResource.files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between py-1">
                                      <div className="flex items-center">
                                        <File className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                        <span className="text-xs text-muted-foreground ml-2">
                                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                      </div>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 w-6 p-0 text-red-500"
                                        onClick={() => handleRemoveFile(index)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="grid gap-2">
                            <Label htmlFor="resourceUrl">URL *</Label>
                            <Input
                              id="resourceUrl"
                              type="url"
                              value={newResource.file_url}
                              onChange={(e) => setNewResource({...newResource, file_url: e.target.value})}
                              placeholder="https://example.com/resource"
                            />
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isDownloadable"
                            checked={newResource.is_downloadable}
                            onCheckedChange={(checked) => 
                              setNewResource({...newResource, is_downloadable: !!checked})
                            }
                          />
                          <Label htmlFor="isDownloadable">
                            Allow students to download this resource
                          </Label>
                        </div>
                      </div>

                      <Button 
                        onClick={handleAddLessonResource}
                        disabled={fileUploading}
                        className="w-full"
                      >
                        {fileUploading ? "Uploading..." : "Add Resource to Lesson"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                console.log("Bouton d'annulation cliqué");
                setShowLessonDialog(false);
                setCurrentLesson(null);
                setCurrentSection(null);
              }}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={() => {
                console.log("Bouton de sauvegarde cliqué");
                handleSaveLesson();
              }}
            >
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {itemToDelete?.type === "section"
                ? "Are you sure you want to delete this section and all its lessons? This action cannot be undone."
                : "Are you sure you want to delete this lesson? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {itemToDelete?.type === "section"
                ? "Are you sure you want to delete this section and all its lessons? This action cannot be undone."
                : "Are you sure you want to delete this lesson? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseCreationForm;