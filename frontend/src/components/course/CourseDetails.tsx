import { X, Play, BookOpen, Clock, Star, CheckCircle, ChevronDown, ChevronRight, Layers, Download, MessageSquare, ExternalLink, Share2, Bookmark } from "lucide-react"
import { useState, useEffect } from "react"
import { Course, Lesson } from "../../types/course"
import CourseSections from "./CourseSections"
import LessonViewer from "./LessonViewer"

interface CourseDetailsProps {
  course: Course & {
    progress: number
    completedLessons: number
    totalLessons: number
    lastViewed: string
    bookmarked: boolean
    isArchived: boolean
    estimatedTimeLeft: string
    lastSection: string
    lastLesson: string
  }
  onClose: () => void
}

export default function CourseDetails({ course, onClose }: CourseDetailsProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0)
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0)
  const [isTeacher, setIsTeacher] = useState(false)

  // Vérifier si l'utilisateur est un enseignant
  useEffect(() => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth-storage") || "{}");
      const userRole = authData?.state?.user?.role || "";
      setIsTeacher(userRole === "teacher");
    } catch (error) {
      console.error("Erreur lors de la vérification du rôle:", error);
    }
  }, []);

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    
    // Trouver l'index de la section et de la leçon
    if (course.sections) {
      for (let i = 0; i < course.sections.length; i++) {
        const section = course.sections[i]
        const lessonIndex = section.lessons.findIndex(l => l.id === lesson.id)
        if (lessonIndex !== -1) {
          setCurrentSectionIndex(i)
          setCurrentLessonIndex(lessonIndex)
          break
        }
      }
    }
  }

  const handleCloseLesson = () => {
    setSelectedLesson(null)
  }

  const handleNextLesson = () => {
    if (!course.sections) return
    
    const currentSection = course.sections[currentSectionIndex]
    
    // Si c'est la dernière leçon de la section
    if (currentLessonIndex === currentSection.lessons.length - 1) {
      // Si c'est la dernière section
      if (currentSectionIndex === course.sections.length - 1) {
        return // Ne rien faire, c'est la dernière leçon
      }
      
      // Passer à la première leçon de la section suivante
      setCurrentSectionIndex(currentSectionIndex + 1)
      setCurrentLessonIndex(0)
      setSelectedLesson(course.sections[currentSectionIndex + 1].lessons[0])
    } else {
      // Passer à la leçon suivante de la section actuelle
      setCurrentLessonIndex(currentLessonIndex + 1)
      setSelectedLesson(currentSection.lessons[currentLessonIndex + 1])
    }
  }

  const handlePreviousLesson = () => {
    if (!course.sections) return
    
    // Si c'est la première leçon de la section
    if (currentLessonIndex === 0) {
      // Si c'est la première section
      if (currentSectionIndex === 0) {
        return // Ne rien faire, c'est la première leçon
      }
      
      // Passer à la dernière leçon de la section précédente
      const previousSection = course.sections[currentSectionIndex - 1]
      setCurrentSectionIndex(currentSectionIndex - 1)
      setCurrentLessonIndex(previousSection.lessons.length - 1)
      setSelectedLesson(previousSection.lessons[previousSection.lessons.length - 1])
    } else {
      // Passer à la leçon précédente de la section actuelle
      const currentSection = course.sections[currentSectionIndex]
      setCurrentLessonIndex(currentLessonIndex - 1)
      setSelectedLesson(currentSection.lessons[currentLessonIndex - 1])
    }
  }

  const hasNextLesson = () => {
    if (!course.sections) return false
    
    const currentSection = course.sections[currentSectionIndex]
    
    // Si c'est la dernière leçon de la section
    if (currentLessonIndex === currentSection.lessons.length - 1) {
      // Si c'est la dernière section
      if (currentSectionIndex === course.sections.length - 1) {
        return false
      }
      return true
    }
    
    return true
  }

  const hasPreviousLesson = () => {
    if (!course.sections) return false
    
    // Si c'est la première leçon de la section
    if (currentLessonIndex === 0) {
      // Si c'est la première section
      if (currentSectionIndex === 0) {
        return false
      }
      return true
    }
    
    return true
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4">
          <h2 className="text-xl font-bold">{course.title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3">
              <div className="relative h-64 rounded-lg bg-gray-100 overflow-hidden">
                <img src={course.image_url || "/placeholder.svg"} alt={course.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-[#FF9500] backdrop-blur-sm transition-all hover:bg-white">
                    <Play className="h-8 w-8" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">À propos de ce cours</h3>
                <p className="text-gray-600">{course.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Layers className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Niveau</p>
                      <p className="text-sm text-gray-500">{course.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Leçons</p>
                      <p className="text-sm text-gray-500">{course.totalLessons} au total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <div className="rounded-lg border border-gray-200 bg-[#f7f9fa] p-4">
                <h3 className="text-lg font-bold mb-4">Votre Progression</h3>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Complétion</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-white">
                    <div
                      className={`h-2 rounded-full ${course.progress === 100 ? "bg-green-500" : "bg-[#FF9500]"}`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">Leçons Complétées</span>
                    </div>
                    <span className="text-sm font-medium">
                      {course.completedLessons}/{course.totalLessons}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">Dernière Vue</span>
                    </div>
                    <span className="text-sm">{course.lastViewed}</span>
                  </div>
                </div>

                <button className="mt-4 w-full rounded-md bg-[#FF9500] py-2.5 text-center text-sm font-medium text-white hover:bg-[#8710d8]">
                  Continuer l'Apprentissage
                </button>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Download className="mr-2 h-4 w-4" />
                    Ressources
                  </button>
                  <button className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Q&A
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu du Cours */}
          <div className="mt-6">
            {course.sections && course.sections.length > 0 ? (
              <CourseSections 
                sections={course.sections} 
                onLessonClick={handleLessonClick} 
              />
            ) : (
              <div>
                <h3 className="text-lg font-bold mb-4">Contenu du Cours</h3>
                <p className="text-gray-500">Aucune section disponible pour ce cours.</p>
              </div>
            )}
          </div>

          {/* Informations sur l'Instructeur */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Votre Instructeur</h3>
            <div className="flex items-start gap-4">
              <img
                src="/placeholder.svg?height=80&width=80"
                alt={course.instructor?.first_name || "Instructeur"}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium">
                  {course.instructor ? `${course.instructor.first_name} ${course.instructor.last_name}` : "Instructeur"}
                </h4>
                <p className="text-sm text-gray-500 mt-1">Développeur Professionnel & Instructeur</p>
                <div className="mt-2 flex items-center">
                  <Star className="h-4 w-4 fill-[#eb8a2f] text-[#eb8a2f]" />
                  <span className="ml-1 text-sm">{course.average_rating} Note de l'Instructeur</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{course.reviewCount || 0} Avis</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{course.studentsCount || 0}+ Étudiants</span>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'Action */}
          <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-200 pt-6">
            {!isTeacher && (
              <>
                <button className="flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Voir le Certificat du Cours
                </button>
                <button className="flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager le Cours
                </button>
                <button className="flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Bookmark className="mr-2 h-4 w-4" />
                  {course.bookmarked ? "Retirer des Favoris" : "Sauvegarder le Cours"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Affichage de la leçon sélectionnée */}
      {selectedLesson && (
        <LessonViewer
          lesson={selectedLesson}
          onClose={handleCloseLesson}
          onNext={handleNextLesson}
          onPrevious={handlePreviousLesson}
          hasNext={hasNextLesson()}
          hasPrevious={hasPreviousLesson()}
        />
      )}
    </div>
  )
} 