import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useEffect } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface CartButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

export function CartButton({ className, variant = "ghost" }: CartButtonProps) {
  const { items, fetchCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const itemCount = items.length;

  return (
    <Button
      variant={variant}
      size="icon"
      className={cn("relative", className)}
      onClick={() => navigate("/cart")}
      aria-label="Panier"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff9500] text-xs text-white">
          {itemCount}
        </span>
      )}
    </Button>
  );
} 