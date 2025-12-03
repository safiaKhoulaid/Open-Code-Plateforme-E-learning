import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '@/services/cartService';
import { Course } from '@/types/course';

interface CartState {
  items: Course[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (courseId: string | number) => Promise<void>;
  removeFromCart: (courseId: string | number) => Promise<void>;
  clearCart: () => Promise<void>;
  setItems: (items: Course[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      fetchCart: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await cartService.getCart();
          
          if (response && response.cart && Array.isArray(response.cart)) {
            set({ items: response.cart, isLoading: false });
          } else {
            set({ items: [], isLoading: false });
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du panier:', error);
          set({ 
            error: "Impossible de récupérer le panier", 
            isLoading: false 
          });
        }
      },
      
      addToCart: async (courseId) => {
        try {
          set({ isLoading: true, error: null });
          await cartService.addToCart(courseId);
          
          // Récupérer le panier mis à jour
          await get().fetchCart();
        } catch (error) {
          console.error('Erreur lors de l\'ajout au panier:', error);
          set({ 
            error: "Impossible d'ajouter le cours au panier", 
            isLoading: false 
          });
        }
      },
      
      removeFromCart: async (courseId) => {
        try {
          set({ isLoading: true, error: null });
          await cartService.removeFromCart(courseId);
          
          // Récupérer le panier mis à jour
          await get().fetchCart();
        } catch (error) {
          console.error('Erreur lors de la suppression du panier:', error);
          set({ 
            error: "Impossible de supprimer le cours du panier", 
            isLoading: false 
          });
        }
      },
      
      clearCart: async () => {
        try {
          set({ isLoading: true, error: null });
          await cartService.clearCart();
          set({ items: [], isLoading: false });
        } catch (error) {
          console.error('Erreur lors du vidage du panier:', error);
          set({ 
            error: "Impossible de vider le panier", 
            isLoading: false 
          });
        }
      },
      
      setItems: (items) => {
        set({ items });
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
); 