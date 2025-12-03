import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { redirectToCheckout, isEnrolledInCourse } from '../../stripeService';
import { useAuthStore } from '../../stores/authStore';

// Define interfaces for our component
interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructor: {
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  duration: string;
  level: string;
  rating: number;
  enrolledCount: number;
}

const CourseExplore: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { isAuthenticated } = useAuthStore();

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${courseId}`);

        if (!response.ok) {
          throw new Error('Impossible de charger les détails du cours');
        }

        const data = await response.json();
        setCourse(data);

        // Check if user is already enrolled
        if (isAuthenticated) {
          const enrolled = await isEnrolledInCourse(Number(courseId));
          setIsEnrolled(enrolled);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId, isAuthenticated]);

  // Handle purchase button click
  const handlePurchase = async () => {
    if (!isAuthenticated) {
      // Redirect to login page with return URL
      window.location.href = `/login?redirect=/courses/${courseId}`;
      return;
    }

    try {
      setIsProcessing(true);
      await redirectToCheckout(Number(courseId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'achat');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!course) {
    return <div className="text-center p-4">Cours non trouvé</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 bg-gray-200">
          {course.coverImage ? (
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-gray-500">Image non disponible</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center mr-6">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{course.rating.toFixed(1)}</span>
            </div>
            <div className="mr-6">
              <span className="text-gray-600">{course.enrolledCount} étudiants inscrits</span>
            </div>
            <div className="mr-6">
              <span className="text-gray-600">Niveau: {course.level}</span>
            </div>
            <div>
              <span className="text-gray-600">Durée: {course.duration}</span>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {course.instructor.avatar ? (
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">
                    {course.instructor.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-gray-700">Instructeur: {course.instructor.name}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">À propos de ce cours</h2>
            <p className="text-gray-700">{course.description}</p>
          </div>

          {/* Purchase or Access Button */}
          <div className="flex justify-between items-center border-t pt-6">
            <div className="text-2xl font-bold">
              {course.price > 0 ? `${course.price.toFixed(2)} €` : 'Gratuit'}
            </div>

            {isEnrolled ? (
              <Link
                to={`/courses/${courseId}/learn`}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Accéder au cours
              </Link>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className={`${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-bold py-3 px-6 rounded-lg transition duration-200`}
              >
                {isProcessing ? 'Traitement en cours...' : 'Acheter le cours'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseExplore;
