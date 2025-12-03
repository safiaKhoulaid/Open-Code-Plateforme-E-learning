import { create } from 'zustand';
import { z } from 'zod';
import axiosClient from '@/api/axios';
import { useAuthStore } from './useAuthStore';

// Définition du schéma de validation pour l'inscription à un cours
const enrollmentSchema = z.object({
  courseId: z.string(),
  userId: z.number(),
  enrollmentDate: z.date().optional(),
  progress: z.number().min(0).max(100).default(0),
});

// Type d'inscription à un cours
export type Enrollment = z.infer<typeof enrollmentSchema>;

// Interface pour le store d'inscriptions
interface EnrollmentState {
  // État
  enrolledCourses: string[]; // Liste des IDs de cours auxquels l'utilisateur est inscrit
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchEnrolledCourses: () => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
  enrollInCourse: (courseId: string) => Promise<void>;
  purchaseCourse: (courseId: string) => Promise<void>;
}

// Création du store Zustand
export const useEnrollmentStore = create<EnrollmentState>((set, get) => ({
  // État initial
  enrolledCourses: [],
  isLoading: false,
  error: null,
  
  // Actions
  fetchEnrolledCourses: async () => {
    const { user } = useAuthStore.getState();
    
    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({ enrolledCourses: [], error: null });
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      // Simulation d'une requête API pour récupérer les cours auxquels l'utilisateur est inscrit
      // Dans un cas réel, vous feriez une requête à votre API
      // const response = await axiosClient.get(`/api/users/${user.id}/enrollments`);
      
      // Pour l'exemple, nous utilisons des données simulées
      // Dans un cas réel, vous utiliseriez response.data
      const mockEnrolledCourses = ['1', '3', '5'];
      
      set({ 
        enrolledCourses: mockEnrolledCourses,
        isLoading: false 
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions:', error);
      set({ 
        error: 'Impossible de récupérer vos inscriptions. Veuillez réessayer.',
        isLoading: false 
      });
    }
  },
  
  isEnrolled: (courseId: string) => {
    return get().enrolledCourses.includes(courseId);
  },
  
  enrollInCourse: async (courseId: string) => {
    const { user } = useAuthStore.getState();
    
    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({ error: 'Vous devez être connecté pour vous inscrire à un cours.' });
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      // Simulation d'une requête API pour s'inscrire à un cours
      // Dans un cas réel, vous feriez une requête à votre API
      // await axiosClient.post('/api/enrollments', { courseId, userId: user.id });
      
      // Mise à jour de l'état local
      set(state => ({ 
        enrolledCourses: [...state.enrolledCourses, courseId],
        isLoading: false 
      }));
    } catch (error) {
      console.error('Erreur lors de l\'inscription au cours:', error);
      set({ 
        error: 'Impossible de vous inscrire à ce cours. Veuillez réessayer.',
        isLoading: false 
      });
    }
  },
  
  purchaseCourse: async (courseId: string) => {
    const { user } = useAuthStore.getState();
    
    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({ error: 'Vous devez être connecté pour acheter un cours.' });
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      // Simulation d'une requête API pour acheter un cours
      // Dans un cas réel, vous feriez une requête à votre API
      // await axiosClient.post('/api/purchases', { courseId, userId: user.id });
      
      // Une fois l'achat effectué, on inscrit automatiquement l'utilisateur au cours
      await get().enrollInCourse(courseId);
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Erreur lors de l\'achat du cours:', error);
      set({ 
        error: 'Impossible d\'acheter ce cours. Veuillez réessayer.',
        isLoading: false 
      });
    }
  },
}));