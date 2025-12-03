import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const axiosClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Intercepteur pour ajouter le token d'authentification
axiosClient.interceptors.request.use(
    (config) => {
        const token = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les réponses
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("Erreur interceptée par axios:", error);
        return Promise.reject(error);
    }
);

export default axiosClient; 