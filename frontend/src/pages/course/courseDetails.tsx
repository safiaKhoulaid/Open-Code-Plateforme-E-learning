import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCourses } from '@/hooks/useCourses'
import { useWishlistStore } from '@/hooks/useWishlistStore'
import { useCartStore } from '@/store/cartStore'
import { Course } from '@/types/course'
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  ShoppingCart,
  CheckCircle,
  Tag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { RatingForm } from '@/pages/course/ratingForm'
import { RatingList } from '@/pages/course/ratingList'
import { useToast } from "@/hooks/use-toast"
import  WishlistToggle  from "@/components/wishList/wishlistToggle"

export default function CourseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { courses, loading } = useCourses()
  const { 
    wishlistedCourses, 
    toggleWishlist: toggleWishlistStore,
    fetchWishlistedCourses,
    isLoading: wishlistLoading
  } = useWishlistStore()
  const { addToCart, items } = useCartStore()
  const { toast } = useToast()
  const [course, setCourse] = useState<Course | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)

  // Check if course is in wishlist
  const isInWishlist = id ? wishlistedCourses.includes(id) : false
  
  // Check if items is defined and is an array before using .some()
  const isInCart = id && items && Array.isArray(items) 
    ? items.some(item => item.course_id === Number(id)) 
    : false
  
  // Function to add course to cart
  const handleAddToCart = async () => {
    if (course?.id) {
      try {
        setIsAddingToCart(true)
        await addToCart(Number(course.id))
        toast({
          title: "Cours ajouté au panier",
          description: "Le cours a été ajouté à votre panier avec succès."
        })
        // Rediriger vers la page checkout
        navigate('/checkout')
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le cours au panier.",
          variant: "destructive"
        })
        console.error("Erreur d'ajout au panier:", error)
      } finally {
        setIsAddingToCart(false)
      }
    }
  }
  
  // Function to toggle wishlist status
  const toggleWishlist = async () => {
    if (id && !isTogglingWishlist) {
      try {
        setIsTogglingWishlist(true)
        await toggleWishlistStore(id)
        toast({
          title: isInWishlist ? "Cours retiré de la liste de souhaits" : "Cours ajouté à la liste de souhaits",
          description: isInWishlist 
            ? "Le cours a été retiré de votre liste de souhaits." 
            : "Le cours a été ajouté à votre liste de souhaits."
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la modification de votre liste de souhaits.",
          variant: "destructive"
        })
        console.error("Erreur de modification de la liste de souhaits:", error)
      } finally {
        setIsTogglingWishlist(false)
      }
    }
  }

  // Fetch wishlist courses when component mounts
  useEffect(() => {
    fetchWishlistedCourses()
  }, [fetchWishlistedCourses])

  useEffect(() => {
    if (courses && id) {

      const foundCourse = courses.find(c => String(c.id) === id)

      if (foundCourse) {
        setCourse(foundCourse)
      }
    }
  }, [courses, id])

  // Fetch cart items when component mounts
  useEffect(() => {
    useCartStore.getState().fetchCart()
  }, [])

  const handleRatingAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }
console.log("course",course)
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cours non trouvé</h1>
          <p className="text-gray-600">Le cours que vous recherchez n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="w-full p-8">
              <div className="flex justify-between mb-4">
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <div className="flex items-center">
                  {id && <WishlistToggle courseId={id} size="lg" />}
                  <Button 
                    onClick={handleAddToCart} 
                    className="bg-[#ff9500] hover:bg-[#e78500]"
                    disabled={isAddingToCart || isInCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isInCart ? 'Déjà dans le panier' : isAddingToCart ? 'Ajout en cours...' : 'Ajouter au panier'}
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>
                    {course.sections.reduce((total, section) => 
                      total + section.lessons.reduce((lessonTotal, lesson) => 
                        lessonTotal + (Number(lesson.duration) || 0), 0), 0)} minutes
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{course.total_students || 0} étudiants</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" fill="#facc15" />
                  <span><span className="text-yellow-500">{course.average_rating || 0}</span> ({course.total_reviews || 0} avis)</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{course.instructor.first_name} {course.instructor.last_name}</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Ce que vous apprendrez</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.what_you_will_learn?.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Prérequis</h2>
                <ul className="space-y-2">
                  {course.requirements?.map((requirement, index) => (
                    <li key={index} className="flex items-center">
                      <Play className="h-4 w-4 text-blue-500 mr-2" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {course.tags?.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {typeof tag === 'string' ? tag : (tag as { name?: string })?.name || ''}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Avis des étudiants</h2>
                <RatingForm courseId={Number(course.id)} onRatingAdded={handleRatingAdded} />
                <RatingList courseId={Number(course.id)} refresh={refreshKey} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <img 
                src={course.image_url || "/placeholder.svg"} 
                alt={course.title} 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <div className="mb-4">
                {course.discount ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">${course.price - course.discount}</span>
                    <span className="text-gray-500 line-through ml-2">${course.price}</span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">${course.price}</span>
                )}
              </div>

              <Button 
                onClick={handleAddToCart} 
                className="w-full bg-[#ff9500] hover:bg-[#e78500] mb-4"
                disabled={isAddingToCart || isInCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isInCart ? 'Déjà dans le panier' : isAddingToCart ? 'Ajout en cours...' : 'Ajouter au panier'}
              </Button>

              <div className="text-sm text-gray-600">
                <p>Garantie de remboursement de 30 jours</p>
                <p>Accès à vie</p>
                <p>Accès sur mobile et TV</p>
                <p>Certificat de complétion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

