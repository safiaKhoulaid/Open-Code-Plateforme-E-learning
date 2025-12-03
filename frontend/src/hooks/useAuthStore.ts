import { create } from 'zustand';
import {User} from '@/hooks/useUsers'



interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));