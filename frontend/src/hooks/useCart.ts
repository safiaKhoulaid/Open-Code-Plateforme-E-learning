import { useEffect } from 'react';
import { useCartStore } from './useCartStore';

export const useCart = () => {
  const { 
    items, 
    isLoading, 
    error, 
    fetchCart, 
    addToCart, 
    removeFromCart, 
    clearCart 
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart: items,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount: items.length,
    cartTotal: items.reduce((sum, course) => sum + (course.price || 0), 0)
  };
}; 