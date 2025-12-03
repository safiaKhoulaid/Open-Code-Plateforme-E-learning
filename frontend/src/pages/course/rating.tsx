import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import axios from '@/api/axios';

interface Rating {
  id: number;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

interface RatingListProps {
  courseId: number;
}

export function RatingList({ courseId }: RatingListProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`/api/courses/${courseId}/ratings`);
      setRatings(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des avis');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [courseId]);

  if (loading) return <div className="text-center py-8">Chargement des avis...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="space-y-6">
      {ratings.map((rating) => (
        <div key={rating.id} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= rating.rating
                      ? 'fill-[#ff9500] text-[#ff9500]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              par {rating.userName}
            </span>
          </div>
          <p className="text-gray-700 mb-2">{rating.comment}</p>
          <p className="text-sm text-gray-500">
            {new Date(rating.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
