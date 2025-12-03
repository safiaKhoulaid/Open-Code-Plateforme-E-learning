import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Search,
  BookOpen,
  Heart,
  User,
  Award,
  Settings,
  Bell,
  Menu,
  X,
  List,
  Grid,
  Clock,
  CheckCircle,
  Download,
  ExternalLink,
  Share2,
  Play,
  CreditCard,
  ShoppingCart,
  Filter,
  HelpCircle,
  LogOut,
  MessageSquare,
  TrendingUp,
  Bookmark,
  DollarSign,
  Lightbulb,
  Layers,
  Smartphone,
} from "lucide-react";
import {
  calculateTimeLeft,
  getRandomDate,
  getRandomNumber,
  getRandomProgressColor,
} from "@/utils/helpers";

// Avatars
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-5.png";

import StudentProfile from "./student/profile/studentProfile";
import StudentSettings from "./student/settings/studentSettings";
import NotificationsComponent from "../components/notification/notification";
import { Certificate, Course } from "../types/dashboard";
import useStudentDashboardData from "../hooks/useDashboardStudentData";
import Wishlist from "../components/wishList/wishList";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("my-learning");
  const [selectedView, setSelectedView] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [progressFilter, setProgressFilter] = useState("all");
  const [sortOption, setSortOption] = useState("recent");
  const [showArchived, setShowArchived] = useState(false);
  const [expandedCourseIndex, setExpandedCourseIndex] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesPaids, setCoursesPaids] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    avatar: string;
  }>({
    name: "",
    email: "",
    avatar: "",
  });
  const [wishlists, setWishlists] = useState<any[]>([]);
  const { data: dashboardData, loading } =
    useStudentDashboardData();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    // Close other menus when mobile menu is opened
    if (!showMobileMenu) {
      setShowProfileMenu(false);
    }
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (windowWidth < 1024) {
      setShowMobileMenu(false);
    }
  };

  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCourseClick = (index: number) => {
    setSelectedCourse(index);
    setShowCourseDetails(true);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
  };

  const handleProgressFilterChange = (progress: string) => {
    setProgressFilter(progress);
  };

  const toggleArchivedCourses = () => {
    setShowArchived(!showArchived);
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Utiliser les données réelles de l'API si disponibles
        if (dashboardData) {
          // Mettre à jour les états avec les données de l'API
          setCourses(dashboardData.courses || []);
          // Utiliser les mêmes cours pour coursesPaids (temporairement)
          // Dans une vraie API, vous auriez dashboardData.courses_payes
          setCoursesPaids(dashboardData.courses || []); 
          setCertificates(dashboardData.certificates || []);
          setNotifications(dashboardData.notifications || []);
          setUserProfile(dashboardData.userProfile || {});
          setWishlists(dashboardData.wishlists || []);

          // Log wishlist data after setting state
          console.log("Wishlists from dashboard data:", dashboardData.wishlists);

          if (dashboardData.wishlists) {
            console.log("Number of wishlists in dashboard data:", dashboardData.wishlists.length);
            if (dashboardData.wishlists.length > 0) {
              console.log("First wishlist item structure:", dashboardData.wishlists[0]);
            }
          } else {
            console.log("No wishlists found in dashboard data");
          }

          setProgress(dashboardData.progress)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError("Failed to load dashboard data");
      }
    };

    fetchDashboardData();
  }, [dashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#ff9500]/5 to-[#ff7100]/5 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#ff9500] mb-2">Préparation de votre tableau de bord</h2>
          <p className="text-gray-600">Veuillez patienter pendant que nous chargeons vos données personnalisées</p>
        </div>
        
        {/* Stats Cards Loaders */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-orange-100 rounded w-24"></div>
                <div className="rounded-full bg-orange-50 p-2 w-9 h-9"></div>
              </div>
              <div className="h-8 bg-orange-100 rounded w-16 mb-2"></div>
              <div className="h-4 bg-orange-50 rounded w-36"></div>
              <div className="mt-3 h-2.5 w-full rounded-full bg-gray-100">
                <div className="h-2.5 rounded-full bg-orange-100" style={{ width: `${Math.random() * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Course Cards Loaders */}
        <div className="w-full max-w-6xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-orange-100 rounded w-40"></div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-8 bg-orange-50 rounded w-24"></div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-pulse">
                <div className="h-40 bg-gradient-to-r from-orange-100 to-orange-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-orange-100 rounded w-3/4"></div>
                  <div className="h-4 bg-orange-50 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="flex justify-between mt-4">
                    <div className="w-24 h-4 bg-orange-100 rounded"></div>
                    <div className="w-16 h-8 bg-[#ff9500]/30 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center">
          <div className="w-3 h-3 bg-[#ff9500] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#ff9500] rounded-full animate-bounce mx-2" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-[#ff9500] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!dashboardData) {
    return <div>Aucune donnée disponible</div>;
  }

  // Sample categories for filtering

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      // Filter by search term
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by view (all, in-progress, completed)
      const matchesView =
        selectedView === "all"
          ? true
          : selectedView === "completed"
            ? course.progress === 100
            : selectedView === "in-progress"
              ? course.progress < 100 && course.progress > 0
              : selectedView === "not-started"
                ? course.progress === 0
          : true;

      // Filter by category
      const matchesCategory =
        categoryFilter === "all"
          ? true
          : course.category.toLowerCase().replace(/\s+/g, "-") ===
            categoryFilter;

      // Filter by progress
      const matchesProgress =
        progressFilter === "all"
          ? true
          : progressFilter === "not-started"
            ? course.progress === 0
            : progressFilter === "in-progress"
              ? course.progress > 0 && course.progress < 100
              : progressFilter === "completed"
                ? course.progress === 100
          : true;

      // Filter by archived status
      const matchesArchived = showArchived ? true : !course.isArchived;

      return (
        matchesSearch &&
        matchesView &&
        matchesCategory &&
        matchesProgress &&
        matchesArchived
      );
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortOption === "recent") {
        // Sort by last viewed (most recent first)
        return a.lastViewed === "Completed"
          ? 1
          : b.lastViewed === "Completed"
            ? -1
          : a.lastViewed && b.lastViewed
          ? a.lastViewed.localeCompare(b.lastViewed)
          : 0;
      } else if (sortOption === "title-asc") {
        // Sort by title (A-Z)
        return a.title.localeCompare(b.title);
      } else if (sortOption === "title-desc") {
        // Sort by title (Z-A)
        return b.title.localeCompare(a.title);
      } else if (sortOption === "progress-high") {
        // Sort by progress (highest first)
        return b.progress - a.progress;
      } else if (sortOption === "progress-low") {
        // Sort by progress (lowest first)
        return a.progress - b.progress;
      }
      return 0;
    });
console.log(coursesPaids)
  return (
    <div className="flex min-h-screen bg-[#f7f9fa] font-sans text-[#1c1d1f]">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${
          showMobileMenu
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        } shadow-md`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#FF9500]">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="ml-3 text-lg font-bold"><a href="/">openCode</a></span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hidden lg:block"
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform duration-300 ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <button
            onClick={toggleMobileMenu}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h3
              className={`mb-2 text-xs font-semibold uppercase text-gray-500 ${
                !sidebarOpen && "sr-only"
              }`}
            >
              Learn
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleTabChange("my-learning")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "my-learning"
                      ? "bg-[#f7f9fa] text-[#FF9500]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">My Learning</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("wishlist")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "wishlist"
                      ? "bg-[#f7f9fa] text-[#FF9500]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Heart className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Wishlist</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("my-purchases")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "my-purchases"
                      ? "bg-[#f7f9fa] text-[#FF9500]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Mes Achats</span>}
                </button>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3
              className={`mb-2 text-xs font-semibold uppercase text-gray-500 ${
                !sidebarOpen && "sr-only"
              }`}
            >
              Manage
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleTabChange("certificates")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "certificates"
                      ? "bg-[#f7f9fa] text-[#FF9500]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Award className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Certificates</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("tools")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "tools"
                      ? "bg-[#f7f9fa] text-[#FF9500]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Learning Tools</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("notifications")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "notifications"
                      ? "bg-[#f7f9fa] text-[#FF9500]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Notifications</span>}
                </button>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3
              className={`mb-2 text-xs font-semibold uppercase text-gray-500 ${
                !sidebarOpen && "sr-only"
              }`}
            >
              Account
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleTabChange("profile")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "profile"
                      ? "bg-[#f7f9fa] text-[#FF9500]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Mon Profil</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("settings")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "settings"
                      ? "bg-[#f7f9fa] text-[#FF9500]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Paramètres</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("payment-methods")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "payment-methods"
                      ? "bg-[#f7f9fa] text-[#FF9500]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  {sidebarOpen && (
                    <span className="ml-3">Moyens de paiement</span>
                  )}
                </button>
              </li>
            </ul>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleTabChange("help")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "help"
                      ? "bg-[#f7f9fa] text-[#FF9500]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <HelpCircle className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Help Center</span>}
                </button>
              </li>
            </ul>
          </div>

          {sidebarOpen && (
            <div className="mt-6 rounded-lg bg-[#f7f9fa] p-4">
              <h4 className="font-medium text-[#FF9500]">
                Become an Instructor
              </h4>
              <p className="mt-1 text-xs text-gray-600">
                Share your knowledge and earn income by creating online courses
              </p>
              <button className="mt-3 w-full rounded-md border border-[#FF9500] bg-white px-3 py-2 text-sm font-medium text-[#FF9500] hover:bg-[#f7f9fa]">
                Start Teaching
              </button>
            </div>
          )}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <Link to="/logout" className="flex w-full items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Log Out</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          windowWidth >= 1024 ? (sidebarOpen ? "ml-64" : "ml-20") : "ml-0"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            {!sidebarOpen && windowWidth >= 1024 && (
              <button
                onClick={toggleSidebar}
                className="mr-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 hidden lg:block"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <div className="relative hidden md:block ml-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search for anything"
                value={searchTerm}
                onChange={handleSearch}
                className="h-10 w-64 rounded-md border border-gray-300 bg-[#f7f9fa] pl-10 pr-4 text-sm focus:border-[#FF9500] focus:outline-none focus:ring-1 focus:ring-[#FF9500] lg:w-80"
              />
            </div>
          </div>

          <div className="relative flex items-center gap-2 sm:gap-4">
            <button className="rounded-md border border-gray-300 p-2 text-gray-500 hover:bg-gray-100 md:hidden">
              <Search className="h-5 w-5" />
            </button>

            <div className="relative">
              <NotificationsComponent />
            </div>

            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center rounded-full text-gray-700 hover:bg-gray-100"
              >
                <img
                  src={userProfile.avatar || "/placeholder.svg"}
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                />
              </button>

              {showProfileMenu && (
                <div
                  ref={profileMenuRef}
                  className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg"
                >
                  <div className="mb-2 border-b border-gray-200 pb-2">
                    <div className="px-3 py-2 text-sm font-medium">
                      {userProfile.name}
                    </div>
                    <div className="px-3 py-1 text-xs text-gray-500">
                      {userProfile.email}
                    </div>
                  </div>
                  <ul>
                    <li>
                      <button
                        onClick={() => handleTabChange("account")}
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleTabChange("my-learning")}
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        My Learning
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleTabChange("wishlist")}
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleTabChange("purchase-history")}
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Purchase History
                      </button>
                    </li>
                    <li className="mt-2 border-t border-gray-200 pt-2">
                      <button className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 md:p-6">
          {/* My Learning Tab */}
          {activeTab === "my-learning" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between md:flex-row md:items-center">
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">
                    My Learning
                  </h1>
                  <p className="text-gray-600">
                    Keep track of your learning progress
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
                  <button
                    onClick={() => handleViewChange("all")}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      selectedView === "all"
                        ? "bg-[#FF9500] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    All courses
                  </button>
                  <button
                    onClick={() => handleViewChange("in-progress")}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      selectedView === "in-progress"
                        ? "bg-[#FF9500] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    In progress
                  </button>
                  <button
                    onClick={() => handleViewChange("completed")}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      selectedView === "completed"
                        ? "bg-[#FF9500] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => handleViewChange("not-started")}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      selectedView === "not-started"
                        ? "bg-[#FF9500] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    Not started
                  </button>
                </div>
              </div>

              {/* Learning Statistics */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">
                      Your Progress
                    </h3>
                    <div className="rounded-full bg-[#f7f9fa] p-2">
                      <TrendingUp className="h-5 w-5 text-[#FF9500]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">{progress} %</p>
                  <div className="mt-2 text-sm text-gray-600">
                    Overall course completion
                  </div>
                  <div className="mt-3 h-2.5 w-full rounded-full bg-gray-100">
                    <div className="h-2.5 w-[62%] rounded-full bg-[#FF9500]"></div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">
                      Active Courses
                    </h3>
                    <div className="rounded-full bg-[#f7f9fa] p-2">
                      <BookOpen className="h-5 w-5 text-[#FF9500]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">5</p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">+2</span>
                    <span className="ml-1 text-gray-500">from last month</span>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">
                      Hours Spent
                    </h3>
                    <div className="rounded-full bg-[#f7f9fa] p-2">
                      <Clock className="h-5 w-5 text-[#FF9500]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">42.5</p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">+8.3</span>
                    <span className="ml-1 text-gray-500">from last week</span>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">
                      Certificates Earned
                    </h3>
                    <div className="rounded-full bg-[#f7f9fa] p-2">
                      <Award className="h-5 w-5 text-[#FF9500]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">1</p>
                  <div
                    className="mt-2 text-sm text-[#FF9500] font-medium cursor-pointer"
                    onClick={() => handleTabChange("certificates")}
                  >
                    View certificate
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search your courses..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-[#FF9500] focus:outline-none focus:ring-1 focus:ring-[#FF9500]"
                  />
                </div>
                <button
                  onClick={toggleFilters}
                  className="flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </button>
                <select
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#FF9500] focus:outline-none focus:ring-1 focus:ring-[#FF9500]"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="recent">Sort by: Recently Accessed</option>
                  <option value="title-asc">Sort by: Title A-Z</option>
                  <option value="title-desc">Sort by: Title Z-A</option>
                  <option value="progress-high">
                    Sort by: Progress (High to Low)
                  </option>
                  <option value="progress-low">
                    Sort by: Progress (Low to High)
                  </option>
                </select>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">Filters</h3>
                    <button
                      onClick={toggleFilters}
                      className="text-xs text-[#FF9500]"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Categories</h4>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <label
                            key={category.id}
                            className="flex items-center"
                          >
                            <input
                              type="radio"
                              name="category"
                              checked={categoryFilter === category.id}
                              onChange={() =>
                                handleCategoryFilterChange(category.id)
                              }
                              className="h-4 w-4 rounded border-gray-300 text-[#FF9500]"
                            />
                            <span className="ml-2 text-sm">
                              {category.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Progress</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="progress"
                            checked={progressFilter === "all"}
                            onChange={() => handleProgressFilterChange("all")}
                            className="h-4 w-4 rounded border-gray-300 text-[#FF9500]"
                          />
                          <span className="ml-2 text-sm">All</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="progress"
                            checked={progressFilter === "not-started"}
                            onChange={() =>
                              handleProgressFilterChange("not-started")
                            }
                            className="h-4 w-4 rounded border-gray-300 text-[#FF9500]"
                          />
                          <span className="ml-2 text-sm">Not started (0%)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="progress"
                            checked={progressFilter === "in-progress"}
                            onChange={() =>
                              handleProgressFilterChange("in-progress")
                            }
                            className="h-4 w-4 rounded border-gray-300 text-[#FF9500]"
                          />
                          <span className="ml-2 text-sm">
                            In progress (1-99%)
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="progress"
                            checked={progressFilter === "completed"}
                            onChange={() =>
                              handleProgressFilterChange("completed")
                            }
                            className="h-4 w-4 rounded border-gray-300 text-[#FF9500]"
                          />
                          <span className="ml-2 text-sm">Completed (100%)</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Other</h4>
                    
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={toggleFilters}
                      className="rounded-md bg-[#FF9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#8710d8]"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Course List */}
              <div className="space-y-4">
                {filteredCourses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">
                      No courses found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Try adjusting your search or filter to find what you're
                      looking for.
                    </p>
                  </div>
                ) : (
                  filteredCourses.map((course, index) => (
                    <div
                      key={course.id}
                      className={`overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md ${
                        course.isArchived ? "opacity-75" : ""
                      }`}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div
                          className="relative h-48 w-full cursor-pointer md:h-auto md:w-64 md:flex-shrink-0"
                          onClick={() => handleCourseClick(index)}
                        >
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[#FF9500] backdrop-blur-sm transition-all hover:bg-white">
                              <Play className="h-5 w-5" />
                            </button>
                          </div>
                          {course.progress === 100 && (
                            <div className="absolute left-3 top-3 rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white">
                              Completed
                            </div>
                          )}
                          {course.isArchived && (
                            <div className="absolute left-3 top-3 rounded-md bg-gray-500 px-2 py-1 text-xs font-medium text-white">
                              Archived
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <h3
                                className="text-lg font-bold line-clamp-1 cursor-pointer hover:text-[#FF9500]"
                                onClick={() => handleCourseClick(index)}
                              >
                                {course.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {course.instructor}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <button
                                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Toggle bookmark logic would go here
                                }}
                              >
                                {course.bookmarked ? (
                                  <Bookmark className="h-5 w-5 fill-[#FF9500] text-[#FF9500]" />
                                ) : (
                                  <Bookmark className="h-5 w-5" />
                                )}
                              </button>
                              <div className="relative ml-1">
                                <button className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
                                  <MoreVertical className="h-5 w-5" />
                                </button>
                                {/* Dropdown menu would go here */}
                              </div>
                            </div>
                          </div>

                          <div className="mb-3 mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-medium">
                                {course.progress}% complete
                              </span>
                            </div>
                            <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                              <div
                                className={`h-2 rounded-full ${
                                  course.progress === 100
                                    ? "bg-green-500"
                                    : "bg-[#FF9500]"
                                }`}
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="mt-auto">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="mr-1 h-4 w-4" />
                                <span>{course.estimatedTimeLeft} left</span>
                                <span className="mx-2">•</span>
                                <span>
                                  {course.completedLessons}/
                                  {course.totalLessons} lessons
                                </span>
                              </div>
                              <button
                                className={`rounded-md px-4 py-2 text-sm font-medium ${
                                  course.progress === 100
                                    ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                                    : "bg-[#FF9500] text-white hover:bg-[#8710d8]"
                                }`}
                                onClick={() => handleCourseClick(index)}
                              >
                                {course.progress === 100
                                  ? "Leave a review"
                                  : "Continue learning"}
                              </button>
                            </div>

                            {course.progress > 0 && course.progress < 100 && (
                              <div className="mt-3 text-sm text-gray-500">
                                <p>Last viewed: {course.lastViewed}</p>
                                <p className="mt-1">
                                  <span className="font-medium">
                                    {course.lastSection}:
                                  </span>{" "}
                                  {course.lastLesson}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Recommended Courses Section */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold">
                    Recommended Based on Your Learning
                  </h2>
                  <button className="text-sm text-[#FF9500]">View All</button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="relative h-40 bg-gray-100">
                      <img
                        src="/placeholder.svg?height=160&width=320"
                        alt="React Native for Mobile Apps"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="absolute bottom-4 left-4">
                          <span className="rounded-md bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
                            Bestseller
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded-full bg-[#f7f9fa] px-2 py-1 text-xs text-[#FF9500]">
                          Mobile Development
                        </span>
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 fill-[#eb8a2f] text-[#eb8a2f]" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>
                      <h3 className="mb-2 text-lg font-bold">
                        React Native for Mobile Apps
                      </h3>
                      <p className="mb-4 text-sm text-gray-500">
                        Learn to build native mobile apps for both iOS and
                        Android.
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold">$16.99</span>
                          <span className="ml-2 text-sm line-through text-gray-500">
                            $94.99
                          </span>
                        </div>
                        <button className="rounded-md bg-[#FF9500] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#8710d8]">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Purchases Tab */}
          {activeTab === "my-purchases" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between md:flex-row md:items-center">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">
                    Mes Cours Achetés
                </h1>
                <p className="text-gray-600">
                    Accédez à tous les cours que vous avez achetés
                </p>
              </div>
              </div>

              {/* Course List */}
              <div className="space-y-4">
                {coursesPaids && coursesPaids.length > 0 ? (
                  coursesPaids.map((course) => (
                    <div
                      key={course.id}
                      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div
                          className="relative h-48 w-full cursor-pointer md:h-auto md:w-64 md:flex-shrink-0"
                          onClick={() => navigate(`/coursePlayer/${course.id}`)}
                        >
                          <img
                            src={course.image_url || "/placeholder.svg"}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[#FF9500] backdrop-blur-sm transition-all hover:bg-white">
                              <Play className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <h3
                                className="text-lg font-bold line-clamp-1 cursor-pointer hover:text-[#FF9500]"
                                onClick={() => navigate(`/coursePlayer/${course.id}`)}
                              >
                                {course.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {course.instructor?.firstName} {course.instructor?.lastName}
                              </p>
                            </div>
                          </div>

                          <div className="mt-auto">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Star className="mr-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  <span className="text-yellow-500 font-medium">{Number(course.average_rating || 0).toFixed(1)}</span>
                                </span>
                                <span className="mx-2">•</span>
                                <span>{course.total_students || 0} étudiants</span>
                              </div>
                              <button
                                className="rounded-md bg-[#FF9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#e78500]"
                                onClick={() => navigate(`/coursePlayer/${course.id}`)}
                              >
                                Continuer l'apprentissage
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
                    <ShoppingCart className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">
                      Aucun cours acheté
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Explorez notre catalogue de cours et commencez votre parcours d'apprentissage.
                    </p>
                    <button 
                      onClick={() => navigate('/courseExplore')}
                      className="mt-4 rounded-md bg-[#FF9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#e78500]"
                    >
                      Découvrir des cours
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">
                  My Certificates
                </h1>
                <p className="text-gray-600">
                  View and download your course completion certificates
                </p>
              </div>

              {/* Certificates */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-bold">Your Certificates</h2>
                {certificates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
                    <Award className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">
                      No certificates yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Complete a course to earn your first certificate.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((certificate) => (
                      <div
                        key={certificate.id}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                      >
                        <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                          <img
                            src={certificate.image || "/placeholder.svg"}
                            alt={certificate.title}
                            className="h-40 w-auto object-contain"
                          />
                          <div className="absolute top-3 right-3 flex space-x-2">
                            <button className="rounded-full bg-white/80 p-1.5 text-gray-700 backdrop-blur-sm transition-all hover:bg-white">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="rounded-full bg-white/80 p-1.5 text-gray-700 backdrop-blur-sm transition-all hover:bg-white">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-1">
                            {certificate.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">
                            Issued by {certificate.issuer} • {certificate.date}
                          </p>
                          <div className="mb-3">
                            <h4 className="text-sm font-medium mb-1">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {certificate.skills?.map((skill, index) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-[#f7f9fa] px-2 py-1 text-xs text-gray-700"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button className="w-full rounded-md border border-[#FF9500] bg-white py-2 text-center text-sm font-medium text-[#FF9500] hover:bg-[#f7f9fa]">
                            View Certificate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Certificate Benefits */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold">
                  Why Certificates Matter
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-[#f7f9fa] p-4">
                    <div className="mb-3 rounded-full bg-[#f7f9fa] p-2 w-fit">
                      <Award className="h-6 w-6 text-[#FF9500]" />
                    </div>
                    <h3 className="text-md font-medium mb-2">
                      Showcase Your Skills
                    </h3>
                    <p className="text-sm text-gray-600">
                      Add certificates to your LinkedIn profile and resume to
                      demonstrate your expertise to potential employers.
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-[#f7f9fa] p-4">
                    <div className="mb-3 rounded-full bg-[#f7f9fa] p-2 w-fit">
                      <TrendingUp className="h-6 w-6 text-[#FF9500]" />
                    </div>
                    <h3 className="text-md font-medium mb-2">
                      Career Advancement
                    </h3>
                    <p className="text-sm text-gray-600">
                      Use your certificates to negotiate promotions or apply for
                      new positions in your field.
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-[#f7f9fa] p-4">
                    <div className="mb-3 rounded-full bg-[#f7f9fa] p-2 w-fit">
                      <Lightbulb className="h-6 w-6 text-[#FF9500]" />
                    </div>
                    <h3 className="text-md font-medium mb-2">
                      Validate Your Knowledge
                    </h3>
                    <p className="text-sm text-gray-600">
                      Prove your understanding of key concepts and demonstrate
                      your commitment to continuous learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Course Details Modal */}
          {showCourseDetails && selectedCourse !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4">
                  <h2 className="text-xl font-bold">
                    {courses[selectedCourse].title}
                  </h2>
                  <button
                    onClick={() => setShowCourseDetails(false)}
                    className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-2/3">
                      <div className="relative h-64 rounded-lg bg-gray-100 overflow-hidden">
                        <img
                          src={
                            courses[selectedCourse].image || "/placeholder.svg"
                          } 

                          alt={courses[selectedCourse].title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-[#FF9500] backdrop-blur-sm transition-all hover:bg-white">
                            <Play className="h-8 w-8" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-bold mb-2">
                          About this course
                        </h3>
                        <p className="text-gray-600">
                          {courses[selectedCourse].description}
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <Layers className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Level</p>
                              <p className="text-sm text-gray-500">
                                {courses[selectedCourse].level}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Lessons</p>
                              <p className="text-sm text-gray-500">
                                {courses[selectedCourse].totalLessons} total
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-1/3">
                      <div className="rounded-lg border border-gray-200 bg-[#f7f9fa] p-4">
                        <h3 className="text-lg font-bold mb-4">
                          Your Progress
                        </h3>
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Completion</span>
                            <span className="font-medium">
                              {progress}%
                            </span>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-white">
                            <div
                              className={`h-2 rounded-full ${
                                courses[selectedCourse].progress === 100
                                  ? "bg-green-500"
                                  : "bg-[#FF9500]"
                              }`}
                              style={{
                                width: `${courses[selectedCourse].progress}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm">Lessons Completed</span>
                            </div>
                            <span className="text-sm font-medium">
                              {courses[selectedCourse].completedLessons}/
                              {courses[selectedCourse].totalLessons}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm">Last Viewed</span>
                            </div>
                            <span className="text-sm">
                              {courses[selectedCourse].lastViewed}
                            </span>
                          </div>
                        </div>

                        <button className="mt-4 w-full rounded-md bg-[#FF9500] py-2.5 text-center text-sm font-medium text-white hover:bg-[#8710d8]">
                          Continue Learning
                        </button>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Download className="mr-2 h-4 w-4" />
                            Resources
                          </button>
                          <button className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Q&A
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-4">Course Content</h3>
                    <div className="space-y-3">
                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between bg-[#f7f9fa] px-4 py-3">
                          <div className="flex items-center">
                            <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                            <h4 className="font-medium">
                              Section 1: Introduction
                            </h4>
                          </div>
                          <div className="text-sm text-gray-500">
                            3/3 • 15 min
                          </div>
                        </div>
                        <div className="p-4 bg-white">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                                <span className="text-sm">
                                  Welcome to the Course
                                </span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Play className="h-3 w-3 mr-1" />
                                <span>5 min</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                                <span className="text-sm">Course Overview</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Play className="h-3 w-3 mr-1" />
                                <span>7 min</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                                <span className="text-sm">
                                  Setting Up Your Environment
                                </span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Play className="h-3 w-3 mr-1" />
                                <span>3 min</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between bg-[#f7f9fa] px-4 py-3">
                          <div className="flex items-center">
                            <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                            <h4 className="font-medium">
                              Section 2: Core Concepts
                            </h4>
                          </div>
                          <div className="text-sm text-gray-500">
                            12/20 • 2h 30min
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between bg-[#f7f9fa] px-4 py-3">
                          <div className="flex items-center">
                            <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                            <h4 className="font-medium">
                              Section 3: Advanced Topics
                            </h4>
                          </div>
                          <div className="text-sm text-gray-500">
                            0/15 • 3h 15min
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructor Information */}
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-4">Your Instructor</h3>
                    <div className="flex items-start gap-4">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt={courses[selectedCourse].instructor}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium">
                          {courses[selectedCourse].instructor}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Professional Developer & Instructor
                        </p>
                        <div className="mt-2 flex items-center">
                          <Star className="h-4 w-4 fill-[#eb8a2f] text-[#eb8a2f]" />
                          <span className="ml-1 text-sm">
                            {courses[selectedCourse].rating} Instructor Rating
                          </span>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="text-sm text-gray-500">
                            {courses[selectedCourse].reviews} Reviews
                          </span>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="text-sm text-gray-500">
                            50K+ Students
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-200 pt-6">
                    <button className="flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Course Certificate
                    </button>
                    <button className="flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Course
                    </button>
                    <button className="flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Bookmark className="mr-2 h-4 w-4" />
                      {courses[selectedCourse].bookmarked
                        ? "Remove from Saved"
                        : "Save Course"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">Mon Profil</h1>
                <p className="text-gray-600">
                  Gérez vos informations personnelles et vos préférences
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <StudentProfile dashboardDataProfile={userProfile} />
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">Paramètres</h1>
                <p className="text-gray-600">
                  Configurez vos préférences de compte et de notification
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <StudentSettings />
              </div>
            </div>
          )}

          {/* Other tabs would use the tabbed interface pattern */}
          {activeTab !== "my-learning" &&
            activeTab !== "certificates" &&
            activeTab !== "profile" &&
            activeTab !== "settings" && (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-6">
              <div className="rounded-full bg-[#f7f9fa] p-3">
                <Lightbulb className="h-6 w-6 text-[#FF9500]" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Bientôt disponible</h3>
              <p className="mt-2 text-center text-sm text-gray-500">
                  La section{" "}
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} est
                  en cours de développement et sera disponible bientôt.
              </p>
            </div>
          )}
           <div className="relative">
            < NotificationsComponent />
          </div>

          {/* Mobile App Promotion */}
          <div className="mt-8 rounded-lg border border-gray-200 bg-[#f7f9fa] p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-[#FF9500]">
                  Learn on the go!
                </h3>
                <p className="mt-2 text-gray-600">
                  Download our mobile app for iOS and Android to learn anytime,
                  anywhere.
                </p>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <button className="flex items-center rounded-md bg-[#1c1d1f] px-4 py-2 text-sm font-medium text-white">
                    <Smartphone className="mr-2 h-4 w-4" />
                    App Store
                  </button>
                  <button className="flex items-center rounded-md bg-[#1c1d1f] px-4 py-2 text-sm font-medium text-white">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Google Play
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="/placeholder.svg?height=120&width=200"
                  alt="Mobile App"
                  className="h-30 w-auto"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          {/* <div className="relative">
            < NotificationsComponent />
          </div> */}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div>© 2023 openCode, Inc. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#FF9500]">
                Terms
              </a>
              <a href="#" className="hover:text-[#FF9500]">
                Privacy
              </a>
              <a href="#" className="hover:text-[#FF9500]">
                Help
              </a>
              <a href="#" className="hover:text-[#FF9500]">
                Accessibility
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
