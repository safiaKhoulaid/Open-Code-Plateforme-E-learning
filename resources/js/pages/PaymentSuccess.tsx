import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyPayment } from '../stripeService';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Vérification de votre paiement...');
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const courseIdParam = searchParams.get('courseId');

    if (courseIdParam) {
      setCourseId(courseIdParam);
    }

    if (!sessionId) {
      setStatus('error');
      setMessage('Session de paiement non trouvée. Veuillez contacter le support.');
      return;
    }

    const verifyAndEnroll = async () => {
      try {
        const success = await verifyPayment(sessionId);

        if (success) {
          setStatus('success');
          setMessage('Paiement confirmé ! Vous êtes maintenant inscrit au cours.');
        } else {
          setStatus('error');
          setMessage('Nous n\'avons pas pu confirmer votre paiement. Veuillez contacter le support.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la vérification du paiement.');
      }
    };

    verifyAndEnroll();
  }, [searchParams]);

  const handleContinue = () => {
    if (courseId) {
      navigate(`/courses/${courseId}/learn`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoBack = () => {
    if (courseId) {
      navigate(`/courses/${courseId}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Traitement en cours</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Paiement réussi !</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mb-3"
            >
              Accéder au cours
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Aller au tableau de bord
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Problème de paiement</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={handleGoBack}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mb-3"
            >
              Retour
            </button>
            <button
              onClick={() => window.location.href = '/contact'}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Contacter le support
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
