import { useState, useEffect } from 'react';
import  axiosClient  from '@/api/axios';

export interface User {
  id: number;
  firstName: string;
  lastName : string;
  email: string;
  email_verified_at : string;
  role: string;
  lastLogin : string ; 
  created_at: string;
  updated_at : string ;
  status: string;
  is_approved : boolean ;
  is_banned: boolean;
  ban_reason: string | null;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosClient.get('/api/users');
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
console.log(users)
  return { users, loading, error };
}; 