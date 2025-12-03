import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "@/api/axios";
import { useWishlistStore } from "@/hooks/useWishlistStore";

export default function PaymentSuccess() {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { removeFromWishlist } = useWishlistStore();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Extraire l'ID de session Stripe de l'URL
        const params = new URLSearchParams(location.search);
        const sessionId = params.get("session_id");
        
        if (sessionId) {
          // Récupérer les détails de la commande à partir de l'API
          const response = await axios.get(`/api/payment/verify?session_id=${sessionId}`);
          setOrderDetails(response.data);
          
          // Si la commande contient des cours, les supprimer de la wishlist
          if (response.data.courses && Array.isArray(response.data.courses)) {
            response.data.courses.forEach(async (course: any) => {
              try {
                await removeFromWishlist(course.id.toString());
              } catch (error) {
                console.error("Erreur lors de la suppression du cours de la wishlist:", error);
              }
            });
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la commande:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [location, removeFromWishlist]);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-500">
            Paiement réussi !
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Chargement des détails de la commande...</div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Merci pour votre achat !</h3>
                <p className="text-gray-600">
                  Vous recevrez un email de confirmation contenant tous les détails de votre commande.
                </p>
              </div>
              
              {orderDetails && (
                <div className="border-t border-b py-4">
                  <p className="text-gray-800 mb-1">
                    <span className="font-medium">N° de commande:</span> {orderDetails.order_number}
                  </p>
                  <p className="text-gray-800 mb-1">
                    <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Total:</span> {orderDetails.amount} €
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button 
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Retour à l'accueil
                </Button>
                <Button 
                  onClick={() => navigate("/course-explore")}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
                >
                  Accéder à mes cours
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 