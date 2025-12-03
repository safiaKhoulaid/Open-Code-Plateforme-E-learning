// hooks/useStudentDashboardData.js
import { useEffect, useState } from 'react';
import axiosClient  from '../api/axios';
import { AxiosError } from 'axios';
import { useAuth } from './useAuth';

interface ErrorResponse {
  message: string;
}

// Définir l'interface pour les données du tableau de bord
interface DashboardData {
  courses: Array<{
    id: number;
    title: string;
    instructor: string;
    progress: number;
    image: string;
    lastViewed: string;
    rating: number;
    reviews: number;
    totalLessons: number;
    completedLessons: number;
    category: string;
    level: string;
    description: string;
    bookmarked: boolean;
    isArchived: boolean;
    estimatedTimeLeft: string;
    lastSection: string;
    lastLesson: string;
  }>;
  certificates: Array<{
    id: number;
    title: string;
    issuer: string;
    date: string;
    image: string;
    course: string;
    skills: string[];
  }>;
  notifications: Array<{
    id: number;
    title: string;
    course: string;
    time: string;
    icon: string;
    read: boolean;
  }>;
  userProfile: {
    name: string;
    email: string;
    avatar: string;
  };
  progress: number;
  wishlists?: Array<{
    id: number;
    user_id: number;
    course_id: number;
    has_notifications: boolean;
    added_at: string;
    created_at: string;
    updated_at: string;
    course: {
      id: number;
      title: string;
      subtitle: string | null;
      description: string;
      slug: string | null;
      instructor_id: number;
      level: string;
      language: string;
      image_url: string | null;
      video_url: string | null;
      price: string;
      discount: string | null;
      published_date: string | null;
      last_updated: string | null;
      status: string;
      requirements: any | null;
      what_you_will_learn: any | null;
      target_audience: any | null;
      average_rating: string;
      total_reviews: number;
      total_students: number;
      has_certificate: boolean;
      created_at: string;
      updated_at: string;
      category_id: number | null;
    };
  }>;
}

export default function useStudentDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Début de la requête API...");
        const token =JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token;

        console.log("Token utilisé:", token );


        // Utiliser l'URL relative pour bénéficier du proxy Vite
        const response = await axiosClient.get('http://localhost:8000/api/dashboard-student', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Réponse API reçue:", response);
        console.log("Structure complète de la réponse:", JSON.stringify(response.data, null, 2));

        // Vérifier si la structure de la réponse est correcte
        if (response.data && response.data.data) {
          console.log("Données du tableau de bord:", response.data);
          console.log("Cours:", response.data.data.courses);
          console.log("Certificats:", response.data.data.certificates);
          console.log("Profil:", response.data.data.profile);

          // Vérifier si les tableaux sont vides
          if (response.data.data.courses && response.data.data.courses.length === 0) {
            console.log("Aucun cours trouvé dans la réponse");
          }

          if (response.data.data.certificates && response.data.data.certificates.length === 0) {
            console.log("Aucun certificat trouvé dans la réponse");
          }

          // Vérifier si les wishlists sont présentes
          if (response.data.data.wishlists) {
            console.log("Wishlists trouvées dans la réponse:", response.data.data.wishlists);
            console.log("Nombre de wishlists:", response.data.data.wishlists.length);
          } else {
            console.log("Aucune wishlist trouvée dans la réponse");
          }

          // Fix the " progress" property (with a space) in the API response
          const cleanedData = { ...response.data.data };
          if (cleanedData[" progress"] !== undefined) {
            cleanedData.progress = cleanedData[" progress"];
            delete cleanedData[" progress"];
          }

          setData(cleanedData);
          setError(null);
        } else {
          console.error("Structure de réponse incorrecte:", response.data);
          setError("Format de réponse API incorrect");
          setData(null);
        }
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });
        setError(error.response?.data?.message || 'Une erreur est survenue lors de la récupération des données');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // console.log("État actuel:", { data, loading, error });
  return { data, loading, error };
}
