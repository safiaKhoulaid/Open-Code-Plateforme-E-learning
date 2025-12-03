import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import { X, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, fetchCart, removeFromCart, clearCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleCheckout = () => {
    // À implémenter: rediriger vers la page de paiement
    alert("Redirection vers la page de paiement");
  };

  if (items.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-8">Votre Panier</h1>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-medium mb-2">Votre panier est vide</h2>
          <p className="text-gray-500 mb-6">Parcourez nos cours et ajoutez-en à votre panier</p>
          <Button onClick={() => navigate("/courses")}>
            Voir les cours
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={() => navigate(-1)}
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Votre Panier</h1>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              {item.thumbnail && (
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
              )}
              <div>
                <h3 className="font-medium">{item.title}</h3>
                {item.instructor && (
                  <p className="text-sm text-gray-500">{item.instructor}</p>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-4">{item.price ? `${item.price} €` : "Gratuit"}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeFromCart(item.id)}
                aria-label="Supprimer"
              >
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 p-4 border rounded-lg bg-gray-50">
        <div className="flex justify-between">
          <span className="font-medium">Total</span>
          <span className="font-bold">{totalPrice} €</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={() => clearCart()} className="flex-1">
            Vider le panier
          </Button>
          <Button onClick={handleCheckout} className="flex-1 bg-[#ff9500] hover:bg-[#e68600]">
            Procéder au paiement
          </Button>
        </div>
      </div>
    </div>
  );
} 