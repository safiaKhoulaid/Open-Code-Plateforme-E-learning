import axiosClient  from '../api/axios';
import { ProfileResponse, UserSettings, NotificationSettings, PaymentMethod } from '../types/profile';

export const profileService = {
  // Récupérer le profil
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const user_id = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user?.id;
      const response = await axiosClient.get<ProfileResponse>(`api/profile/${user_id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },

  // Mettre à jour le profil complet
  updateProfile: async (data: Partial<UserSettings>): Promise<ProfileResponse> => {
    try {
      const formData = new FormData();
      const user_id = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user?.id;
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      
      // Ajouter les champs obligatoires avec les noms exacts utilisés par l'API
      formData.append('firstName', data.firstName || user?.firstName || '');
      formData.append('lastName', data.lastName || user?.lastName || '');
      
      // Ajouter les champs biographie et réseaux sociaux avec les noms corrects
      if (data.biography !== undefined && data.biography !== null) {
        formData.append('biography', data.biography);
      }
      
      if (data.linkdenLink !== undefined && data.linkdenLink !== null) {
        formData.append('linkdebLink', data.linkdenLink); // Correction du nom du champ
      }
      
      if (data.instagramLink !== undefined && data.instagramLink !== null) {
        formData.append('instagramLink', data.instagramLink);
      }
      
      if (data.discordLink !== undefined && data.discordLink !== null) {
        formData.append('discordLink', data.discordLink);
      }
      
      if (data.phone !== undefined && data.phone !== null) {
        formData.append('phone', data.phone);
      }
      
      if (data.website !== undefined && data.website !== null) {
        formData.append('website', data.website);
      }
      
      // Traitement spécial pour l'avatar/image de profil
      if (data.avatar instanceof File) {
        formData.append('profilPicture', data.avatar); // Correction du nom du champ
      }

      // Log pour le debug
      console.log("FormData contenu:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? 'File object' : value}`);
      }

      const response = await axiosClient.put<ProfileResponse>(`api/profile/${user_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },

  // Mettre à jour uniquement les paramètres de notification
  updateNotificationSettings: async (settings: NotificationSettings): Promise<ProfileResponse> => {
    try {
      const response = await axiosClient.patch<ProfileResponse>('api/profile/notifications', {
        notification_settings: settings,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de notification:', error);
      throw error;
    }
  },

  // Mettre à jour uniquement les méthodes de paiement
  updatePaymentMethods: async (methods: PaymentMethod[]): Promise<ProfileResponse> => {
    try {
      const response = await axiosClient.patch<ProfileResponse>('api/profile/payment-methods', {
        payment_methods: methods,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des méthodes de paiement:', error);
      throw error;
    }
  },
}; 
