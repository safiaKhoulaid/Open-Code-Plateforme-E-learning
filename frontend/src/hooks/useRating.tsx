// src/components/course/RatingForm.tsx
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';
import { Rating } from '@/types/rating';

interface RatingFormProps {
  courseId: number;
  onRatingAdded: () => void;
}

interface RatingsResponse {
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

export function RatingForm({ courseId, onRatingAdded }: RatingFormProps): JSX.Element {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Veuillez donner une note');
      return;
    }

    try {
      const response = await axios.post('/api/ratings', {
        courseId,
        rating,
        comment,
      });
      
      if (response.status === 201) {
        setRating(0);
        setComment('');
        setError('');
        onRatingAdded();
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi de votre avis');
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Donnez votre avis sur ce cours</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star: number) => (
            <button
              key={star}
              type="button"
              className="p-1"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoverRating || rating)
                    ? 'fill-[#ff9500] text-[#ff9500]'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <textarea
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          placeholder="Partagez votre expérience avec ce cours..."
          className="w-full p-3 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff9500]"
          rows={4}
        />
        <button
          type="submit"
          className="bg-[#ff9500] text-white px-6 py-2 rounded-md hover:bg-[#ff9500]/90 transition-colors"
        >
          Envoyer mon avis
        </button>
      </form>
    </div>
  );
}

export function useRatings(courseId: number, refreshTrigger = 0) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalRatings, setTotalRatings] = useState<number>(0);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        const response = await axios.get<RatingsResponse>(`/api/courses/${courseId}/ratings`);
        setRatings(response.data.data);
        setTotalRatings(response.data.total);
        
        if (response.data.data.length > 0) {
          const sum = response.data.data.reduce((acc, rating) => acc + rating.rating, 0);
          setAverageRating(sum / response.data.data.length);
        } else {
          setAverageRating(null);
        }
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des avis:', err);
        setError('Impossible de charger les avis pour ce cours');
        setRatings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [courseId, refreshTrigger]);

  return {
    ratings,
    loading,
    error,
    averageRating,
    totalRatings,
  };
}

export function RatingStars({ rating }: { rating: number }): JSX.Element {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star: number) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            Number(star) <= Math.round(rating)
              ? 'fill-[#ff9500] text-[#ff9500]'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}