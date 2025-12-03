import { useState, useEffect } from "react";
import { useUsers, User } from "@/hooks/useUsers";
import { useCourses } from "@/hooks/useCourses";
import { Course as CourseType } from "@/types/course";
import useCategories from "@/hooks/useCategories";
import PendingTeachers from "@/components/admin/PendingTeachers";
import Swal from "sweetalert2";
// import { User } from "@/hooks/useUsers"

import {
  Users,
  BookOpen,
  DollarSign,
  BarChart2,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import axiosClient from "@/api/axios";

interface Course {
  id: string;
  title: string;
  price: string;
  discount: string;
}

interface Order {
  id: string;
  total_amount: string;
  discount: string;
  final_amount: string;
  status: string;
}

interface Invoice {
  id: string;
  download_url: string;
}

interface TransactionUser {
  id: string;
  name: string;
  email: string;
}

interface Transaction {
  id: string;
  transaction_id: string;
  amount: string;
  status: string;
  date: string;
  user: TransactionUser;
  order: Order;
  courses: Course[];
  invoice: Invoice;
}

interface TransactionResponse {
  status: string;
  data: {
    transactions: Transaction[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useCourses();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  console.log("users=",users)
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  });
  const [transactionLoading, setTransactionLoading] = useState(false);

  useEffect(() => {
    if (categoriesError) {
      console.error(
        "Erreur lors du chargement des catégories:",
        categoriesError
      );
    }
  }, [categoriesError]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Données simulées pour le dashboard
  const handleSaveLesson = async () => {
    if (!currentSection || !currentLesson) return;

    if (currentLesson.title.trim() === "") {
      toast({
        title: "Erreur",
        description: "Le titre de la leçon est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      setFileUploading(true);

      let contentUrl = currentLesson.content_url;

      // Upload the file if a file is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("content_type", currentLesson.content_type);

        const response = await axiosClient.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data && response.data.url) {
          contentUrl = response.data.url; // Update content_url with the uploaded file URL
        }
      }

      const lessonData = {
        ...currentLesson,
        duration: currentLesson.duration.toString(),
        content_type: currentLesson.content_type,
        content_url: contentUrl, // Ensure content_url is updated
        section_id: parseInt(currentSection.id),
      };

      console.log("Données de la leçon:", lessonData);

      const isEditing = currentSection.lessons.some(
        (lesson) => lesson.id === currentLesson.id
      );

      let updatedLessons;
      if (isEditing) {
        updatedLessons = currentSection.lessons.map((lesson) =>
          lesson.id === currentLesson.id ? lessonData : lesson
        );
      } else {
        updatedLessons = [...currentSection.lessons, lessonData];
      }

      const updatedSection = {
        ...currentSection,
        lessons: updatedLessons,
      };

      const updatedSections = course.sections?.map((section) =>
        section.id === updatedSection.id ? updatedSection : section
      );

      setCourse({
        ...course,
        sections: updatedSections,
      });

      setShowLessonDialog(false);
      setCurrentLesson(null);
      setCurrentSection(null);
    } catch (error) {
      toast({
        title: "Error creating lesson",
        description: `There was an error creating your lesson. Please try again. ${error}`,
        variant: "destructive",
      });
    } finally {
      setFileUploading(false);
    }
  };
  const stats = [
    {
      title: "Utilisateurs Totaux",
      value: `${users.length}`,
      change: "+12%",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Cours Actifs",
      value: `${courses.filter((course) => course.status === "active").length}`,
      change: "+8%",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Revenus Mensuels",
      value: `€${courses.reduce((acc, course) => acc + course.price, 0)}`,
      change: "+15%",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Taux de Complétion",
      value: `${
        (courses.reduce(
          (acc, course) => acc + (course.status === "completed" ? 1 : 0),
          0
        ) /
          courses.length) *
        100
      }%`,
      change: "+3%",
      icon: <BarChart2 className="h-5 w-5" />,
    },
  ];

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Actif
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Inactif
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            En attente
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Complété
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Remboursé
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleCourseApproval = (
    courseId: number,
    action: "approve" | "reject"
  ) => {
    if (!courseId) return;
    console.log(
      `Course ${courseId} ${action === "approve" ? "approved" : "rejected"}`
    );
    setIsApprovalDialogOpen(false);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      return;
    }

    try {
      await axiosClient.delete(`/api/courses/${courseId}`);
      // La mise à jour de la liste sera gérée par le hook useCourses
    } catch (error) {
      console.error("Erreur lors de la suppression du cours:", error);
    }
  };

  const handleToggleBanUser = async (userId: string, isBanned: boolean) => {
    try {
      // Si l'utilisateur est déjà banni, on le débannit
      if (isBanned) {
        await axiosClient.put(`/api/admin/users/${userId}/ban`, {
          is_banned: false,
          ban_reason: null
        });
        
        // Afficher un message de succès
        Swal.fire({
          title: "Utilisateur débanni",
          text: "L'utilisateur a été débanni avec succès",
          icon: "success",
          confirmButtonColor: "#ff9500",
        });
      } 
      // Sinon, on demande la raison du bannissement
      else {
        const { value: banReason, isConfirmed } = await Swal.fire({
          title: 'Bannir l\'utilisateur',
          input: 'textarea',
          inputLabel: 'Raison du bannissement',
          inputPlaceholder: 'Entrez la raison du bannissement...',
          showCancelButton: true,
          confirmButtonText: 'Bannir',
          cancelButtonText: 'Annuler',
          confirmButtonColor: "#ff9500",
        });

        if (isConfirmed) {
          await axiosClient.put(`/api/admin/users/${userId}/ban`, {
            is_banned: true,
            ban_reason: banReason || "Aucune raison fournie"
          });
          
          // Afficher un message de succès
          Swal.fire({
            title: "Utilisateur banni",
            text: "L'utilisateur a été banni avec succès",
            icon: "success",
            confirmButtonColor: "#ff9500",
          });
        } else {
          // Si l'utilisateur annule, on arrête la fonction
          return;
        }
      }
      
      // Rafraîchir la liste des utilisateurs
      try {
      const response = await axiosClient.get("/api/users");
        const updatedUsers = response.data;
        // Mettre à jour manuellement l'état local des utilisateurs
        const { users, loading, error } = useUsers();
        // Recharger la page pour afficher les changements
        window.location.reload();
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la liste des utilisateurs:", error);
      }
    } catch (error) {
      console.error("Erreur lors du bannissement/débannissement de l'utilisateur:", error);
      
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors du traitement de la demande",
        icon: "error",
        confirmButtonColor: "#ff9500",
      });
    }
  };

  const handleEditCourse = (course: CourseType) => {
    setSelectedCourse(course);
    setIsApprovalDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsApprovalDialogOpen(true);
  };

  const handleStatusChange = async (courseId: string, newStatus: string) => {
    try {
      await axiosClient.put(`/api/courses/${courseId}`, {
        status: newStatus
      });
      
      // Rafraîchir la liste des cours
      const response = await axiosClient.get("/api/courses");
      const updatedCourses = response.data;
      // Note: La mise à jour des cours sera gérée par le hook useCourses
    } catch (error) {
      console.error("Erreur lors de la modification du statut:", error);
    }
  };

  const fetchTransactions = async (page = 1) => {
    try {
      setTransactionLoading(true);
      const response = await axiosClient.get<TransactionResponse>('/api/payments', {
        params: { page }
      });
      
      if (response.data.status === 'success') {
        setTransactions(response.data.data.transactions);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des transactions:", error);
      setTransactions([]);
    } finally {
      setTransactionLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fonction pour ajouter une catégorie
  const handleAddCategory = async () => {
    try {
      const title = (document.getElementById('title') as HTMLInputElement).value;
      const description = (document.getElementById('description') as HTMLInputElement).value;
      const imageInput = document.getElementById('image') as HTMLInputElement;
      
      if (!title) {
        Swal.fire({
          title: "Erreur",
          text: "Le titre de la catégorie est requis",
          icon: "error",
          confirmButtonColor: "#ff9500",
        });
        return;
      }
      
      // Création du FormData si une image est sélectionnée
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      
      if (imageInput.files && imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
      }
      
      await axiosClient.post('/api/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Afficher un message de succès
      Swal.fire({
        title: "Catégorie ajoutée",
        text: "La catégorie a été ajoutée avec succès",
        icon: "success",
        confirmButtonColor: "#ff9500",
      });
      
      // Recharger les catégories
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors de l'ajout de la catégorie",
        icon: "error",
        confirmButtonColor: "#ff9500",
      });
    }
  };
  
  // Fonction pour supprimer une catégorie
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Cette action est irréversible et supprimera également toutes les sous-catégories associées.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff9500",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler"
      });
      
      if (result.isConfirmed) {
        await axiosClient.delete(`/api/categories/${categoryId}`);
        
        Swal.fire({
          title: "Supprimé !",
          text: "La catégorie a été supprimée avec succès.",
          icon: "success",
          confirmButtonColor: "#ff9500",
        });
        
        // Recharger les catégories
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors de la suppression de la catégorie",
        icon: "error",
        confirmButtonColor: "#ff9500",
      });
    }
  };
  
  // Fonction pour éditer une catégorie
  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    Swal.fire({
      title: 'Modifier la catégorie',
      html: `
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-title">
            Titre
          </label>
          <input 
            id="edit-title" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            value="${category.title}" 
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-description">
            Description
          </label>
          <textarea 
            id="edit-description" 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          >${category.description || ''}</textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#ff9500',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sauvegarder',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const title = (document.getElementById('edit-title') as HTMLInputElement).value;
        const description = (document.getElementById('edit-description') as HTMLTextAreaElement).value;
        
        if (!title) {
          Swal.showValidationMessage('Le titre est requis');
          return false;
        }
        
        return { title, description };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosClient.put(`/api/categories/${categoryId}`, {
            title: result.value.title,
            description: result.value.description
          });
          
          Swal.fire({
            title: 'Catégorie mise à jour',
            text: 'La catégorie a été mise à jour avec succès',
            icon: 'success',
            confirmButtonColor: '#ff9500'
          });
          
          // Recharger les catégories
          window.location.reload();
        } catch (error) {
          console.error("Erreur lors de la mise à jour de la catégorie:", error);
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la mise à jour de la catégorie',
            icon: 'error',
            confirmButtonColor: '#ff9500'
          });
        }
      }
    });
  };

  const filterTransactions = (transaction) => {
    if (transactionFilters.status !== 'all' && transaction.status !== transactionFilters.status) {
      return false;
    }

    if (transactionFilters.period !== 'all') {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      
      switch (transactionFilters.period) {
        case 'today':
          return transactionDate.toDateString() === today.toDateString();
        case 'week':
          const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= lastWeek;
        case 'month':
          return transactionDate.getMonth() === today.getMonth() && 
                 transactionDate.getFullYear() === today.getFullYear();
        case 'year':
          return transactionDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    }

    return true;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-primary" />
            {isSidebarOpen && (
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
                openCode
              </span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>
        <nav className="mt-5 px-2">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${
              !isSidebarOpen && "justify-center"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart2 className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Vue d'ensemble</span>}
          </Button>
          <Button
            variant={activeTab === "courses" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${
              !isSidebarOpen && "justify-center"
            }`}
            onClick={() => setActiveTab("courses")}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Cours</span>}
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${
              !isSidebarOpen && "justify-center"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Utilisateurs</span>}
          </Button>
          <Button
            variant={activeTab === "categories" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${
              !isSidebarOpen && "justify-center"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Catégories</span>}
          </Button>
          <Button
            variant={activeTab === "finance" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${
              !isSidebarOpen && "justify-center"
            }`}
            onClick={() => setActiveTab("finance")}
          >
            <DollarSign className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Finances</span>}
          </Button>
          <Button
            variant={activeTab === "reports" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${
              !isSidebarOpen && "justify-center"
            }`}
            onClick={() => setActiveTab("reports")}
          >
            <BarChart2 className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Rapports</span>}
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${
              !isSidebarOpen && "justify-center"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Paramètres</span>}
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                {activeTab === "overview" && "Vue d'ensemble"}
                {activeTab === "courses" && "Gestion des Cours"}
                {activeTab === "users" && "Gestion des Utilisateurs"}
                {activeTab === "categories" && "Gestion des Catégories"}
                {activeTab === "finance" && "Finances"}
                {activeTab === "reports" && "Rapports"}
                {activeTab === "settings" && "Paramètres"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage
                        src="/placeholder.svg?height=40&width=40"
                        alt="Admin"
                      />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profil</DropdownMenuItem>
                  <DropdownMenuItem>Paramètres</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Déconnexion</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 flex justify-start border-b border-gray-200 pb-0">
              <TabsTrigger
                value="overview"
                className={`px-4 py-2 ${
                  activeTab === "overview"
                    ? "border-b-2 border-[#ff9500] text-[#ff9500]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className={`px-4 py-2 ${
                  activeTab === "users"
                    ? "border-b-2 border-[#ff9500] text-[#ff9500]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className={`px-4 py-2 ${
                  activeTab === "courses"
                    ? "border-b-2 border-[#ff9500] text-[#ff9500]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Cours
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className={`px-4 py-2 ${
                  activeTab === "categories"
                    ? "border-b-2 border-[#ff9500] text-[#ff9500]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Catégories
              </TabsTrigger>
              <TabsTrigger
                value="pendingTeachers"
                className={`px-4 py-2 ${
                  activeTab === "pendingTeachers"
                    ? "border-b-2 border-[#ff9500] text-[#ff9500]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Enseignants en attente
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className={`px-4 py-2 ${
                  activeTab === "transactions"
                    ? "border-b-2 border-[#ff9500] text-[#ff9500]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className={`px-4 py-2 ${
                  activeTab === "settings"
                    ? "border-b-2 border-[#ff9500] text-[#ff9500]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Paramètres
              </TabsTrigger>
            </TabsList>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.title}
                      </CardTitle>
                      <div className="p-2 bg-primary/10 rounded-full">
                        {stat.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-green-500 mt-1">
                        {stat.change} depuis le mois dernier
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts and Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cours en Attente d'Approbation</CardTitle>
                    <CardDescription>
                      Cours récemment soumis nécessitant une révision
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Titre du Cours</TableHead>
                          <TableHead>Instructeur</TableHead>
                          <TableHead>Soumis le</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses
                          .filter((course) => course.status === "pending")
                          .map((course) => (
                            <TableRow key={course.id}>
                              <TableCell className="font-medium">
                                {course.title}
                              </TableCell>
                              <TableCell>
                                {course.instructor?.firstName}{" "}
                                {course.instructor?.lastName}
                              </TableCell>
                              <TableCell>
                                {course.submitted
                                  ? new Date(
                                      course.submitted
                                    ).toLocaleDateString()
                                  : "Non spécifié"}
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedCourse(course)}
                                    >
                                      Réviser
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Révision du Cours
                                      </DialogTitle>
                                      <DialogDescription>
                                        Examinez les détails du cours avant de
                                        l'approuver ou de le rejeter.
                                      </DialogDescription>
                                    </DialogHeader>
                                    {selectedCourse && (
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <h3 className="font-semibold">
                                            {selectedCourse.title}
                                          </h3>
                                          <p className="text-sm text-gray-500">
                                            Par{" "}
                                            {
                                              selectedCourse.instructor
                                                .first_name
                                            }
                                          </p>
                                          <Badge>
                                            {
                                              categories.find(
                                                (category) =>
                                                  category.id ===
                                                  selectedCourse.category_id
                                              )?.name
                                            }
                                          </Badge>
                                        </div>
                                        <div className="space-y-2">
                                          <h4 className="text-sm font-medium">
                                            Description du cours
                                          </h4>
                                          <p className="text-sm">
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit. Nullam
                                            in dui mauris. Vivamus hendrerit
                                            arcu sed erat molestie vehicula.
                                          </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <h4 className="text-sm font-medium">
                                              Durée
                                            </h4>
                                            <p className="text-sm">8 heures</p>
                                          </div>
                                          <div>
                                            <h4 className="text-sm font-medium">
                                              Niveau
                                            </h4>
                                            <p className="text-sm">
                                              Intermédiaire
                                            </p>
                                          </div>
                                          <div>
                                            <h4 className="text-sm font-medium">
                                              Prix
                                            </h4>
                                            <p className="text-sm">€49.99</p>
                                          </div>
                                          <div>
                                            <h4 className="text-sm font-medium">
                                              Langue
                                            </h4>
                                            <p className="text-sm">Français</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          handleCourseApproval(
                                            selectedCourse?.id,
                                            "reject"
                                          )
                                        }
                                      >
                                        Rejeter
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleCourseApproval(
                                            selectedCourse?.id,
                                            "approve"
                                          )
                                        }
                                      >
                                        Approuver
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        {users
                          .filter(
                            (user) => new Date(user.created_at) > new Date()
                          )
                          .map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage
                                      src={`/placeholder.svg?height=32&width=32`}
                                    />
                                    <AvatarFallback>
                                      {user.lastName
                                        .substring(0, 2)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {user.lastName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    user.role === "student"
                                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                      : user.role === "instructor"
                                      ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                      : "bg-green-100 text-green-800 hover:bg-green-100"
                                  }
                                >
                                  {user.role === "student"
                                    ? "Étudiant"
                                    : user.role === "instructor"
                                    ? "Instructeur"
                                    : "Admin"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(user.joined).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{user.courses}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setActiveTab("users")}
                    >
                      Gérer les utilisateurs
                    </Button>
                  </CardFooter>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Transactions Récentes</CardTitle>
                    <CardDescription>
                      Dernières transactions financières sur la plateforme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transactionLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID Transaction</TableHead>
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Cours</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Statut</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.slice(0, 5).map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">
                                #{transaction.transaction_id}
                              </TableCell>
                              <TableCell>
                                {transaction.user.name}
                              </TableCell>
                              <TableCell>
                                {transaction.courses.map(course => course.title).join(", ")}
                              </TableCell>
                              <TableCell>
                                {parseFloat(transaction.amount).toFixed(2)} €
                              </TableCell>
                              <TableCell>
                                {new Date(transaction.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  transaction.status === "completed" ? "bg-green-100 text-green-800" :
                                  transaction.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"
                                }>
                                  {transaction.status === "completed" ? "Complété" :
                                   transaction.status === "pending" ? "En attente" :
                                   "Remboursé"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setActiveTab("finance")}
                    >
                      Voir toutes les transactions
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion des Cours</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              {coursesLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : coursesError ? (
                <div className="text-red-500 text-center">{coursesError}</div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Titre du Cours</TableHead>
                          <TableHead>Instructeur</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Date de création</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                          {courses.map((course: CourseType) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">
                              {course.title}
                            </TableCell>
                            <TableCell>
                              {course.instructor
                                ? `${course.instructor.first_name} ${course.instructor.last_name}`
                                : "Non spécifié"}
                            </TableCell>
                            <TableCell>
                              {categories.find(
                                (category) => category.id === course.category_id
                              )?.title || "Non spécifié"}
                            </TableCell>
                            <TableCell>
                              {course.created_at
                                ? new Date(course.created_at).toLocaleDateString()
                                : "Non spécifié"}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <Badge className={
                                  course.status === "published" ? "bg-green-100 text-green-800" :
                                  course.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-gray-100 text-gray-800"
                                }>
                                  {course.status === "published" ? "Publié" :
                                   course.status === "draft" ? "Brouillon" :
                                   "Archivé"}
                                </Badge>
                                <Select
                                  defaultValue={course.status}
                                  onValueChange={(value) => {
                                    if (window.confirm(`Êtes-vous sûr de vouloir changer le statut en "${
                                      value === "published" ? "Publié" :
                                      value === "draft" ? "Brouillon" :
                                      "Archivé"
                                    }" ?`)) {
                                      handleStatusChange(course.id, value);
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Changer le statut" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="draft">Brouillon</SelectItem>
                                    <SelectItem value="published">Publié</SelectItem>
                                    <SelectItem value="archived">Archivé</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              {usersLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : usersError ? (
                <div className="text-red-500 text-center">{usersError}</div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rôle</TableHead>
                          <TableHead>Date d'inscription</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user: User) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                {user.is_banned && (
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100 mr-2">
                                    Banni
                                  </Badge>
                                )}
                              
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                    size="sm"
                                    className={user.is_banned ? "text-green-600" : "text-red-600"}
                                    onClick={() => handleToggleBanUser(user.id.toString(), user.is_banned)}
                                  >
                                    {user.is_banned ? 'Débannir' : 'Bannir'}
                                  </Button>
                                  {user.is_banned && user.ban_reason && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        Swal.fire({
                                          title: "Raison du bannissement",
                                          text: user.ban_reason || "Aucune raison fournie",
                                          icon: "info",
                                          confirmButtonColor: "#ff9500",
                                        });
                                      }}
                                    >
                                      Voir raison
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Gestion des Catégories</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-[#ff9500] hover:bg-[#e68600]">
                        Ajouter une catégorie
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
                        <DialogDescription>
                          Créez une nouvelle catégorie pour organiser les cours
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="title" className="text-right">
                            Titre
                          </label>
                          <Input
                            id="title"
                            placeholder="Titre de la catégorie"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="description" className="text-right">
                            Description
                          </label>
                          <Input
                            id="description"
                            placeholder="Description de la catégorie"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="image" className="text-right">
                            Image
                          </label>
                          <Input
                            id="image"
                            type="file"
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handleAddCategory}
                          className="bg-[#ff9500] hover:bg-[#e68600]"
                        >
                          Ajouter
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {categoriesLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : categoriesError ? (
                  <div className="text-red-500 text-center">{categoriesError}</div>
                ) : (
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Titre</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Nombre de cours</TableHead>
                            <TableHead>Sous-catégories</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categories.map((category) => (
                            <TableRow key={category.id}>
                              <TableCell className="font-medium">
                                {category.title}
                              </TableCell>
                              <TableCell>
                                {category.description || "Aucune description"}
                              </TableCell>
                              <TableCell>
                                {courses.filter(
                                  (course) => course.category_id === category.id
                                ).length}
                              </TableCell>
                              <TableCell>
                                {category.subcategories ? (
                                  <div className="flex flex-wrap gap-1">
                                    {category.subcategories.map((sub) => (
                                      <Badge key={sub.id} variant="outline">
                                        {sub.title}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  "Aucune sous-catégorie"
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditCategory(category.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                    size="sm"
                                    className="text-red-600"
                                    onClick={() => handleDeleteCategory(category.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Finance Tab */}
          {activeTab === "finance" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion Financière</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Période
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              {/* Revenue Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Revenus Totaux
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€124,750.50</div>
                    <p className="text-xs text-green-500 mt-1">
                      +15% depuis le mois dernier
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Revenus Mensuels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€48,234.20</div>
                    <p className="text-xs text-green-500 mt-1">
                      +8% depuis le mois dernier
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Valeur Moyenne des Commandes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€54.75</div>
                    <p className="text-xs text-red-500 mt-1">
                      -2% depuis le mois dernier
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Transactions Financières</CardTitle>
                  <CardDescription>Historique des transactions sur la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Transaction</TableHead>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Cours</TableHead>
                          <TableHead>Montant Initial</TableHead>
                          <TableHead>Réduction</TableHead>
                          <TableHead>Montant Final</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>#{transaction.transaction_id}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{transaction.user.name}</span>
                                <span className="text-sm text-gray-500">{transaction.user.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {transaction.courses.map(course => (
                                  <span key={course.id} className="text-sm">
                                    {course.title}
                                    {course.discount && 
                                      <Badge variant="outline" className="ml-2">-{course.discount}</Badge>
                                    }
                                  </span>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{parseFloat(transaction.order.total_amount).toFixed(2)} €</TableCell>
                            <TableCell>{transaction.order.discount} €</TableCell>
                            <TableCell>{parseFloat(transaction.order.final_amount).toFixed(2)} €</TableCell>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge className={
                                transaction.status === "completed" ? "bg-green-100 text-green-800" :
                                transaction.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }>
                                {transaction.status === "completed" ? "Complété" :
                                 transaction.status === "pending" ? "En attente" :
                                 "Remboursé"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => window.open(transaction.invoice.download_url, '_blank')}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    // Afficher les détails de la transaction
                                    console.log("Détails de la transaction:", transaction);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => fetchTransactions(pagination.current_page - 1)}
                          disabled={pagination.current_page === 1}
                        >
                          Précédent
                        </Button>
                        <span className="text-sm text-gray-500">
                          Page {pagination.current_page} sur {pagination.last_page}
                        </span>
                        <Button
                          variant="outline"
                          onClick={() => fetchTransactions(pagination.current_page + 1)}
                          disabled={pagination.current_page === pagination.last_page}
                        >
                          Suivant
                        </Button>
                      </div>
                      <span className="text-sm text-gray-500">
                        Total: {pagination.total} transactions
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

            {/* Pending Teachers Tab */}
            {activeTab === "pendingTeachers" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Gestion des demandes d'enseignant</h2>
                <p className="text-gray-600 mb-6">
                  Approuvez ou refusez les demandes des utilisateurs qui souhaitent devenir enseignants sur la plateforme.
                </p>
                <PendingTeachers />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Paramètres du Système</h2>
                <Button>Sauvegarder les modifications</Button>
              </div>

              <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="appearance">Apparence</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="security">Sécurité</TabsTrigger>
                  <TabsTrigger value="integrations">Intégrations</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres Généraux</CardTitle>
                      <CardDescription>
                        Configurez les paramètres généraux de votre plateforme
                        d'apprentissage
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Nom de la Plateforme
                        </label>
                        <Input defaultValue="EduLearn" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          URL du Site
                        </label>
                        <Input defaultValue="https://edulearn.example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Email de Contact
                        </label>
                        <Input defaultValue="contact@edulearn.example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Devise par Défaut
                        </label>
                        <Select defaultValue="eur">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une devise" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eur">Euro (€)</SelectItem>
                            <SelectItem value="usd">Dollar US ($)</SelectItem>
                            <SelectItem value="gbp">
                              Livre Sterling (£)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Langue par Défaut
                        </label>
                        <Select defaultValue="fr">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une langue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">Anglais</SelectItem>
                            <SelectItem value="es">Espagnol</SelectItem>
                            <SelectItem value="de">Allemand</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="appearance" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Apparence</CardTitle>
                      <CardDescription>
                        Personnalisez l'apparence de votre plateforme
                        d'apprentissage
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Thème</label>
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="light"
                              name="theme"
                              defaultChecked
                            />
                            <label htmlFor="light">Clair</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="dark" name="theme" />
                            <label htmlFor="dark">Sombre</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="system" name="theme" />
                            <label htmlFor="system">Système</label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Couleur Principale
                        </label>
                        <div className="flex space-x-4">
                          <div className="w-8 h-8 rounded-full bg-primary cursor-pointer border-2 border-gray-300" />
                          <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer" />
                          <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer" />
                          <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer" />
                          <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Logo</label>
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-primary" />
                          </div>
                          <Button variant="outline">Changer le logo</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Favicon</label>
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <Button variant="outline">Changer le favicon</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

