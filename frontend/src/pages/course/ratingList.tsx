import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import axios from '@/api/axios';
import { Rating } from '@/types/rating';

interface RatingListProps {
  courseId: number;
  refresh?: number;
}

interface ApiResponse {
  current_page: number;
  data: Rating[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export function RatingList({ courseId, refresh = 0 }: RatingListProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRatings = async () => {
    try {
      const response = await axios.get<ApiResponse>(`/api/courses/${courseId}/ratings`);
      console.log('Réponse API:', response.data);
      setRatings(response.data.data);
    } catch (error) {
      setError('Erreur lors du chargement des avis');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [courseId, refresh]);

  if (loading) return (
    <div className="text-center py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center py-8">
      {error}
    </div>
  );

  if (ratings.length === 0) return (
    <div className="text-center py-8 text-gray-500">
      Aucun avis pour le moment. Soyez le premier à donner votre avis !
    </div>
  );
console.log("ratings",ratings)
ratings.forEach(rating => {
  console.log("rating",rating.user.firstName)
})
  return (
    <div className="space-y-6">
      {ratings.map((rating) => (
        <div key={rating.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= rating.stars
                      ? 'fill-[#ff9500] text-[#ff9500]'
                      : 'text-gray-300'
                  }`}
                  fill={star <= rating.rating ? '#ff9500' : 'none'}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              par {rating.user.firstName} {rating.user.lastName}
            </span>
          </div>
          <p className="text-gray-700 mb-2">{rating.comment}</p>
          <p className="text-sm text-gray-500">
            {new Date(rating.created_at).toLocaleDateString('fr-FR', {
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
