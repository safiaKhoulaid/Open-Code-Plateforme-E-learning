import { CartItem } from './cartItem';
import { BillingAddress } from '@/services/cartService';
import { CustomerInfo } from '@/store/cartStore';

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CartState extends Cart {
  loading: boolean;
  error: string | null;
  checkoutUrl: string | null;
  sessionId: string | null;
  count: number;
  fetchCart: () => Promise<void>;
  addToCart: (courseId: number) => Promise<void>;
  removeFromCart: (courseId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (courseId: number) => boolean;
  checkout: (
    successUrl: string, 
    cancelUrl: string, 
    billingAddress: BillingAddress,
    customerInfo: CustomerInfo,
    paymentMethod?: string
  ) => Promise<string | null>;
} 