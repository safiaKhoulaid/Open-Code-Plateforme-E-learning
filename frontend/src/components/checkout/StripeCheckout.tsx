import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axiosClient from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Initialize Stripe with your publishable key
// In a real app, you would store this in an environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key');

interface StripeCheckoutProps {
  courseId: string;
}

/**
 * Function to create a Stripe Checkout session
 * @param courseId - The ID of the course to purchase
 * @returns The Stripe session ID
 */
export const createCheckoutSession = async (courseId: string): Promise<string> => {
  try {
    const response = await axiosClient.post('/api/stripe/checkout-session', {
      courseId,
    });
    
    return response.data.sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
};

/**
 * Stripe Checkout component
 * @param courseId - The ID of the course to purchase
 */
export default function StripeCheckout({ courseId }: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the Stripe instance
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Create a checkout session
      const sessionId = await createCheckoutSession(courseId);
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button 
        onClick={handlePayment} 
        disabled={isLoading}
        className="w-full bg-orange-500 hover:bg-orange-600"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          'Payer maintenant'
        )}
      </Button>
    </div>
  );
}