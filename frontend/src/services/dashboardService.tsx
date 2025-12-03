import  axiosClient  from '../api/axios';
import { DashboardData } from '../types/dashboard';

export const dashboardService = {
  // Récupérer toutes les données du tableau de bord
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      const response = await axiosClient.get<DashboardData>('/api/dashboard');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du tableau de bord:', error);
      throw error;
    }
  },

  getTeacherDashboardData: async (): Promise<DashboardData> => {
    try {
      const response = await axiosClient.get<DashboardData>('/api/teacher/dashboard');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du tableau de bord enseignant:', error);
      throw error;
    }
  },

  getStudentDashboardData: async (): Promise<DashboardData> => {
    try {
      const response = await axiosClient.get<DashboardData>('api/dashboard-student');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du tableau de bord étudiant:', error);
      throw error;
    }
  },

  // Récupérer uniquement les cours
  getCourses: async () => {
    const response = await axiosClient.get('/api/dashboard/courses');
    return response.data;
  },

  // Récupérer uniquement les certificats
  getCertificates: async () => {
    const response = await axiosClient.get('/api/dashboard/certificates');
    return response.data;
  },

  // Récupérer uniquement les notifications
  getNotifications: async () => {
    const response = await axiosClient.get('/api/dashboard/notifications');
    return response.data;
  },

  // Marquer une notification comme lue
  markNotificationAsRead: async (notificationId: number) => {
    const response = await axiosClient.patch(`/api/dashboard/notifications/${notificationId}/read`);
    return response.data;
  },

  // Marquer toutes les notifications comme lues
  markAllNotificationsAsRead: async () => {
    const response = await axiosClient.patch('/api/dashboard/notifications/read-all');
    return response.data;
  },

  // Mettre à jour le statut de favori d'un cours
  toggleCourseBookmark: async (courseId: number) => {
    const response = await axiosClient.patch(`/api/dashboard/courses/${courseId}/bookmark`);
    return response.data;
  },

  // Archiver un cours
  archiveCourse: async (courseId: number) => {
    const response = await axiosClient.patch(`/api/dashboard/courses/${courseId}/archive`);
    return response.data;
  }
}; 
