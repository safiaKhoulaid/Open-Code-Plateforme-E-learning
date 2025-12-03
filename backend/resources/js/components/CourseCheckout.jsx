import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Charger Stripe
const stripePromise = loadStripe(process.env.MIX_STRIPE_KEY);

const CheckoutForm = ({ courseId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [course, setCourse] = useState(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // Créer l'intention de paiement lorsque le composant est monté
    const fetchPaymentIntent = async () => {
      try {
        const response = await axios.post('/api/payments/create-intent', {
          course_id: courseId
        });
        
        setClientSecret(response.data.clientSecret);
        setCourse(response.data.course);
        setAmount(response.data.amount);
      } catch (error) {
        setError('Impossible de préparer le paiement. Veuillez réessayer.');
        console.error('Error fetching payment intent:', error);
      }
    };
    
    fetchPaymentIntent();
  }, [courseId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Confirmer le paiement avec Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Client Name', // Idéalement récupéré du formulaire ou du compte utilisateur
        },
      }
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    // Paiement confirmé côté Stripe, informer le backend
    try {
      await axios.post('/api/payments/confirm', {
        payment_intent_id: paymentIntent.id,
        course_id: courseId
      });
      
      // Rediriger vers une page de succès ou afficher un message
      window.location.href = `/courses/${courseId}/success`;
    } catch (error) {
      setError('Le paiement a été traité, mais une erreur est survenue. Veuillez contacter le support.');
      console.error('Error confirming payment:', error);
    }
    
    setLoading(false);
  };

  if (!course) {
    return <div>Chargement des informations de paiement...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="course-summary">
        <h2>{course.title}</h2>
        <p>{course.subtitle}</p>
        <div className="price">
          {course.discount ? (
            <>
              <span className="original-price">{course.price} €</span>
              <span className="discount-price">{amount} €</span>
            </>
          ) : (
            <span>{amount} €</span>
          )}
        </div>
      </div>

      <div className="card-container">
        <label>
          Informations de carte bancaire
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </label>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="payment-button"
      >
        {loading ? 'Traitement...' : `Payer ${amount} €`}
      </button>
    </form>
  );
};

// Le composant enveloppé avec les éléments de Stripe
const CourseCheckout = ({ courseId }) => {
  return (
    <div className="checkout-container">
      <Elements stripe={stripePromise}>
        <CheckoutForm courseId={courseId} />
      </Elements>
    </div>
  );
};

export default CourseCheckout;
