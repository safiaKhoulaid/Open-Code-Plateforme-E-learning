import { useState, useEffect } from 'react';
import { courseService } from '@/services/courseService';

interface EnrolledStudent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  enrollment_date: string;
  progress: number;
}

interface ApiResponse {
  courses: any[];
  student: EnrolledStudent[];
}

export const useEnrolledStudents = (courseId: string) => {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        setLoading(true);
        const response = await courseService.getEnrolledStudents(courseId);
        setStudents(response.student);
        setError(null);
      } catch (err) {
        setError('Erreur lors de la récupération des étudiants');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledStudents();
  }, [courseId]);

  return { students, loading, error };
}; 