import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`/api/courses/${courseId}`);
        setCourse(response.data.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="payment-success">
      <div className="success-icon">
        <i className="fas fa-check-circle"></i>
      </div>
      
      <h1>Paiement réussi !</h1>
      
      <div className="course-info">
        <h2>{course?.title}</h2>
        <p>{course?.subtitle}</p>
      </div>
      
      <div className="next-steps">
        <h3>Prochaines étapes</h3>
        <p>Vous avez maintenant accès au contenu complet de ce cours.</p>
      </div>
      
      <div className="action-buttons">
        <Link to={`/courses/${courseId}/learn`} className="primary-button">
          Commencer à apprendre
        </Link>
        <Link to="/dashboard" className="secondary-button">
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
