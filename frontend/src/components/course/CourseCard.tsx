import { useState } from "react"
import { Play, BookOpen, Clock, Star, ChevronRight, Heart } from "lucide-react"
import CourseDetails from "./CourseDetails"
import { Link } from "react-router-dom"
import { useWishlistStore } from "@/hooks/useWishlistStore"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/cartStore"

interface CourseCardProps {
  course: {
    id: number
    title: string
    instructor: string
    progress: number
    image: string
    lastViewed: string
    rating: number
    reviews: number
    totalLessons: number
    completedLessons: number
    category: string
    level: string
    description: string
    bookmarked: boolean
    isArchived: boolean
    estimatedTimeLeft: string
    lastSection: string
    lastLesson: string
    discount: string
    price: string
    average_rating: number
    total_reviews: number
    language: string
    sections: {
      lessons: { duration: string }[]
    }[]
  }
  isWishlisted?: boolean
}

export default function CourseCard({ course, isWishlisted }: CourseCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const { toggleWishlist } = useWishlistStore()
  const { isInCart } = useCartStore()
  const isInCartState = course.id ? isInCart(Number(course.id)) : false

  const handleToggleWishlist = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (course.id) {
      toggleWishlist(course.id.toString())
    }
  }

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
        {course.total_reviews && (
          <span className="ml-1 text-xs text-gray-500">
            ({course.total_reviews})
          </span>
        )}
      </div>
    )
  }

  return (
    <Link
      to={`/course/${course.id}`}
      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <button
          onClick={handleToggleWishlist}
          className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-sm transition-transform hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        </button>
        {course.discount && Number(course.discount) > 0 && (
          <Badge
            className="absolute left-2 top-2 bg-red-500 text-white"
            variant="secondary"
          >
            -{Math.round((Number(course.discount) / Number(course.price)) * 100)}%
          </Badge>
        )}
        {isInCartState && (
          <Badge
            className="absolute bottom-2 right-2 bg-[#FF9500] text-white"
            variant="secondary"
          >
            Dans le panier
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 font-semibold">{course.title}</h3>
        <p className="mb-2 line-clamp-2 text-sm text-gray-600">
          {course.description}
        </p>
        
        <div className="mb-3">
          {renderStars(Number(course.average_rating) || 0)}
        </div>

        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-gray-100 px-2 py-1">
            {course.level}
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-1">
            {course.language}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-y-2 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {course.sections?.reduce(
                (total, section) =>
                  total +
                  section.lessons.reduce(
                    (lessonTotal, lesson) =>
                      lessonTotal + (Number(lesson.duration) || 0),
                    0
                  ),
                0
              ) || 0}{" "}
              mins
            </span>
          </div>
          <div>
            {course.discount && Number(course.discount) > 0 ? (
              <div className="flex items-center">
                <span className="font-bold">${Number(course.price) - Number(course.discount)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${Number(course.price)}
                </span>
              </div>
            ) : (
              <span className="font-bold">${Number(course.price)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
} 