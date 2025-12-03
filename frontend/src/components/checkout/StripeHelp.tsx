import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, Download, Copy } from "lucide-react";

export function StripeHelp() {
  const [copied, setCopied] = useState(false);

  const stripeDomains = [
    "js.stripe.com",
    "api.stripe.com",
    "checkout.stripe.com",
    "hooks.stripe.com",
    "m.stripe.com",
    "m.stripe.network",
    "q.stripe.com",
    "r.stripe.com",
    "b.stripecdn.com",
  ];

  const handleCopyDomains = () => {
    navigator.clipboard.writeText(stripeDomains.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([stripeDomains.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "stripe-domains.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-1">
          <InfoIcon className="h-4 w-4 mr-1" /> Aide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Problèmes avec le système de paiement Stripe</DialogTitle>
          <DialogDescription>
            Si vous rencontrez des difficultés lors du paiement, votre bloqueur de publicités pourrait être en cause.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="ublock">uBlock Origin</TabsTrigger>
            <TabsTrigger value="adblock">AdBlock Plus</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            <h3 className="font-medium">Comment résoudre les problèmes</h3>
            <p className="text-sm text-gray-600">
              Pour que le système de paiement Stripe fonctionne correctement, vous devez autoriser les domaines Stripe 
              dans votre bloqueur de publicités.
            </p>
            <div className="border p-3 rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">Domaines à autoriser</span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs flex items-center"
                    onClick={handleCopyDomains}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {copied ? "Copié!" : "Copier"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs flex items-center"
                    onClick={handleDownloadTxt}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Télécharger
                  </Button>
                </div>
              </div>
              <div className="bg-white p-2 rounded border text-xs font-mono overflow-auto max-h-28">
                {stripeDomains.map((domain) => (
                  <div key={domain}>{domain}</div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ublock" className="space-y-4 mt-4">
            <h3 className="font-medium">uBlock Origin</h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
              <li>Cliquez sur l'icône uBlock Origin dans votre navigateur</li>
              <li>Cliquez sur l'icône d'engrenage (paramètres)</li>
              <li>Allez dans l'onglet "Listes de filtres"</li>
              <li>Allez en bas dans la section "Mes filtres"</li>
              <li>Pour chaque domaine Stripe, ajoutez une ligne : <code className="bg-gray-100 p-1 rounded">@@||domain.com^$document</code></li>
              <li>Cliquez sur "Appliquer les modifications"</li>
              <li>Rafraîchissez la page</li>
            </ol>
          </TabsContent>
          
          <TabsContent value="adblock" className="space-y-4 mt-4">
            <h3 className="font-medium">AdBlock Plus</h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
              <li>Cliquez sur l'icône AdBlock Plus dans votre navigateur</li>
              <li>Cliquez sur "Options" ou "Paramètres"</li>
              <li>Allez à "Éléments autorisés"</li>
              <li>Ajoutez chaque domaine Stripe dans le champ et cliquez sur "Ajouter"</li>
              <li>Rafraîchissez la page</li>
            </ol>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-start">
          <DialogTrigger asChild>
            <Button type="button" variant="secondary">
              Fermer
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 