import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useCategories from "../../hooks/useCategories";
import { useCourses } from "../../hooks/useCourses";
import { Course as CourseType } from "../../types/course";
import { useEnrollmentStore } from "../../hooks/useEnrollmentStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useWishlistStore } from "../../hooks/useWishlistStore";
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  Clock,
  Users,
  BookOpen,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WishlistToggle from "@/components/wishList/wishlistToggle";

interface PriceRange {
  min: number;
  max: number;
}

interface PaginationData {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface ApiResponse {
  data: CourseType[];
  courses: PaginationData;
}

// Modifier l'interface Course pour correspondre à la structure de l'API
interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  slug: string;
  instructor_id: number;
  level: string;
  language: string;
  image_url: string | null;
  video_url: string | null;
  price: string;
  discount: string | null;
  published_date: string | null;
  status: string;
  requirements: string | null;
  what_you_will_learn: string | null;
  target_audience: string | null;
  average_rating: string;
  total_reviews: number;
  total_students: number;
  has_certificate: boolean;
  created_at: string;
  updated_at: string;
  categories: Array<{
    id: number;
    title: string;
    description: string;
    parent_id: number | null;
  image_url: string;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
    pivot: {
      course_id: number;
      category_id: number;
    };
  }>;
  tags: Array<{
    id: number;
    name: string;
    course_count: number;
    popularity: number;
  created_at: string;
    updated_at: string;
    pivot: {
      course_id: number;
      tag_id: number;
    };
  }>;
  instructor: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    email_verified_at: string | null;
    lastLogin: string | null;
    isActive: boolean;
    role: string;
    created_at: string;
    updated_at: string;
    is_approved: boolean;
  };
}

export const getFullImageUrl = (url) => {
  if (!url) return null;

  // Vérifier si l'URL est déjà complète
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Utiliser l'URL de l'API de votre backend
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
  return `${apiUrl}/storage/${url}`;
};

