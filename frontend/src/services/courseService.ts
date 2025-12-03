import axiosClient from '@/api/axios';
import { Course, Section, Lesson, Category, Tag } from '@/types/course';
import { Rating } from '@/types/rating';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface CourseResponse {
  courses: {
    data: Course[];
    current_page: number;
    total: number;
    per_page: number;
  };
  categories: Category[];
  tags: Tag[];
  courses_payes: Course[];
  message: string;
}

export const courseService = {
  // Course APIs
  async createCourse(courseData: Partial<Course>): Promise<Course> {
    try {
      // Récupérer le token depuis localStorage de deux façons possibles pour plus de fiabilité
      let token = null;
      const authStorage = localStorage.getItem('auth-storage');
      
      if (authStorage) {
        try {
          const authData = JSON.parse(authStorage);
          token = authData?.state?.token;
        } catch (e) {
          console.warn("Erreur lors de la récupération du token depuis auth-storage:", e);
        }
      }
      
      // Fallback sur le token simple
      if (!token) {
        token = localStorage.getItem('token');
      }
      
      console.log("Token utilisé:", token ? "Token trouvé" : "Aucun token trouvé");
      
      // Vérifier si l'utilisateur est authentifié
      if (!token) {
        throw new Error("Vous n'êtes pas authentifié. Veuillez vous connecter à nouveau.");
      }

      const response = await axiosClient.post('api/courses', courseData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Réponse complète de création de cours:", response);
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée lors de la création du cours:', error);
      
      if (error.response) {
        // Le serveur a répondu avec un statut d'erreur
        console.error('Réponse d\'erreur du serveur:', error.response.data);
        console.error('Statut HTTP:', error.response.status);
        throw new Error(`Erreur serveur: ${error.response.data.message || 'Erreur inconnue'} (${error.response.status})`);
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error('Aucune réponse reçue:', error.request);
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Erreur de configuration de la requête:', error.message);
        throw new Error(error.message || "Erreur lors de la création du cours");
      }
    }
  },

  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.put(
        `api/courses/${courseId}`, 
        courseData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await axiosClient.delete(
        `api/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );
    } catch (error) {
      console.error('Erreur lors de la suppression du cours:', error);
      throw error;
    }
  },

  async getCourseById(courseId: string): Promise<Course> {
    try {
      const response = await axiosClient.get(`/api/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Section APIs
  async addSection(courseId: string, sectionData: Partial<Section>): Promise<Section> {
    try {
      // Récupérer le token avec une meilleure gestion
      let token = null;
      const authStorage = localStorage.getItem('auth-storage');
      
      if (authStorage) {
        try {
          const authData = JSON.parse(authStorage);
          token = authData?.state?.token;
        } catch (e) {
          console.warn("Erreur lors de la récupération du token depuis auth-storage:", e);
        }
      }
      
      // Fallback sur le token simple
      if (!token) {
        token = localStorage.getItem('token');
      }

      if (!token) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await axiosClient.post(
        `api/courses/${courseId}/sections`, 
        sectionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      
      console.log("Réponse complète d'ajout de section:", response);
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée lors de l\'ajout de la section:', error);
      
      if (error.response) {
        console.error('Réponse d\'erreur du serveur:', error.response.data);
        console.error('Statut HTTP:', error.response.status);
        throw new Error(`Erreur serveur: ${error.response.data.message || 'Erreur inconnue'} (${error.response.status})`);
      } else if (error.request) {
        console.error('Aucune réponse reçue:', error.request);
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      } else {
        console.error('Erreur de configuration de la requête:', error.message);
        throw new Error(error.message || "Erreur lors de l'ajout de la section");
      }
    }
  },

  async updateSection(courseId: string, sectionId: string, sectionData: Partial<Section>): Promise<Section> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.put(
        `api/courses/${courseId}/sections/${sectionId}`, 
        sectionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  },

  async deleteSection(courseId: string, sectionId: string): Promise<void> {
    try {
      await axiosClient.delete(`${API_URL}/courses/${courseId}/sections/${sectionId}`);
    } catch (error) {
      console.error('Error deleting section:', error);
      throw error;
    }
  },
  async addLesson(courseId: string, sectionId: string, lessonData: Partial<Lesson>, token: string): Promise<Lesson> {
    try {
      console.log("=== DEBUG addLesson ===");
      console.log("Paramètres reçus:", { courseId, sectionId });
      console.log("Données de la leçon:", lessonData);
      
      // Récupérer le token avec une meilleure gestion
      if (!token) {
        console.log("Token non fourni dans les paramètres, recherche dans le stockage");
        const authStorage = localStorage.getItem('auth-storage');
        
        if (authStorage) {
          try {
            const authData = JSON.parse(authStorage);
            token = authData?.state?.token;
            console.log("Token récupéré depuis auth-storage:", token ? "Token trouvé" : "Token non trouvé");
          } catch (e) {
            console.warn("Erreur lors de la récupération du token depuis auth-storage:", e);
          }
        }
        
        // Fallback sur le token simple
        if (!token) {
          token = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token;
          console.log("Token récupéré depuis localStorage:", token ? "Token trouvé" : "Token non trouvé");
        }
      } else {
        console.log("Token fourni dans les paramètres");
      }

      if (!token) {
        console.error("!!! ERREUR: Token d'authentification manquant pour ajouter une leçon !!!");
        throw new Error("Token d'authentification manquant pour ajouter une leçon");
      }

      console.log("URL de la requête:", `api/courses/${courseId}/sections/${sectionId}/lessons`);
      console.log("En-têtes:", {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      // Vérifier les valeurs
      if (!courseId) {
        throw new Error("courseId est requis");
      }
      
      if (!sectionId) {
        throw new Error("sectionId est requis");
      }
      
      if (!lessonData.title) {
        throw new Error("Le titre de la leçon est requis");
      }

      // Utiliser application/json au lieu de multipart/form-data car nous n'envoyons pas de fichiers ici
      try {
        const response = await axiosClient.post(
          `api/courses/${courseId}/sections/${sectionId}/lessons`,
          lessonData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            timeout: 10000 // Ajouter un timeout de 10 secondes
          }
        );
        
        console.log("Réponse de l'ajout de leçon:", response.data);
        console.log("=== FIN DEBUG addLesson - Succès ===");
        return response.data;
      } catch (apiError: any) {
        console.error("Erreur détaillée lors de l'appel API:", apiError);
        
        if (apiError.response) {
          console.error("Status:", apiError.response.status);
          console.error("Response data:", apiError.response.data);
          console.error("Headers:", apiError.response.headers);
        } else if (apiError.request) {
          console.error("Request made but no response received:", apiError.request);
        }
        
        throw apiError;
      }
    } catch (error: any) {
      console.error('=== FIN DEBUG addLesson - ERREUR ===');
      console.error('Erreur détaillée lors de l\'ajout de la leçon:', error);
      
      if (error.response) {
        console.error('Réponse d\'erreur du serveur:', error.response.data);
        console.error('Statut HTTP:', error.response.status);
        throw new Error(`Erreur serveur: ${error.response.data.message || 'Erreur inconnue'} (${error.response.status})`);
      } else if (error.request) {
        console.error('Aucune réponse reçue:', error.request);
        throw new Error("Aucune réponse du serveur pour l'ajout de leçon. Vérifiez votre connexion internet.");
      } else {
        console.error('Erreur de configuration de la requête:', error.message);
        throw new Error(error.message || "Erreur lors de l'ajout de la leçon");
      }
    }
  },

  async updateLesson(courseId: string, sectionId: string, lessonId: string, lessonData: Partial<Lesson>): Promise<Lesson> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.put(
        `api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, 
        lessonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  },

  async deleteLesson(courseId: string, sectionId: string, lessonId: string): Promise<void> {
    try {
      await axiosClient.delete(`${API_URL}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }
  },

  // Category APIs
  async getCategories(): Promise<Category[]> {
    try {
      const response = await axiosClient.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async addCategory(categoryData: Partial<Category>): Promise<Category> {
    try {
      const response = await axiosClient.post(`${API_URL}/categories`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  // Tag APIs
  async getTags(): Promise<Tag[]> {
    try {
      const response = await axiosClient.get(`http://localhost:8000/api/tags`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },

  async attachTagToCourse(courseId: string, tagId: number): Promise<{ success: boolean; message: string }> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post(
        `api/courses/${courseId}/attach-tag`,
        { tag_id: tagId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      
      return { 
        success: true, 
        message: 'Tag attaché avec succès au cours',
        ...response.data 
      };
    } catch (error) {
      console.error("Erreur lors de l'attachement du tag au cours:", error);
      throw error;
    }
  },

  async addTag(courseId: string, tagName: string): Promise<{ success: boolean; message: string }> {
    const token = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token;

    try {
      if (!tagName.trim()) {
        throw new Error('Le nom du tag ne peut pas être vide');
      }

      // Étape 1 : Créer le tag
      const createTagResponse = await axiosClient.post(
        `http://localhost:8000/api/courses/${courseId}/tags`,
        { name: tagName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
console.log("createTagResponse", createTagResponse)
      const tagId = createTagResponse.data.tag.id;
      console.log("tagId=================================", tagId)
      if (!tagId) {
        throw new Error('Erreur lors de la création du tag');
      }

      // Étape 2 : Attacher le tag au cours
      await axiosClient.post(
        `${API_URL}/api/courses/${courseId}/tags`,
        { tags: [tagId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true, message: 'Tag ajouté avec succès' };

    } catch (error) {
      console.error("Erreur lors de l'ajout du tag:", error);
      throw error;
    }
  },

  async updateCourseTags(courseId: string, tags: string[]): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem('token');
    
    try {
      // Filtrer les tags null ou vides
      const validTags = tags.filter(tag => tag && tag.trim());
      
      if (validTags.length === 0) {
        throw new Error('Aucun tag valide fourni');
      }

      await axiosClient.put(
        `${API_URL}/api/courses/${courseId}/tags`,
        { tags: validTags },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return { success: true, message: 'Tags mis à jour avec succès' };
    } catch (error) {
      console.error("Erreur lors de la mise à jour des tags:", error);
      throw error;
    }
  },

  // File upload API
  async uploadAttachment(file: File, lessonId: string): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
        formData.append('type', 'lesson');
      }

      const response = await axiosClient.post(
        `api/lessons/${lessonId}/attachments`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  },

  // Course image upload
  async uploadCourseImage(courseId: string, file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosClient.post(
        `${API_URL}/courses/${courseId}/image`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error uploading course image:', error);
      throw error;
    }
  },

  async uploadFile (type: string, file: File) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        console.log("Envoi du fichier au serveur...", { type, fileName: file.name });

        const response = await axiosClient.post(
            'api/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
        );
        
        console.log("Réponse du serveur pour l'upload:", response.data);
        
        // Format attendu par le contrôleur Laravel:
        // {
        //   status: 'success',
        //   message: 'File uploaded successfully',
        //   data: {
        //     file_name: '...',
        //     file_url: '...',
        //     file_path: '...',
        //     file_size: '...',
        //     file_type: '...'
        //   }
        // }
        
        return response.data;
    } catch (error) {
        console.error('Erreur lors du téléchargement du fichier:', error);
        throw error;
    }
  },

  // Resource APIs
  async addResource(courseId: string, resourceData: {
    title: string;
    type: string;
    file_url: string;
    is_downloadable: boolean;
    lesson_id?: number;
  }): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post(
        `api/courses/${courseId}/resources`,
        resourceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding resource:', error);
      throw error;
    }
  },

  async getEnrolledStudents(courseId: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.get(
        `api/courses/${courseId}/enrolled-students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      throw error;
    }
  },

  // Ratings APIs
  async getCourseRatings(courseId: string): Promise<Rating[]> {
    try {
      const response = await axiosClient.get(`${API_URL}/courses/${courseId}/ratings`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des évaluations:', error);
      throw error;
    }
  },

  async submitRating(courseId: string, ratingData: { stars: number; comment: string }): Promise<Rating> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post(
        `api/courses/${courseId}/ratings`,
        ratingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'évaluation:', error);
      throw error;
    }
  },

  async getUserRating(courseId: string): Promise<Rating | null> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.get(
        `api/courses/${courseId}/ratings/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );
      return response.data?.rating || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'évaluation de l\'utilisateur:', error);
      return null;
    }
  },

  async getAllCourses(): Promise<CourseResponse> {
    try {
      console.log('Début de la requête getAllCourses...');
      const token = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token;
      const response = await axiosClient.get('api/courses', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      console.log('Réponse brute de getAllCourses:', response.data);
      
      if (!response.data) {
        throw new Error('Pas de données dans la réponse');
      }

      return response.data;
    } catch (error: any) {
      console.error('Détails de l\'erreur getAllCourses:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  async markLessonAsCompleted(courseId: string, lessonId: string ,sectionIndex: number): Promise<any> {
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token;
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }
      
      const response = await axiosClient.post(
        `http://localhost:8000/api/courses/${courseId}/sections/${sectionIndex}/lessons/${lessonId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage de la leçon comme terminée:', error);
      throw error;
    }
  },
  
  async completeCourse(courseId: string): Promise<any> {
    try {
      const token = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token;
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }
      
      const response = await axiosClient.post(
        `api/courses/${courseId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage du cours comme complété:', error);
      throw error;
    }
  }
};
