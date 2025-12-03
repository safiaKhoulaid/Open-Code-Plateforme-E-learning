export const storage = {
  // Récupérer les données d'authentification
  getAuthData: () => {
    const authData = localStorage.getItem('auth-storage');
    return authData ? JSON.parse(authData) : null;
  },

  // Récupérer le token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Récupérer l'ID de l'utilisateur
  getUserId: () => {
    return localStorage.getItem('userId');
  },

  // Sauvegarder les données d'authentification
  setAuthData: (data: any) => {
    localStorage.setItem('auth-storage', JSON.stringify(data));
  },

  // Sauvegarder le token
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  // Sauvegarder l'ID de l'utilisateur
  setUserId: (userId: string) => {
    localStorage.setItem('userId', userId);
  },

  // Supprimer toutes les données d'authentification
  clearAuthData: () => {
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
}; 