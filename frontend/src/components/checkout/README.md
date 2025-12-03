# Stripe Checkout Integration

Ce dossier contient les composants nécessaires pour intégrer Stripe Checkout dans votre application React.

## Composants

### 1. StripeCheckout.tsx

Un composant réutilisable qui gère l'intégration avec Stripe Checkout. Il:
- Reçoit un `courseId` en prop
- Appelle l'API Laravel pour créer une session Stripe
- Redirige l'utilisateur vers la page de paiement Stripe

```tsx
import StripeCheckout from '@/components/checkout/StripeCheckout';

// Dans votre composant
<StripeCheckout courseId="course-123" />
```

### 2. SimpleCheckout.tsx

Un composant de page de paiement complet qui:
- Reçoit un `courseId` en prop
- Récupère les détails du cours depuis l'API
- Affiche un résumé du cours et du paiement
- Intègre le composant StripeCheckout pour le paiement

```tsx
import Checkout from '@/components/checkout/SimpleCheckout';

// Dans votre composant de route
<Checkout courseId="course-123" />
```

## Installation des dépendances

Pour utiliser ces composants, vous devez installer la dépendance Stripe:

```bash
npm install @stripe/stripe-js
```

## Configuration

1. Ajoutez votre clé publique Stripe dans votre fichier `.env`:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique
```

2. Assurez-vous que votre backend Laravel expose un endpoint `/api/stripe/checkout-session` qui:
   - Reçoit un `courseId`
   - Crée une session Stripe avec les détails du cours
   - Renvoie l'ID de session dans la réponse: `{ sessionId: "cs_test_..." }`

## Exemple d'utilisation avec React Router

```tsx
import { Routes, Route } from 'react-router-dom';
import Checkout from '@/components/checkout/SimpleCheckout';

function App() {
  return (
    <Routes>
      <Route path="/checkout/:courseId" element={<Checkout courseId={params.courseId} />} />
      {/* Autres routes */}
    </Routes>
  );
}
```

## Fonctionnement

1. L'utilisateur clique sur le bouton "Payer maintenant"
2. Le composant appelle l'API Laravel pour créer une session Stripe
3. L'utilisateur est redirigé vers la page de paiement Stripe
4. Après le paiement, Stripe redirige l'utilisateur vers l'URL de succès ou d'échec configurée dans votre backend

## Personnalisation

Vous pouvez personnaliser l'apparence du bouton de paiement en modifiant les props du composant Button dans StripeCheckout.tsx.