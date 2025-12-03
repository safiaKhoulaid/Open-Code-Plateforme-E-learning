import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useStudentDashboardData from "@/hooks/useDashboardStudentData";
import axiosClient from "@/api/axios";
import { useAuthStore } from "@/hooks/useAuthStore";

interface WishlistToggleProps {
  courseId: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

/**
 * WishlistToggle component
 * 
 * A reusable component that displays a heart icon that toggles a course in/out of the wishlist.
 * The heart is filled when the course is in the wishlist, and outlined when it's not.
 * 
 * @param courseId - The ID of the course to toggle in the wishlist
 * @param size - The size of the heart icon (sm, md, lg)
 * @param showTooltip - Whether to show a tooltip on hover
 * @param className - Additional CSS classes to apply to the button
 */
const WishlistToggle: React.FC<WishlistToggleProps> = ({
  courseId,
  size = "md",
  showTooltip = true,
  className,
}) => {
  const { isWishlisted, toggleWishlist, isLoading } = useWishlistStore();
  const { data: dashboardData } = useStudentDashboardData();
  
  // Vérifier si le cours est dans la wishlist du dashboard
  const isInDashboardWishlist = dashboardData?.wishlists?.some(
    (wishlist) => wishlist.course_id.toString() === courseId
  );
  
  const isInWishlist = isInDashboardWishlist || isWishlisted(courseId);
  const user_id = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user?.id;
  //on size based on the size prop
  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;
  
  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Appeler l'endpoint toggle de l'API
      const response = await axiosClient.post("/api/wishlist/toggle", {
        course_id: courseId,
        user_id : user_id,
        
      });
      
      // Mettre à jour l'état local
      toggleWishlist(courseId);
      
      // Rafraîchir les données du dashboard si nécessaire
      if (dashboardData) {
        // Vous pouvez ajouter ici une logique pour rafraîchir les données du dashboard
      }
    } catch (error) {
      console.error("Erreur lors de la modification de la wishlist:", error);
    }
  };
  
  const button = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full hover:bg-gray-100 transition-colors",
        isInWishlist ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-700",
        className
      )}
      onClick={handleToggle}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          "transition-all",
          isInWishlist ? "fill-current" : ""
        )}
        size={iconSize}
      />
    </Button>
  );
  
  if (!showTooltip) {
    return button;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent>
          {isInWishlist ? "Retirer de la liste de souhaits" : "Ajouter à la liste de souhaits"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WishlistToggle;