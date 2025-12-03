import { useState, useEffect } from 'react';
import { Course, Category, Tag, ApiCourse } from '@/types/course';
import { courseService } from '@/services/courseService';
import { AxiosError } from 'axios';

interface PaginationData {
  current_page: number;
  per_page: number;
  total: number;
}

// Fonction utilitaire pour convertir les cours depuis l'API vers le format interne
const convertApiCourseToCourse = (apiCourse: ApiCourse): Course => {
  console.log("Conversion du cours API:", apiCourse.id, apiCourse.title);
  return {
    id: String(apiCourse.id),
    title: apiCourse.title || '',
    subtitle: apiCourse.subtitle || '',
    description: apiCourse.description || '',
    category_id: String(apiCourse.category_id || ''),
    subcategory: apiCourse.subcategory || '',
    level: apiCourse.level || 'All Levels',
    language: apiCourse.language || '',
    price: Number(apiCourse.price || 0),
    salePrice: apiCourse.discount ? Number(apiCourse.price) * (1 - Number(apiCourse.discount) / 100) : undefined,
    image_url: apiCourse.image_url || '',
    instructor_id: apiCourse.instructor_id,
    status: apiCourse.status || '',
    created_at: apiCourse.created_at || '',
    updated_at: apiCourse.updated_at || '',
    sections: apiCourse.sections || [],
    tags: apiCourse.tags?.map(tag => tag.name) || [],
    what_you_will_learn: apiCourse.what_you_will_learn || [],
    requirements: apiCourse.requirements || [],
    instructor: {
      id: apiCourse.instructor?.id || 0,
      first_name: apiCourse.instructor?.firstName || '',
      last_name: apiCourse.instructor?.lastName || '',
      email: apiCourse.instructor?.email || '',
      avatar_url: apiCourse.instructor?.avatar_url || '',
      bio: apiCourse.instructor?.bio || ''
    },
    discount: Number(apiCourse.discount || 0),
    average_rating: Number(apiCourse.average_rating || 0),
    total_reviews: apiCourse.total_reviews || 0,
    total_students: apiCourse.total_students || 0,
    resources: apiCourse.resources || []
  };
};

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    per_page: 10,
    total: 0
  });
  const [coursesPaids, setCoursesPaids] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Appel à getAllCourses...');
        const response = await courseService.getAllCourses();
        
        if (!response) {
          console.error('Réponse vide du serveur pour les cours');
          setCourses([]);
          return;
        }

        console.log('Structure de la réponse:', Object.keys(response));
        
        // Vérifier si courses existe et est un objet qui contient data
        if (response.courses && typeof response.courses === 'object') {
          console.log('Structure de courses:', Object.keys(response.courses));
          
          if (response.courses.data && Array.isArray(response.courses.data)) {
            console.log(`Nombre de cours reçus: ${response.courses.data.length}`);
            
            try {
              // On considère que la réponse contient des ApiCourse et on les convertit
              const apiCourses = response.courses.data as unknown as ApiCourse[];
              console.log('Premier cours brut:', apiCourses[0]);
              
              const validatedCourses = apiCourses.map(convertApiCourseToCourse);
              console.log(`Nombre de cours convertis: ${validatedCourses.length}`);
              console.log('Premier cours converti:', validatedCourses[0]);
              
              setCourses(validatedCourses);
              console.log('Cours définis dans le state');
            } catch (conversionError) {
              console.error('Erreur lors de la conversion des cours:', conversionError);
              setCourses([]);
            }
            
            setPagination({
              current_page: response.courses.current_page || 1,
              per_page: response.courses.per_page || 10,
              total: response.courses.total || 0
            });
          } else {
            console.warn('Format de réponse invalide pour les cours:', response.courses);
            console.warn('courses.data existe:', !!response.courses.data);
            console.warn('courses.data est un tableau:', Array.isArray(response.courses.data));
            setCourses([]);
          }
        } else {
          console.warn('Propriété courses invalide dans la réponse:', response.courses);
          setCourses([]);
        }

        // Traiter les catégories
        if (response.categories && Array.isArray(response.categories)) {
          console.log(`Nombre de catégories reçues: ${response.categories.length}`);
          setCategories(response.categories);
        } else {
          console.warn('Format invalide pour les catégories:', response.categories);
          setCategories([]);
        }

        // Traiter les tags
        if (response.tags && Array.isArray(response.tags)) {
          console.log(`Nombre de tags reçus: ${response.tags.length}`);
          setTags(response.tags);
        } else {
          console.warn('Format invalide pour les tags:', response.tags);
          setTags([]);
        }

        // Traiter les cours payés
        if (response.courses_payes && Array.isArray(response.courses_payes)) {
          console.log(`Nombre de cours payés reçus: ${response.courses_payes.length}`);
          try {
            // Même approche pour les cours payés
            const apiPaidCourses = response.courses_payes as unknown as ApiCourse[];
            const validatedPaidCourses = apiPaidCourses.map(convertApiCourseToCourse);
            console.log(`Nombre de cours payés convertis: ${validatedPaidCourses.length}`);
            setCoursesPaids(validatedPaidCourses);
          } catch (conversionError) {
            console.error('Erreur lors de la conversion des cours payés:', conversionError);
            setCoursesPaids([]);
          }
        } else {
          console.warn('Format invalide pour les cours payés:', response.courses_payes);
          setCoursesPaids([]);
        }

      } catch (err) {
        console.error('Erreur détaillée lors du chargement des cours:', err);
        
        if (err instanceof AxiosError) {
          const errorMessage = err.response?.data?.message || err.message;
          setError(`Erreur de serveur: ${errorMessage}`);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erreur inattendue lors du chargement des cours');
        }
        
        // Réinitialiser les états en cas d'erreur
        setCourses([]);
        setCategories([]);
        setTags([]);
        setCoursesPaids([]);
      } finally {
        setLoading(false);
        console.log('Cours disponibles à la fin de fetchCourses:', courses.length);
      }
    };

    fetchCourses();

    // Vérifier l'état après un délai
    const checkStateTimer = setTimeout(() => {
      console.log('État après délai - courses:', courses.length);
      console.log('État après délai - loading:', loading);
    }, 3000);

    return () => clearTimeout(checkStateTimer);
  }, []);

  // Pour s'assurer que l'état retourné est celui que nous attendons
  useEffect(() => {
    console.log('Changement d\'état détecté - courses:', courses.length);
  }, [courses]);

  console.log('État au rendu - courses:', courses.length);
  console.log('État au rendu - loading:', loading);

  return { 
    courses, 
    loading, 
    error, 
    pagination, 
    categories, 
    tags, 
    coursesPaids 
  };
}; 