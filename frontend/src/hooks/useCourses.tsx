import { useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axios';
import { AxiosError } from 'axios';

// Définir les types localement pour éviter les problèmes d'importation
interface Course {
  id: string;
  title: string;
  description: string;
  price: string | number;
  average_rating: string | number;
  level: string;
  language: string;
  categories: Array<{
    id: number | string;
    title: string;
  }>;
  total_students: number;
  created_at: string;
}

interface ErrorResponse {
  message: string;
}

interface FilterParams {
  search?: string;
  category?: string | null;
  levels?: string[];
  languages?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number | null;
}

// Service course simplifié
const courseService = {
  async getAllCourses() {
    try {
      const response = await axiosClient.get('/api/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }
};

export const useCourses = (filters?: FilterParams) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [coursesPaids, setCoursesPaids] = useState<Course[]>([]);

  // Ajouter un effet pour surveiller les changements de filtres
  useEffect(() => {
    if (filters) {
      console.log("Filtres changés dans useCourses:", filters);
    }
  }, [filters]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await courseService.getAllCourses();
        console.log('Réponse API Cours:', response);

        if (response && response.courses && response.courses.data) {
          setCourses(response.courses.data);
          
          if (response.courses_payes && Array.isArray(response.courses_payes)) {
            setCoursesPaids(response.courses_payes);
          }
        } else if (response.data && Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          console.error('Format de réponse invalide:', response);
          setError("Format de réponse invalide");
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des cours:', err);
        const error = err as AxiosError<ErrorResponse>;
        setError(error.response?.data?.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filtrer les cours selon les paramètres fournis
  const filteredCourses = useMemo(() => {
    console.log("Recalcul des cours filtrés avec filtres:", filters);
    console.log("Nombre total de cours:", courses.length);
    
    if (!filters) {
      console.log("Aucun filtre appliqué, retourne tous les cours");
      return courses;
    }
    
    const result = courses.filter(course => {
      // Filtre par recherche
      if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Filtre par catégorie
      if (filters.category && !course.categories.some(cat => cat.id.toString() === filters.category)) {
        return false;
      }
      
      // Filtre par niveau
      if (filters.levels && filters.levels.length > 0 && !filters.levels.includes(course.level)) {
        return false;
      }
      
      // Filtre par langue
      if (filters.languages && filters.languages.length > 0 && !filters.languages.includes(course.language)) {
        return false;
      }
      
      // Filtre par note
      if (filters.rating && Number(course.average_rating) < filters.rating) {
        return false;
      }
      
      // Filtre par prix
      const coursePrice = Number(course.price);
      if (filters.minPrice !== undefined && coursePrice < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && coursePrice > filters.maxPrice) {
        return false;
      }
      
      return true;
    });
    
    console.log("Nombre de cours après filtrage:", result.length);
    return result;
  }, [courses, filters]);

  return { 
    courses: filteredCourses, 
    allCourses: courses,
    coursesPaids, 
    loading, 
    error 
  };
};