export default function CoursesExplorer() {
  const navigate = useNavigate();
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PriceRange>({
    min: 0,
    max: 200,
  });
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });
  const [searchInput, setSearchInput] = useState("");

  // Use wishlist store instead of local state
  const {
    wishlistedCourses,
    toggleWishlist: toggleWishlistStore,
    fetchWishlistedCourses,
  } = useWishlistStore();

  console.log("wishlist=======", wishlistedCourses);
  // Function to toggle wishlist status
  const toggleWishlist = (courseId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent triggering other click events
    }
    toggleWishlistStore(courseId);
  };

  // Fetch wishlist courses when component mounts
  useEffect(() => {
    fetchWishlistedCourses();
  }, [fetchWishlistedCourses]);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Utiliser le hook useCourses avec les filtres
  const { 
    courses: filteredCourses, 
    coursesPaids, 
    loading, 
    error 
  } = useCourses();

  // Ajouter des logs pour le débogage
  useEffect(() => {
    console.log("CourseExplore - Valeur de filteredCourses:", filteredCourses);
    console.log("CourseExplore - Nombre de cours:", filteredCourses ? (Array.isArray(filteredCourses) ? filteredCourses.length : "non-array") : "undefined");
    console.log("CourseExplore - État de loading:", loading);
    console.log("CourseExplore - Erreur:", error);
  }, [filteredCourses, loading, error]);

  // Mettre à jour les hooks après que les données soient disponibles
  useEffect(() => {
    console.log("Filtres actuels mis à jour:", {
      searchTerm,
      selectedCategory,
      selectedLevels,
      selectedLanguages,
      selectedPrice,
      selectedRating
    });
  }, [searchTerm, selectedCategory, selectedLevels, selectedLanguages, selectedPrice, selectedRating]);

  const { isAuthenticated } = useAuthStore();
  const {
    enrolledCourses,
    fetchEnrolledCourses,
    enrollInCourse,
  } = useEnrollmentStore();

  // Trier les cours - Ajout de vérification si filteredCourses est un tableau
  const sortedCourses = Array.isArray(filteredCourses) && filteredCourses.length > 0
    ? [...filteredCourses].sort((a, b) => {
        switch (sortOption) {
          case 'popular':
            return b.total_students - a.total_students;
          case 'rating':
            return Number(b.average_rating || 0) - Number(a.average_rating || 0);
          case 'newest':
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          case 'price-low':
            return Number(a.price || 0) - Number(b.price || 0);
          case 'price-high':
            return Number(b.price || 0) - Number(a.price || 0);
          default:
            return 0;
        }
      })
    : [];

  // Pagination - Ajout de vérification si filteredCourses est un tableau
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCourses = Array.isArray(filteredCourses) && filteredCourses.length > 0
    ? filteredCourses.slice(startIndex, endIndex) 
    : [];
  const totalPages = Array.isArray(filteredCourses) && filteredCourses.length > 0
    ? Math.ceil(filteredCourses.length / itemsPerPage)
    : 0;

  // Déplacer les hooks useCallback en dehors des conditions
  const getActiveCategoryName = useCallback(() => {
    if (!selectedCategory) return "All Categories";
    const category = categories && Array.isArray(categories) 
      ? categories.find((c) => c.id === selectedCategory)
      : null;
    return category ? category.title : "All Categories";
  }, [categories, selectedCategory]);

  const getActiveSubcategoryName = useCallback(() => {
    if (!selectedSubcategory) return "All Subcategories";
    const category = categories && Array.isArray(categories) 
      ? categories.find((c) => c.id === selectedCategory)
      : null;
    if (!category || !category.subcategories) return "All Subcategories";
    const subcategory = category.subcategories.find(
      (s) => s.id === selectedSubcategory
    );
    return subcategory ? subcategory.title : "All Subcategories";
  }, [categories, selectedCategory, selectedSubcategory]);

  const getSubcategories = useCallback(() => {
    if (!selectedCategory) return [];
    const category = categories && Array.isArray(categories) 
      ? categories.find((c) => c.id === selectedCategory)
      : null;
    return category && category.subcategories ? category.subcategories : [];
  }, [categories, selectedCategory]);

  // Vérifier si un cours est payé
  const isPaidCourse = useCallback((courseId: string) => {
    return Array.isArray(coursesPaids) && coursesPaids.length > 0
      ? coursesPaids.some(course => course.id === courseId)
      : false;
  }, [coursesPaids]);

  // Gérer le clic sur un cours
  const handleCourseClick = useCallback((courseId: string) => {
    if (isPaidCourse(courseId)) {
      navigate(`/coursePlayer/${courseId}`);
    } else {
      navigate(`/course/${courseId}`);
    }
  }, [isPaidCourse, navigate]);

  // Fonction pour soumettre la recherche
  const handleSearch = () => {
    console.log("handleSearch appelé avec:", searchInput);
    setSearchTerm(searchInput);
    // Réinitialiser la page à 1 lors d'une nouvelle recherche
    setCurrentPage(1);
    
    // Log des filtres actuels pour débogage
    console.log("Filtres actuels après recherche:", {
      searchTerm: searchInput,
      selectedCategory,
      selectedLevels,
      selectedLanguages,
      selectedPrice,
      selectedRating
    });
  };

  // Modification de la fonction handlePriceChange pour appliquer directement les changements
  const handlePriceChange = (min: number, max: number) => {
    setSelectedPrice({ min, max });
    // Réinitialiser la page à 1 lors d'un changement de filtre
    setCurrentPage(1);
  };

  // Mise à jour de resetFilters pour réinitialiser aussi la recherche
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedLevels([]);
    setSelectedLanguages([]);
    setSelectedRating(null);
    setSelectedPrice({ min: 0, max: 200 });
    setSortOption("popular");
    setSearchTerm("");
    setSearchInput("");
    setPriceRange({ min: 0, max: 1000 });
    // Réinitialiser la page à 1
    setCurrentPage(1);
  };

  // Handle category selection avec mise à jour immédiate des filtres
  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(null);
    }
    setShowCategoryDropdown(false);
    // Réinitialiser la page à 1 lors d'un changement de filtre
    setCurrentPage(1);
  };

  // Handle subcategory selection avec mise à jour immédiate des filtres
  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(
      subcategoryId === selectedSubcategory ? null : subcategoryId
    );
    // Réinitialiser la page à 1 lors d'un changement de filtre
    setCurrentPage(1);
  };

  // Handle level selection avec mise à jour immédiate des filtres
  const handleLevelSelect = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
    // Réinitialiser la page à 1 lors d'un changement de filtre
    setCurrentPage(1);
  };

  // Handle language selection avec mise à jour immédiate des filtres
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
    // Réinitialiser la page à 1 lors d'un changement de filtre
    setCurrentPage(1);
  };

  // Handle rating selection avec mise à jour immédiate des filtres
  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating === selectedRating ? null : rating);
    // Réinitialiser la page à 1 lors d'un changement de filtre
    setCurrentPage(1);
  };

  // Fonction pour gérer le changement d'option de tri
  const handleSortChange = (option: string) => {
    setSortOption(option);
    // Réinitialiser la page à 1 lors d'un changement de tri
    setCurrentPage(1);
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    const roundedRating = Math.round(Number(rating));
    console.log("Affichage étoiles pour rating:", rating, "arrondi à:", roundedRating);
    
    return (
      <div className="flex items-center">
        <div className="flex items-center mr-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= Math.floor(rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : star - rating < 1 && star - rating > 0
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              fill={
                star <= Math.floor(rating)
                  ? "#facc15" 
                  : star - rating < 1 && star - rating > 0
                    ? "#facc15"
                    : "none"
              }
            />
          ))}
        </div>
        <span className="text-sm font-medium text-yellow-500">{Number(rating).toFixed(1)}</span>
      </div>
    );
  };

  if (categoriesLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#a435f0]/5 to-[#8710d8]/5 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#a435f0] mb-2">Préparation de votre expérience d'apprentissage</h2>
          <p className="text-gray-600">Veuillez patienter pendant que nous chargeons nos cours d'excellence</p>
        </div>
        
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-pulse">
              <div className="h-48 bg-gradient-to-r from-purple-100 to-purple-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-purple-100 rounded w-3/4"></div>
                <div className="h-4 bg-purple-50 rounded w-1/2"></div>
                <div className="flex space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-4 h-4 rounded-full bg-yellow-200"></div>
                  ))}
                  <div className="w-8 h-4 ml-2 bg-yellow-100 rounded"></div>
                </div>
                <div className="flex justify-between mt-4">
                  <div className="h-6 bg-purple-100 rounded w-1/3"></div>
                  <div className="h-8 w-24 bg-[#a435f0]/30 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex items-center justify-center">
          <div className="w-3 h-3 bg-[#a435f0] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#a435f0] rounded-full animate-bounce mx-2" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-[#a435f0] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return <div>Erreur: {categoriesError}</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }
  console.log(filteredCourses);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#a435f0] to-[#8710d8] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Expand Your Knowledge
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover thousands of courses taught by industry experts and take
              your skills to the next level.
            </p>
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="What do you want to learn today?"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    console.log("Touche Entrée pressée");
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className={`w-full h-14 pl-12 pr-4 rounded-xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#a435f0] ${searchTerm ? 'border-2 border-[#a435f0]' : ''}`}
              />
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${searchTerm ? 'text-[#a435f0]' : 'text-gray-500'}`} />
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Bouton de recherche cliqué");
                  handleSearch();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#a435f0] text-white px-4 py-2 rounded-lg hover:bg-[#8710d8] transition-colors"
              >
                Search
              </button>
            </div>
            
            {/* Indicateur de recherche active */}
            {(searchTerm || selectedCategory || selectedLevels.length > 0 || selectedLanguages.length > 0 || selectedRating) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchTerm && (
                  <div className="bg-white text-[#a435f0] px-3 py-1 rounded-full text-sm flex items-center">
                    <span>Recherche: {searchTerm}</span>
                    <button 
                      onClick={() => {
                        setSearchTerm("");
                        setSearchInput("");
                      }}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
          </div>
                )}
                
                {selectedCategory && (
                  <div className="bg-white text-[#a435f0] px-3 py-1 rounded-full text-sm flex items-center">
                    <span>Catégorie: {getActiveCategoryName()}</span>
                    <button 
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedSubcategory(null);
                      }}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {selectedLevels.length > 0 && (
                  <div className="bg-white text-[#a435f0] px-3 py-1 rounded-full text-sm flex items-center">
                    <span>Niveaux: {selectedLevels.join(", ")}</span>
                    <button 
                      onClick={() => setSelectedLevels([])}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {/* Bouton pour réinitialiser tous les filtres */}
                <button 
                  onClick={resetFilters}
                  className="bg-white text-[#a435f0] px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <span>Réinitialiser tous les filtres</span>
                  <X className="h-4 w-4 ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Wave shape divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg
            viewBox="0 0 1440 100"
            className="absolute bottom-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Sticky Category Navigation */}
      <div
        className={`sticky top-0 z-30 bg-white border-b border-gray-200 transition-shadow ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Category Dropdown (Mobile) */}
            <div className="relative md:hidden">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                <span>{getActiveCategoryName()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showCategoryDropdown && (
                <div className="absolute left-0 mt-2 w-64 rounded-lg bg-white shadow-xl border border-gray-200 z-40 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedSubcategory(null);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        !selectedCategory
                          ? "bg-[#f7f9fa] text-[#a435f0] font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <div key={category.id}>
                        <button
                          onClick={() => handleCategorySelect(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${
                            selectedCategory === category.id
                              ? "bg-[#f7f9fa] text-[#a435f0] font-medium"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span>{category.title}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        {selectedCategory === category.id && (
                          <div className="ml-4 border-l border-gray-200 pl-2 mt-1 mb-2">
                            {category.subcategories &&
                              category.subcategories.map((subcategory) => (
                                <button
                                  key={subcategory.id}
                                  onClick={() =>
                                    handleSubcategorySelect(subcategory.id)
                                  }
                                  className={`w-full text-left px-3 py-1.5 rounded-md ${
                                    selectedSubcategory === subcategory.id
                                      ? "bg-[#f7f9fa] text-[#a435f0] font-medium"
                                      : "hover:bg-gray-100"
                                  }`}
                                >
                                  {subcategory.title}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Navigation (Desktop) */}
            <div className="hidden md:flex items-center space-x-1 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-[#a435f0] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                All Categories
              </button>

              {categories && Array.isArray(categories) && categories.length > 0 && categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-[#a435f0] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#a435f0]"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-100"
                  }`}
                >
                  <BarChart3 className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex flex-col space-y-1">
                    <div className="h-1 w-5 bg-gray-700 rounded-full"></div>
                    <div className="h-1 w-5 bg-gray-700 rounded-full"></div>
                    <div className="h-1 w-5 bg-gray-700 rounded-full"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Subcategory Navigation (when a category is selected) */}
          {selectedCategory && (
            <div className="py-2 overflow-x-auto scrollbar-hide">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    !selectedSubcategory
                      ? "bg-[#a435f0] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  All {getActiveCategoryName()}
                </button>

                {getSubcategories().map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => handleSubcategorySelect(subcategory.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedSubcategory === subcategory.id
                        ? "bg-[#a435f0] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {subcategory.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Panel (Desktop) */}
          {showFilters && (
            <div className="md:w-64 lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-[#a435f0] hover:underline"
                  >
                    Reset All
                  </button>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="0"
                        value={priceRange.min}
                        onChange={(e) => {
                          const newMin = Number(e.target.value);
                          setPriceRange({
                            ...priceRange,
                            min: newMin,
                          });
                          // Appliquer directement les changements
                          setSelectedPrice({
                            ...selectedPrice,
                            min: newMin
                          });
                          setCurrentPage(1);
                        }}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Min"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        min="0"
                        value={priceRange.max}
                        onChange={(e) => {
                          const newMax = Number(e.target.value);
                          setPriceRange({
                            ...priceRange,
                            max: newMax,
                          });
                          // Appliquer directement les changements
                          setSelectedPrice({
                            ...selectedPrice,
                            max: newMax
                          });
                          setCurrentPage(1);
                        }}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Max"
                      />
                      <button 
                        onClick={() => handlePriceChange(priceRange.min, priceRange.max)}
                        className="ml-2 px-3 py-2 bg-[#a435f0] text-white rounded-md hover:bg-[#8710d8]"
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Level</h4>
                  <div className="space-y-2">
                    {["Beginner", "Intermediate", "Advanced", "All Levels"].map(
                      (level) => (
                        <label key={level} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLevels.includes(level)}
                            onChange={() => handleLevelSelect(level)}
                            className="rounded border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                          />
                          <span className="ml-2 text-sm">{level}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Language Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Language</h4>
                  <div className="space-y-2">
                    {["English", "French", "Spanish", "German", "Japanese"].map(
                      (language) => (
                        <label key={language} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLanguages.includes(language)}
                            onChange={() => handleLanguageSelect(language)}
                            className="rounded border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                          />
                          <span className="ml-2 text-sm">{language}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Rating</h4>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => handleRatingSelect(rating)}
                          className="rounded-full border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                        />
                        <span className="ml-2 flex items-center">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.floor(rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : star - rating < 1 && star - rating > 0
                                      ? "text-yellow-400 fill-yellow-400" 
                                      : "text-gray-300"
                                }`}
                                fill={
                                  star <= Math.floor(rating)
                                    ? "#facc15" 
                                    : star - rating < 1 && star - rating > 0
                                      ? "#facc15"
                                      : "none"
                                }
                              />
                            ))}
                          </div>
                          <span className="ml-1 text-sm font-medium text-yellow-500">
                            {rating.toFixed(1)}
                          </span>
                          <span className="ml-1 text-sm text-gray-600">
                            & up
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-2 rounded-lg bg-[#a435f0] text-white font-medium hover:bg-[#8710d8] transition-colors md:hidden"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Courses Grid */}
          <div className="flex-1">
            {/* Results Summary */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {selectedCategory
                  ? `${getActiveCategoryName()} ${
                      selectedSubcategory
                        ? `- ${getActiveSubcategoryName()}`
                        : ""
                    } Courses`
                  : "All Courses"}
              </h2>
              <p className="text-gray-600">
                {Array.isArray(filteredCourses) ? filteredCourses.length : 0} results
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* Courses */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a435f0]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                {error}
              </div>
            ) : !Array.isArray(filteredCourses) || filteredCourses.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Aucun cours trouvé</h3>
                <p className="text-gray-600 mb-4">
                  Essayez d'ajuster vos filtres de recherche.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#a435f0] text-white rounded-lg hover:bg-[#8710d8] transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.isArray(filteredCourses) && filteredCourses.length > 0 ? filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCourseClick(course.id)}
                    onMouseEnter={() => setHoveredCourse(course.id.toString())}
                    onMouseLeave={() => setHoveredCourse(null)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <img
                        src={course.image_url || '/placeholder-course.jpg'}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      {hoveredCourse === course.id.toString() && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <div className="bg-white p-2 rounded-full">
                            <Play className="h-8 w-8 text-[#a435f0]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {course.subtitle || course.description}
                      </p>

                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.round(Number(course.average_rating || 0))
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill={star <= Math.round(Number(course.average_rating || 0)) ? "#facc15" : "none"}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-yellow-500 ml-1">
                          {Number(course.average_rating || 0).toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({course.total_reviews || 0})
                        </span>
                      </div>

                      <div className="flex items-center text-xs text-gray-600 space-x-3 mb-3">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{course.level || 'Non spécifié'}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{course.total_students || 0} étudiants</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          <span>{course.language || 'Non spécifié'}</span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center">
                          {course.discount ? (
                            <>
                              <span className="text-lg font-bold">
                                ${(Number(course.price || 0) * (1 - Number(course.discount || 0) / 100)).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${course.price || 0}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold">
                              ${course.price || 0}
                            </span>
                          )}
                        </div>

                        {isPaidCourse(course.id) ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/coursePlayer/${course.id}`);
                            }}
                            className="px-3 py-1.5 bg-[#a435f0] text-white text-sm font-medium rounded-lg hover:bg-[#8710d8] transition-colors flex items-center"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Étudier
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/course/${course.id}`);
                              }}
                              className="px-3 py-1.5 bg-[#a435f0] text-white text-sm font-medium rounded-lg hover:bg-[#8710d8] transition-colors flex items-center"
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Détails
                            </button>
                            <WishlistToggle
                              courseId={course.id}
                              size="sm"
                              showTooltip={false}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full flex justify-center items-center p-8">
                    <p className="text-gray-500">Aucun cours disponible pour le moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {Array.isArray(filteredCourses) && filteredCourses.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button
                    className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === page
                            ? "bg-[#a435f0] text-white font-medium"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              className="bg-white rounded-t-xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {/* Price Range Filter */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="0"
                        value={priceRange.min}
                        onChange={(e) => {
                          const newMin = Number(e.target.value);
                          setPriceRange({
                            ...priceRange,
                            min: newMin,
                          });
                          // Appliquer directement les changements
                          setSelectedPrice({
                            ...selectedPrice,
                            min: newMin
                          });
                          setCurrentPage(1);
                        }}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Min"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        min="0"
                        value={priceRange.max}
                        onChange={(e) => {
                          const newMax = Number(e.target.value);
                          setPriceRange({
                            ...priceRange,
                            max: newMax,
                          });
                          // Appliquer directement les changements
                          setSelectedPrice({
                            ...selectedPrice,
                            max: newMax
                          });
                          setCurrentPage(1);
                        }}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Max"
                      />
                      <button 
                        onClick={() => handlePriceChange(priceRange.min, priceRange.max)}
                        className="ml-2 px-3 py-2 bg-[#a435f0] text-white rounded-md hover:bg-[#8710d8]"
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Level</h4>
                  <div className="space-y-2">
                    {["Beginner", "Intermediate", "Advanced", "All Levels"].map(
                      (level) => (
                        <label key={level} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLevels.includes(level)}
                            onChange={() => handleLevelSelect(level)}
                            className="rounded border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                          />
                          <span className="ml-2 text-sm">{level}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Language Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Language</h4>
                  <div className="space-y-2">
                    {["English", "French", "Spanish", "German", "Japanese"].map(
                      (language) => (
                        <label key={language} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLanguages.includes(language)}
                            onChange={() => handleLanguageSelect(language)}
                            className="rounded border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                          />
                          <span className="ml-2 text-sm">{language}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Rating</h4>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => handleRatingSelect(rating)}
                          className="rounded-full border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                        />
                        <span className="ml-2 flex items-center">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.floor(rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : star - rating < 1 && star - rating > 0
                                      ? "text-yellow-400 fill-yellow-400" 
                                      : "text-gray-300"
                                }`}
                                fill={
                                  star <= Math.floor(rating)
                                    ? "#facc15" 
                                    : star - rating < 1 && star - rating > 0
                                      ? "#facc15"
                                      : "none"
                                }
                              />
                            ))}
                          </div>
                          <span className="ml-1 text-sm font-medium text-yellow-500">
                            {rating.toFixed(1)}
                          </span>
                          <span className="ml-1 text-sm text-gray-600">
                            & up
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 py-2.5 rounded-lg bg-[#a435f0] text-white font-medium hover:bg-[#8710d8] transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
