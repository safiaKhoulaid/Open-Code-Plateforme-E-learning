import axios from '@/api/axios';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image?: string;
  course_id: number;
}

export interface CheckoutResponse {
  url: string;
  session_id: string;
}

export interface BillingAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export const cartService = {
  async fetchCart(): Promise<CartItem[]> {
    try {
      const response = await axios.get('/api/cart');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      throw error;
    }
  },

  async addToCart(course_id: number): Promise<CartItem[]> {
    try {
      console.log(course_id)
      const response = await axios.post('/api/cart/add', { course_id });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      throw error;
    }
  },

  async removeFromCart(course_id: number): Promise<CartItem[]> {
    try {
      const response = await axios.delete(`api/cart/remove`, { 
        data: { course_id } 
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      throw error;
    }
  },

  async clearCart(): Promise<CartItem[]> {
    try {
      const response = await axios.delete('/api/cart');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      throw error;
    }
  },
  
  async createCheckoutSession(
    successUrl: string, 
    cancelUrl: string, 
    billingAddress: BillingAddress,
    customerInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    },
    paymentMethod: string = 'card'
  ): Promise<CheckoutResponse> {
    try {
      const formattedBillingAddress = `${billingAddress.address}, ${billingAddress.zipCode} ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.country}`;
      
      // Récupérer les informations du panier
      let cart: CartItem[] = [];
      try {
        cart = await this.fetchCart();
        console.log("Panier récupéré:", cart);
      } catch (fetchError) {
        console.error("Erreur lors de la récupération du panier:", fetchError);
        cart = [];
      }
      
      // S'assurer que cart est un tableau avant d'utiliser map
      const filteredCart = Array.isArray(cart) ? cart.map(item => {
        // Si l'image est une chaîne vide, on la définit à null pour que Stripe ne la traite pas
        return {
          ...item,
          image: item.image && item.image.trim() !== '' ? item.image : null
        };
      }) : [];
      
      console.log("Panier filtré:", filteredCart);
      
      const response = await axios.post('/api/frontend/checkout', {
        success_url: successUrl,
        cancel_url: cancelUrl,
        billing_address: formattedBillingAddress,
        customer_info: {
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone
        },
        cart_items: filteredCart,
        payment_method: paymentMethod
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement:', error);
      throw error;
    }
  }
};