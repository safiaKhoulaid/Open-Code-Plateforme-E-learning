import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  count?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function RatingDisplay({ 
  rating = 0, 
  count = 0, 
  showCount = true,
  size = "md" 
}: RatingDisplayProps) {
  const starSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSizes[size]} ${
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className={`ml-1 font-medium text-gray-700 ${textSizes[size]}`}>
        {rating.toFixed(1)}
      </span>
      {showCount && count > 0 && (
        <span className={`ml-1 text-gray-500 ${size === "lg" ? "text-sm" : "text-xs"}`}>
          ({count})
        </span>
      )}
    </div>
  );
} 