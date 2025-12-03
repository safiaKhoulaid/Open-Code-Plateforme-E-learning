// hooks/useStudentDashboardData.js
import { useEffect, useState } from 'react';
import axiosClient  from '../api/axios';
import { AxiosError } from 'axios';
import { useAuth } from './useAuth';

interface ErrorResponse {
  message: string;
}

// Import des interfaces depuis le fichier types
import { DashboardCourse, Profile } from '@/types/dashboard';

// Interface pour le profil de l'enseignant
export interface TeacherProfile {
  id: number;
  user_id: number;
  bio?: string;
  avatar_url?: string;
  job_title?: string;
  website?: string;
  social_links?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
}

// Interface pour un étudiant inscrit
export interface EnrolledStudent {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
  };
  enrollment_date: string;
  course_id: number;
  progress: number;
}

// Interface pour une notification
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  content: string;
  is_read: boolean;
  type: string;
  created_at: string;
}

// Interface pour les statistiques d'un cours
export interface CourseStatistic {
  id: number;
  title: string;
  image_url?: string;
  students_count: number;
  revenue: number;
  rating: number;
  status: string;
  created_at: string;
}

// Interface pour les paramètres utilisateur
export interface UserSettings {
  id: number;
  user_id: number;
  notification_preferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme_preferences?: {
    dark_mode: boolean;
    color_scheme: string;
  };
  language?: string;
}

// Interface principale pour les données du tableau de bord
export interface DashboardData {
  teacher: {
    id: number;
    name: string;
    email: string;
    profile: TeacherProfile;
  };
  dashboard: {
    total_courses: number;
    total_students: number;
    total_revenue: number;
    average_rating: number;
  };
  settings: UserSettings;
  courses: CourseStatistic[];
  recent_students: EnrolledStudent[];
  notifications: Notification[];
}

export default function useTeacherDashboardData() {
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
        const teacherId= JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user?.id;


        console.log("Token utilisé:", token ? "Token présent" : "Token absent");


        // Utiliser l'URL relative pour bénéficier du proxy Vite
        const response = await axiosClient.get(`/api/teacher/${teacherId}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Réponse API reçue:", response);
        console.log("Structure complète de la réponse:", JSON.stringify(response.data, null, 2));

        // La réponse est directement dans response.data, pas dans response.data.data
        if (response.data) {
          setData(response.data);
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

  console.log("État actuel:", { data, loading, error });
  return { data, loading, error };
}
