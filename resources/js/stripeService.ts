import { AxiosError } from 'axios';

/**
 * Interface for Stripe checkout session response
 */
interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

/**
 * Interface for course enrollment verification response
 */
interface EnrollmentResponse {
  isEnrolled: boolean;
}

/**
 * Create a Stripe checkout session for a course purchase
 *
 * @param courseId - The ID of the course to purchase
 * @returns Promise with the checkout session data
 */
export const createCheckoutSession = async (courseId: number): Promise<CheckoutSessionResponse> => {
  try {
    const response = await fetch(`/api/stripe/checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify({ courseId }),
      credentials: 'same-origin',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Une erreur est survenue lors de la création de la session de paiement.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error instanceof Error ? error : new Error('Une erreur inconnue est survenue');
  }
};

/**
 * Redirect to Stripe Checkout
 *
 * @param courseId - The ID of the course to purchase
 */
export const redirectToCheckout = async (courseId: number): Promise<void> => {
  try {
    const { url } = await createCheckoutSession(courseId);
    window.location.href = url;
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    alert(error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer plus tard.');
  }
};

/**
 * Verify a successful payment and complete course enrollment
 *
 * @param sessionId - The Stripe session ID to verify
 * @returns Promise indicating success or failure
 */
export const verifyPayment = async (sessionId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/stripe/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      body: JSON.stringify({ sessionId }),
      credentials: 'same-origin',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Une erreur est survenue lors de la vérification du paiement.');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error instanceof Error ? error : new Error('Une erreur inconnue est survenue');
  }
};

/**
 * Check if a user is enrolled in a course
 *
 * @param courseId - The ID of the course to check
 * @returns Promise with enrollment status
 */
export const isEnrolledInCourse = async (courseId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/courses/${courseId}/enrollment-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'same-origin',
    });

    if (!response.ok) {
      throw new Error('Une erreur est survenue lors de la vérification de l\'inscription.');
    }

    const data: EnrollmentResponse = await response.json();
    return data.isEnrolled;
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return false;
  }
};
