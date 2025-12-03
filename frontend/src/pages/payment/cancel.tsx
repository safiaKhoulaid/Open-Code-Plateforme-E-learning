import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentCancel() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-amber-50 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-10 h-10 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-amber-800">Paiement annulé</CardTitle>
          <p className="text-amber-700 mt-2">
            Votre commande n'a pas été traitée
          </p>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2">Vous avez annulé votre paiement</h3>
              <p className="text-gray-600 mb-6">
                Votre carte n'a pas été débitée et aucune commande n'a été passée.
                <br />
                Les articles de votre panier sont toujours disponibles.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button 
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
              <Button 
                onClick={() => navigate("/checkout")}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 flex items-center justify-center"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Retourner au panier
              </Button>
            </div>
            
            <div className="text-center mt-8 pt-6 border-t text-sm text-gray-500">
              <p>
                Si vous avez rencontré un problème lors du paiement ou si vous avez besoin d'aide,
                <br />
                veuillez contacter notre service client à <a href="mailto:support@example.com" className="text-orange-500 hover:underline">support@example.com</a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 