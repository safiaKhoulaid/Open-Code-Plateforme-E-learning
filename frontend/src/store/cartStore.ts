import { create } from 'zustand';
import { cartService, BillingAddress } from '@/services/cartService';
import { CartItem } from '@/types/cartItem';
import { CartState } from '@/types/cart';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  loading: false,
  error: null,
  checkoutUrl: null,
  sessionId: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const items = await cartService.fetchCart();
      set({ items, total: calculateTotal(items), loading: false });
    } catch (error: any) {
      set({ error: error?.message || 'Erreur lors de la récupération du panier', loading: false });
    }
  },

  addToCart: async (courseId: number) => {
    set({ loading: true, error: null });
    try {
      const items = await cartService.addToCart(courseId);
      set({ items, total: calculateTotal(items), loading: false });
    } catch (error: any) {
      set({ error: error?.message || 'Erreur lors de l\'ajout au panier', loading: false });
    }
  },

  removeFromCart: async (itemId: number) => {
    set({ loading: true, error: null });
    try {
      const items = await cartService.removeFromCart(itemId);
      set({ items, total: calculateTotal(items), loading: false });
    } catch (error: any) {
      set({ error: error?.message || 'Erreur lors de la suppression de l\'élément du panier', loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await cartService.clearCart();
      set({ items: [], total: 0, loading: false });
    } catch (error: any) {
      set({ error: error?.message || 'Erreur lors du vidage du panier', loading: false });
    }
  },

  isInCart: (courseId: number) => {
    const { items } = get();
    return Array.isArray(items) && items.some(item => item.course_id === courseId);
  },
  
  checkout: async (
    successUrl: string, 
    cancelUrl: string, 
    billingAddress: BillingAddress,
    customerInfo: CustomerInfo,
    paymentMethod: string = 'card'
  ) => {
    set({ loading: true, error: null });
    try {
      const { url, session_id } = await cartService.createCheckoutSession(
        successUrl, 
        cancelUrl, 
        billingAddress,
        customerInfo,
        paymentMethod
      );
      set({ checkoutUrl: url, sessionId: session_id, loading: false });
      return url;
    } catch (error: any) {
      set({ error: error?.message || 'Erreur lors de la création de la session de paiement', loading: false });
      return null;
    }
  }
}));

const calculateTotal = (items: CartItem[]): number => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + item.price, 0);
}; 