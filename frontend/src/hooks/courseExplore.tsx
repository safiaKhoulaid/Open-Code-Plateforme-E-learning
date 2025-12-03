import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  Clock,
  Users,
  BookOpen,
  Heart,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Types
type Course = {
  id: number
  title: string
  instructor: string
  rating: number
  reviewCount: number
  price: number
  salePrice?: number
  image: string
  category: string
  subcategory: string
  level: string
  duration: string
  studentsCount: number
  lastUpdated: string
  language: string
  bestseller: boolean
  featured: boolean
  new: boolean
  tags: string[]
  description: string
}

export type Category = {
  id: string
  title: string
  description: string
  image_url: string
  subcategories: { 
    id: string; 
    title: string; 
    description: string; 
    image_url: string; 
  }[]
}

export default function CoursesExplorer() {
  // State
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [sortOption, setSortOption] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isScrolled, setIsScrolled] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null)
  const [wishlistedCourses, setWishlistedCourses] = useState<number[]>([])

  // Function to toggle wishlist status
  const toggleWishlist = (courseId: number, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent triggering other click events
    setWishlistedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId) 
        : [...prev, courseId]
    )
    // Here you would typically call an API to update the wishlist
  }

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Sample categories data
  const categories: Category[] = [
    {
      id: "development",
      title: "Development",
      description: "Learn about software development and programming",
      image_url: "/placeholder.svg?height=400&width=600",
      subcategories: [
        { id: "web-development", title: "Web Development", description: "Learn web development technologies", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "mobile-development", title: "Mobile Development", description: "Learn mobile app development", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "game-development", title: "Game Development", description: "Learn game development", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "database-design", title: "Database Design", description: "Learn about designing databases", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "programming-languages", title: "Programming Languages", description: "Learn different programming languages", image_url: "/placeholder.svg?height=400&width=600" },
      ],
    },
    {
      id: "business",
      title: "Business",
      description: "Learn about business management and entrepreneurship",
      image_url: "/placeholder.svg?height=400&width=600",
      subcategories: [
        { id: "entrepreneurship", title: "Entrepreneurship", description: "Learn about starting and running a business", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "marketing", title: "Marketing", description: "Learn marketing strategies and techniques", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "finance", title: "Finance", description: "Learn about financial management and investments", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "sales", title: "Sales", description: "Learn sales techniques and strategies", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "strategy", title: "Strategy", description: "Learn about business strategy and planning", image_url: "/placeholder.svg?height=400&width=600" },
      ],
    },
    {
      id: "design",
      title: "Design",
      description: "Learn about graphic design and user experience design",
      image_url: "/placeholder.svg?height=400&width=600",
      subcategories: [
        { id: "web-design", title: "Web Design", description: "Learn web design techniques and tools", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "graphic-design", title: "Graphic Design", description: "Learn graphic design principles and techniques", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "ui-ux", title: "UI/UX Design", description: "Learn about user interface and user experience design", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "3d-animation", title: "3D & Animation", description: "Learn about 3D modeling and animation", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "fashion-design", title: "Fashion Design", description: "Learn about fashion design and styling", image_url: "/placeholder.svg?height=400&width=600" },
      ],
    },
    {
      id: "marketing",
      title: "Marketing",
      description: "Learn about digital marketing and advertising",
      image_url: "/placeholder.svg?height=400&width=600",
      subcategories: [
        { id: "digital-marketing", title: "Digital Marketing", description: "Learn about digital marketing strategies", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "social-media", title: "Social Media Marketing", description: "Learn about social media marketing", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "content-marketing", title: "Content Marketing", description: "Learn about content marketing strategies", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "seo", title: "SEO", description: "Learn about search engine optimization", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "branding", title: "Branding", description: "Learn about branding and marketing strategy", image_url: "/placeholder.svg?height=400&width=600" },
      ],
    },
    {
      id: "photography",
      title: "Photography",
      description: "Learn about photography and image editing",
      image_url: "/placeholder.svg?height=400&width=600",
      subcategories: [
        { id: "digital-photography", title: "Digital Photography", description: "Learn about digital photography techniques", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "portrait-photography", title: "Portrait Photography", description: "Learn about portrait photography", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "commercial-photography", title: "Commercial Photography", description: "Learn about commercial photography", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "video-design", title: "Video Design", description: "Learn about video design and editing", image_url: "/placeholder.svg?height=400&width=600" },
      ],
    },
    {
      id: "music",
      title: "Music",
      description: "Learn about music production and theory",
      image_url: "/placeholder.svg?height=400&width=600",
      subcategories: [
        { id: "instruments", title: "Instruments", description: "Learn about different musical instruments", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "music-production", title: "Music Production", description: "Learn about music production techniques", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "music-theory", title: "Music Theory", description: "Learn about music theory and composition", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "vocal", title: "Vocal", description: "Learn about vocal techniques and performance", image_url: "/placeholder.svg?height=400&width=600" },
      ],
    },
    {
      id: "health",
      title: "Health & Fitness",
      description: "Learn about health and fitness",
      image_url: "/placeholder.svg?height=400&width=600",
      subcategories: [
        { id: "fitness", title: "Fitness", description: "Learn about fitness and exercise", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "nutrition", title: "Nutrition", description: "Learn about nutrition and healthy eating", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "yoga", title: "Yoga", description: "Learn about yoga and its benefits", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "mental-health", title: "Mental Health", description: "Learn about mental health and wellness", image_url: "/placeholder.svg?height=400&width=600" },
      ],
    },
    {
      id: "academics",
      title: "Academics",
      description: "Learn about academic subjects and test preparation",
      image_url: "/placeholder.svg?height=400&width=600",
      subcategories: [
        { id: "math", title: "Math", description: "Learn about mathematics and its applications", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "science", title: "Science", description: "Learn about science and its branches", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "language", title: "Language", description: "Learn about different languages and their cultures", image_url: "/placeholder.svg?height=400&width=600" },
        { id: "test-prep", title: "Test Prep", description: "Learn about test preparation and strategies", image_url: "/placeholder.svg?height=400&width=600" },
      ],
    },
  ]

  // Sample courses data
  const allCourses: Course[] = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp 2023",
      instructor: "Dr. Angela Yu",
      rating: 4.8,
      reviewCount: 154892,
      price: 129.99,
      salePrice: 19.99,
      image: "/placeholder.svg?height=400&width=600",
      category: "development",
      subcategory: "web-development",
      level: "Beginner to Advanced",
      duration: "63 hours",
      studentsCount: 785421,
      lastUpdated: "November 2023",
      language: "English",
      bestseller: true,
      featured: true,
      new: false,
      tags: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
      description:
        "Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB, and more!",
    },
    {
      id: 2,
      title: "Advanced JavaScript: Master Modern Concepts",
      instructor: "Andrei Neagoie",
      rating: 4.9,
      reviewCount: 42156,
      price: 149.99,
      salePrice: 24.99,
      image: "/placeholder.svg?height=400&width=600",
      category: "development",
      subcategory: "programming-languages",
      level: "Intermediate to Advanced",
      duration: "35 hours",
      studentsCount: 325789,
      lastUpdated: "October 2023",
      language: "English",
      bestseller: true,
      featured: false,
      new: false,
      tags: ["JavaScript", "ES6", "Async/Await", "Functional Programming"],
      description:
        "Take your JavaScript skills to the next level with advanced concepts, patterns, and modern best practices.",
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass: Design Beautiful Interfaces",
      instructor: "Daniel Walter Scott",
      rating: 4.7,
      reviewCount: 28954,
      price: 119.99,
      salePrice: 17.99,
      image: "/placeholder.svg?height=400&width=600",
      category: "design",
      subcategory: "ui-ux",
      level: "All Levels",
      duration: "42 hours",
      studentsCount: 215478,
      lastUpdated: "December 2023",
      language: "English",
      bestseller: false,
      featured: true,
      new: true,
      tags: ["Figma", "Adobe XD", "Wireframing", "Prototyping"],
      description:
        "Learn to design beautiful user interfaces and create amazing user experiences from a senior designer.",
    },
    {
      id: 4,
      title: "Digital Marketing Strategy: Complete Guide",
      instructor: "Rob Percival",
      rating: 4.6,
      reviewCount: 18745,
      price: 99.99,
      salePrice: 14.99,
      image: "/placeholder.svg?height=400&width=600",
      category: "marketing",
      subcategory: "digital-marketing",
      level: "Beginner to Intermediate",
      duration: "28 hours",
      studentsCount: 185632,
      lastUpdated: "September 2023",
      language: "English",
      bestseller: false,
      featured: false,
      new: false,
      tags: ["SEO", "Social Media", "Email Marketing", "Google Ads"],
      description:
        "Master digital marketing strategy with this comprehensive guide to SEO, social media, email marketing, and more.",
    },
    {
      id: 5,
      title: "Financial Analysis & Financial Modeling in Excel",
      instructor: "365 Careers",
      rating: 4.7,
      reviewCount: 32541,
      price: 139.99,
      salePrice: 21.99,
      image: "/placeholder.svg?height=400&width=600",
      category: "business",
      subcategory: "finance",
      level: "Intermediate",
      duration: "22 hours",
      studentsCount: 245789,
      lastUpdated: "August 2023",
      language: "English",
      bestseller: true,
      featured: false,
      new: false,
      tags: ["Excel", "Financial Analysis", "Financial Modeling", "Valuation"],
      description:
        "Learn financial analysis and financial modeling using Excel from scratch with practical examples and case studies.",
    },
    {
      id: 6,
      title: "iOS 17 & Swift 5: Complete iOS App Development",
      instructor: "Dr. Angela Yu",
      rating: 4.8,
      reviewCount: 38954,
      price: 159.99,
      salePrice: 24.99,
      image: "/placeholder.svg?height=400&width=600",
      category: "development",
      subcategory: "mobile-development",
      level: "Beginner to Advanced",
      duration: "55 hours",
      studentsCount: 325478,
      lastUpdated: "November 2023",
      language: "English",
      bestseller: true,
      featured: true,
      new: true,
      tags: ["iOS", "Swift", "SwiftUI", "Xcode", "App Development"],
      description:
        "From beginner to iOS app developer with just one comprehensive course! Fully updated for iOS 17 and Swift 5.",
    },
    {
      id: 7,
      title: "Professional Photography Masterclass",
      instructor: "Phil Ebiner",
      rating: 4.6,
      reviewCount: 24587,
      price: 109.99,
      salePrice: 16.99,
      image: "/placeholder.svg?height=400&width=600",
      category: "photography",
      subcategory: "digital-photography",
      level: "All Levels",
      duration: "32 hours",
      studentsCount: 198745,
      lastUpdated: "July 2023",
      language: "English",
      bestseller: false,
      featured: false,
      new: false,
      tags: ["DSLR", "Lighting", "Composition", "Editing"],
      description:
        "Master photography with this comprehensive course covering everything from camera basics to advanced techniques.",
    },
    {
      id: 8,
      title: "Complete Python Developer in 2023: Zero to Mastery",
      instructor: "Andrei Neagoie",
      rating: 4.7,
      reviewCount: 45871,
      price: 129.99,
      salePrice: 19.99,
      image: "/placeholder.svg?height=400&width=600",
      category: "development",
      subcategory: "programming-languages",
      level: "Beginner to Advanced",
      duration: "30 hours",
      studentsCount: 354789,
      lastUpdated: "October 2023",
      language: "English",
      bestseller: true,
      featured: false,
      new: false,
      tags: ["Python", "Data Science", "Machine Learning", "Web Development"],
      description:
        "Learn Python from scratch, get hired, and have fun along the way with the most modern, comprehensive Python course available.",
    },
    {
      id: 9,
      title: "The Complete Digital Marketing Course - 12 Courses in 1",
      instructor: "Rob Percival, Daragh Walsh",
      rating: 4.5,
      reviewCount: 32541,
      price: 199.99,
      salePrice: 29.99,
      image: "/placeholder.svg?height=400&width=600",
      category: "marketing",
      subcategory: "digital-marketing",
      level: "All Levels",
      duration: "52 hours",
      studentsCount: 425789,
      lastUpdated: "September 2023",
      language: "English",
      bestseller: true,
      featured: true,
      new: false,
      tags: ["SEO", "Social Media", "Facebook Ads", "Google Ads", "Analytics"],
      description:
        "Master Digital Marketing Strategy, Social Media Marketing, SEO, YouTube, Email, Facebook Marketing, Analytics & More!",
    },
    {
      id: 10,
      title: "React - The Complete Guide 2023 (incl. React Router & Redux)",
      instructor: "Maximilian Schwarzmüller",
      rating: 4.8,
      reviewCount: 58741,
      price: 149.99,
      salePrice: 22.99,
      image: "/placeholder.svg?height=400&width=600",
      category: "development",
      subcategory: "web-development",
      level: "All Levels",
      duration: "48 hours",
      studentsCount: 485632,
      lastUpdated: "December 2023",
      language: "English",
      bestseller: true,
      featured: true,
      new: true,
      tags: ["React", "Redux", "Hooks", "Context API", "Next.js"],
      description:
        "Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!",
    },
    {
      id: 11,
      title: "The Complete Graphic Design Theory for Beginners Course",
      instructor: "Lindsay Marsh",
      rating: 4.6,
      reviewCount: 18745,
      price: 109.99,
      salePrice: 16.99,
      image: "/placeholder.svg?height=400&width=600",
      category: "design",
      subcategory: "graphic-design",
      level: "Beginner",
      duration: "22 hours",
      studentsCount: 154789,
      lastUpdated: "August 2023",
      language: "English",
      bestseller: false,
      featured: false,
      new: false,
      tags: ["Typography", "Color Theory", "Layout Design", "Logo Design"],
      description:
        "Learn Graphic Design Theory and the Basic Principles of Color Theory, Typography, Branding, Logo Design, Layout & More!",
    },
    {
      id: 12,
      title: "Machine Learning A-Z™: Hands-On Python & R In Data Science",
      instructor: "Kirill Eremenko, Hadelin de Ponteves",
      rating: 4.7,
      reviewCount: 42156,
      price: 159.99,
      salePrice: 24.99,
      image: "/placeholder.svg?height=400&width=600",
      category: "development",
      subcategory: "programming-languages",
      level: "Intermediate to Advanced",
      duration: "44 hours",
      studentsCount: 754123,
      lastUpdated: "October 2023",
      language: "English",
      bestseller: true,
      featured: true,
      new: false,
      tags: ["Machine Learning", "Python", "R", "Data Science", "AI"],
      description:
        "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Code templates included.",
    },
  ]

  // Filter courses based on search, category, and other filters
  const filteredCourses = allCourses
    .filter((course) => {
      // Search term filter
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      // Category filter
      const matchesCategory = selectedCategory ? course.category === selectedCategory : true

      // Subcategory filter
      const matchesSubcategory = selectedSubcategory ? course.subcategory === selectedSubcategory : true

      // Price range filter
      const matchesPriceRange =
        (course.salePrice || course.price) >= priceRange[0] && (course.salePrice || course.price) <= priceRange[1]

      // Level filter
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.some((level) => course.level.includes(level))

      // Language filter
      const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(course.language)

      // Rating filter
      const matchesRating = selectedRating ? course.rating >= selectedRating : true

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesPriceRange &&
        matchesLevel &&
        matchesLanguage &&
        matchesRating
      )
    })
    .sort((a, b) => {
      // Sort based on selected option
      switch (sortOption) {
        case "popular":
          return b.studentsCount - a.studentsCount
        case "highest-rated":
          return b.rating - a.rating
        case "newest":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case "price-low":
          return (a.salePrice || a.price) - (b.salePrice || b.price)
        case "price-high":
          return (b.salePrice || b.price) - (a.salePrice || a.price)
        default:
          return 0
      }
    })

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
      setSelectedSubcategory(null)
    } else {
      setSelectedCategory(categoryId)
      setSelectedSubcategory(null)
    }
    setShowCategoryDropdown(false)
  }

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId === selectedSubcategory ? null : subcategoryId)
  }

  // Handle level selection
  const handleLevelSelect = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  // Handle language selection
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguages((prev) => (prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]))
  }

  // Handle rating selection
  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating === selectedRating ? null : rating)
  }

  // Handle price range change
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value)
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setSelectedLevels([])
    setSelectedLanguages([])
    setSelectedRating(null)
    setPriceRange([0, 200])
    setSortOption("popular")
  }

  // Get active category name
  const getActiveCategoryName = () => {
    if (!selectedCategory) return "All Categories"
    const category = categories.find((c) => c.id === selectedCategory)
    return category ? category.title : "All Categories"
  }

  // Get active subcategory name
  const getActiveSubcategoryName = () => {
    if (!selectedSubcategory) return "All Subcategories"
    const category = categories.find((c) => c.id === selectedCategory)
    if (!category) return "All Subcategories"
    const subcategory = category.subcategories.find((s) => s.id === selectedSubcategory)
    return subcategory ? subcategory.title : "All Subcategories"
  }

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <div className="flex items-center mr-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${star <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#a435f0] to-[#8710d8] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Expand Your Knowledge</h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover thousands of courses taught by industry experts and take your skills to the next level.
            </p>
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="What do you want to learn today?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#a435f0]"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#a435f0] text-white px-4 py-2 rounded-lg hover:bg-[#8710d8] transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Wave shape divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg viewBox="0 0 1440 100" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
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
        className={`sticky top-0 z-30 bg-white border-b border-gray-200 transition-shadow ${isScrolled ? "shadow-md" : ""}`}
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
                        setSelectedCategory(null)
                        setSelectedSubcategory(null)
                        setShowCategoryDropdown(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        !selectedCategory ? "bg-[#f7f9fa] text-[#a435f0] font-medium" : "hover:bg-gray-100"
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
                            {category.subcategories.map((subcategory) => (
                              <button
                                key={subcategory.id}
                                onClick={() => handleSubcategorySelect(subcategory.id)}
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
                  setSelectedCategory(null)
                  setSelectedSubcategory(null)
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-[#a435f0] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                All Categories
              </button>

              {categories.map((category) => (
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
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#a435f0]"
              >
                <option value="popular">Most Popular</option>
                <option value="highest-rated">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-100"}`}
                >
                  <BarChart3 className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-100"}`}
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

                {categories
                  .find((c) => c.id === selectedCategory)
                  ?.subcategories.map((subcategory) => (
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
                  <button onClick={resetFilters} className="text-sm text-[#a435f0] hover:underline">
                    Reset All
                  </button>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">${priceRange[0]}</span>
                    <span className="text-sm text-gray-600">${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#a435f0]"
                  />
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Level</h4>
                  <div className="space-y-2">
                    {["Beginner", "Intermediate", "Advanced", "All Levels"].map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level)}
                          onChange={() => handleLevelSelect(level)}
                          className="rounded border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                        />
                        <span className="ml-2 text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Language</h4>
                  <div className="space-y-2">
                    {["English", "French", "Spanish", "German", "Japanese"].map((language) => (
                      <label key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(language)}
                          onChange={() => handleLanguageSelect(language)}
                          className="rounded border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                        />
                        <span className="ml-2 text-sm">{language}</span>
                      </label>
                    ))}
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
                          {renderStarRating(rating)}
                          <span className="ml-1 text-sm text-gray-600">& up</span>
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
                  ? `${getActiveCategoryName()} ${selectedSubcategory ? `- ${getActiveSubcategoryName()}` : ""} Courses`
                  : "All Courses"}
              </h2>
              <p className="text-gray-600">
                {filteredCourses.length} results
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* Courses */}
            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">No courses found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#a435f0] text-white rounded-lg hover:bg-[#8710d8] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-6"
                }
              >
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                      viewMode === "list" ? "flex flex-col md:flex-row" : ""
                    }`}
                    onMouseEnter={() => setHoveredCourse(course.id)}
                    onMouseLeave={() => setHoveredCourse(null)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`relative ${viewMode === "list" ? "md:w-64 flex-shrink-0" : ""}`}>
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      {course.bestseller && (
                        <div className="absolute top-3 left-3 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                          BESTSELLER
                        </div>
                      )}
                      {course.new && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                          NEW
                        </div>
                      )}
                      {hoveredCourse === course.id && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <div className="bg-white p-2 rounded-full">
                            <Play className="h-8 w-8 text-[#a435f0]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>
                        <button 
                          className={`flex-shrink-0 ml-2 ${wishlistedCourses.includes(course.id) ? 'text-red-500' : 'text-gray-400 hover:text-[#a435f0]'}`}
                          onClick={(e) => toggleWishlist(course.id, e)}
                          aria-label={wishlistedCourses.includes(course.id) ? "Retirer de la liste de souhaits" : "Ajouter à la liste de souhaits"}
                        >
                          <Heart className={`h-5 w-5 ${wishlistedCourses.includes(course.id) ? 'fill-red-500' : ''}`} />
                        </button>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>

                      <div className="flex items-center mb-2">
                        {renderStarRating(course.rating)}
                        <span className="text-xs text-gray-500 ml-1">({course.reviewCount.toLocaleString()})</span>
                      </div>

                      <div className="flex items-center text-xs text-gray-600 space-x-3 mb-3">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{course.studentsCount.toLocaleString()} students</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          <span>{course.level}</span>
                        </div>
                      </div>

                      {viewMode === "list" && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      )}

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center">
                          {course.salePrice ? (
                            <>
                              <span className="text-lg font-bold">${course.salePrice.toFixed(2)}</span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${course.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold">${course.price.toFixed(2)}</span>
                          )}
                        </div>

                        <button className="px-3 py-1.5 bg-[#a435f0] text-white text-sm font-medium rounded-lg hover:bg-[#8710d8] transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredCourses.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="px-4 py-2 rounded-md bg-[#a435f0] text-white font-medium">1</button>
                  <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
                    2
                  </button>
                  <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
                    3
                  </button>
                  <span className="px-2 text-gray-500">...</span>
                  <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
                    12
                  </button>
                  <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100">
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
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">${priceRange[0]}</span>
                    <span className="text-sm text-gray-600">${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#a435f0]"
                  />
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Level</h4>
                  <div className="space-y-2">
                    {["Beginner", "Intermediate", "Advanced", "All Levels"].map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level)}
                          onChange={() => handleLevelSelect(level)}
                          className="rounded border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                        />
                        <span className="ml-2 text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Language</h4>
                  <div className="space-y-2">
                    {["English", "French", "Spanish", "German", "Japanese"].map((language) => (
                      <label key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(language)}
                          onChange={() => handleLanguageSelect(language)}
                          className="rounded border-gray-300 text-[#a435f0] focus:ring-[#a435f0] h-4 w-4"
                        />
                        <span className="ml-2 text-sm">{language}</span>
                      </label>
                    ))}
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
                          {renderStarRating(rating)}
                          <span className="ml-1 text-sm text-gray-600">& up</span>
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
  )
}
