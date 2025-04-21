/**
 * Stripe integration for course purchases
 *
 * This file provides functions to interact with the Stripe API for course purchases.
 * It can be imported in any frontend component that needs to handle course purchases.
 */

/**
 * Create a Stripe checkout session for a course purchase
 *
 * @param {number} courseId - The ID of the course to purchase
 * @returns {Promise} - A promise that resolves to the Stripe checkout session
 */
export const createCheckoutSession = async (courseId) => {
    try {
        const response = await fetch(`/api/courses/${courseId}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
            },
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
        throw error;
    }
};

/**
 * Redirect to Stripe Checkout
 *
 * @param {number} courseId - The ID of the course to purchase
 */
export const redirectToCheckout = async (courseId) => {
    try {
        const { url } = await createCheckoutSession(courseId);
        window.location.href = url;
    } catch (error) {
        console.error('Error redirecting to checkout:', error);
        alert(error.message || 'Une erreur est survenue. Veuillez réessayer plus tard.');
    }
};

/**
 * Check if a user is enrolled in a course
 *
 * @param {number} courseId - The ID of the course to check
 * @returns {Promise<boolean>} - A promise that resolves to true if the user is enrolled, false otherwise
 */
export const isEnrolledInCourse = async (courseId) => {
    try {
        const response = await fetch(`/api/courses/${courseId}`, {
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

        const data = await response.json();

        // This assumes the API returns a field indicating if the user is enrolled
        // Adjust this logic based on your actual API response structure
        return data.isEnrolled || false;
    } catch (error) {
        console.error('Error checking enrollment:', error);
        return false;
    }
};
