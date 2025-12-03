import  axiosClient  from '../api/axios';
import { DashboardData } from '../types/dashboard';

export const dashboardService = {
  async getStudentDashboard(): Promise<DashboardData> {
    try {
      const response = await axiosClient.get<{ data: DashboardData }>('/api/dashboard-student');
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du tableau de bord:', error);
      throw error;
    }
  }
}; 