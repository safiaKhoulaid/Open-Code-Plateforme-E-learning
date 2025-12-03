import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import  axiosClient  from "../api/axios";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  reset: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (userData: User, token: string) => {
        console.log("Previous state:", get());
        // Set the token in axios default headers
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        set({
          isAuthenticated: true,
          user: userData,
          token: token,
        });
        console.log("Updated state:", get());
      },
      logout: async () => {
        try {
          const { token } = get();
          console.log("Token:", token);
          if (token) {
            // Utiliser l'endpoint correct avec /api
            await axiosClient.post("/api/logout", { token });
          }
          // Remove the token from axios headers
          delete axiosClient.defaults.headers.common["Authorization"];
          set({
            isAuthenticated: false,
            user: null,
            token: null,
          });
          // Clear storage manually
          window.localStorage.removeItem("auth-storage");
        } catch (error) {
          console.error("Logout failed:", error);
          // Même en cas d'erreur, on nettoie l'état local
          delete axiosClient.defaults.headers.common["Authorization"];
          set({
            isAuthenticated: false,
            user: null,
            token: null,
          });
          window.localStorage.removeItem("auth-storage");
          throw error;
        }
      },
      reset: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
        window.localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Restore axios headers if token exists
        if (state?.token) {
          axiosClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${state.token}`;
        }
        console.log("Hydrated state:", state);
      },
    }
  )
);
