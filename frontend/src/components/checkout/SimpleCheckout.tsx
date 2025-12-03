import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Info } from 'lucide-react';
import StripeCheckout from './StripeCheckout';
import axiosClient from '@/api/axios';

interface CheckoutProps {
  courseId: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  price: number;
  originalPrice: number;
  image: string;
  duration: string;
  level: string;
  discount?: number;
  bestseller?: boolean;
}

export default function Checkout({ courseId }: CheckoutProps) {
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, you would fetch the course details from your API
        // For this example, we'll simulate an API call with a timeout
        const response = await axiosClient.get(`/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course details. Please try again.');
        
        // For demo purposes, set a sample course if the API call fails
        setCourse({
          id: courseId,
          title: "JavaScript Complet 2023: De Zéro à Expert",
          instructor: "Marie Dupont",
          price: 14.99,
          originalPrice: 89.99,
          image: "/placeholder.svg",
          duration: "22h",
          level: "Tous niveaux",
          discount: 83,
          bestseller: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Info className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Une erreur est survenue</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="text-orange-500 hover:text-orange-600"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const savings = course.originalPrice - course.price;
  const savingsPercentage = Math.round((savings / course.originalPrice) * 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Finaliser votre achat</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Course Summary */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Votre sélection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 py-4">
                <div className="flex-shrink-0">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-32 h-24 object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-lg">{course.title}</h3>
                  <p className="text-gray-600 text-sm">Par {course.instructor}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">{course.duration}</span>
                    <span className="text-xs">•</span>
                    <span className="text-sm text-gray-600">{course.level}</span>
                  </div>
                  {course.bestseller && <Badge className="bg-yellow-500 text-white mt-2">Bestseller</Badge>}
                </div>
                <div className="flex flex-col items-end justify-between">
                  <div className="text-right">
                    <p className="font-bold text-lg">{course.price.toFixed(2)} €</p>
                    <p className="text-gray-500 line-through text-sm">{course.originalPrice.toFixed(2)} €</p>
                    {course.discount && <Badge className="bg-red-500 text-white">-{course.discount}%</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Payment Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Prix original:</span>
                  <span>{course.originalPrice.toFixed(2)} €</span>
                </div>
                
                <div className="flex justify-between text-green-600">
                  <span>Économie:</span>
                  <span>-{savings.toFixed(2)} € ({savingsPercentage}%)</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{course.price.toFixed(2)} €</span>
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  En finalisant votre achat, vous acceptez nos conditions générales de vente et notre politique de confidentialité.
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <StripeCheckout courseId={courseId} />
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <div className="flex items-center justify-center mb-2">
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span>Paiement sécurisé</span>
            </div>
            <p>Accès immédiat après paiement</p>
          </div>
        </div>
      </div>
    </div>
  );
}