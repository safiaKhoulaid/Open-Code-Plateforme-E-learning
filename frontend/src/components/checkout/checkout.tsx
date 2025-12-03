import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { Avatar } from "@/components/ui/avatar";

// Icônes - gardez la même importation depuis lucide-react
import {
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Check,
  Shield,
  Lock,
  Info,
  X,
  Calendar,
  User,
  MapPin,
  ShoppingCart,
  CheckCircle2,
  Loader2,
  Download,
  ArrowRight,
  Mail,
  Clock,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StripeHelp } from "./StripeHelp";
import {getFullImageUrl} from "@/pages/course/courseExplore.tsx"
// Types (gardez les mêmes)
type Course = {
  id: string;
  title: string;
  instructor: string;
  price: number;
  originalPrice: number;
  image: string;
  duration: string;
  level: string;
  discount?: number;
  bestseller?: boolean;
  rating?: number;
  reviews?: number;
};

// Type pour les éléments du panier depuis l'API
interface CartItem {
  id: number;
  user_id: number;
  course_id: number;
  quantity: number;
  price: string;
  created_at: string;
  updated_at: string;
  course: {
    id: number;
    title: string;
    subtitle: string | null;
    description: string;
    slug: string;
    instructor_id: number;
    level: string;
    language: string;
    image_url: string;
    video_url: string | null;
    price: string;
    discount: string;
    published_date: string | null;
    last_updated: string | null;
    status: string;
    requirements: string | null;
    what_you_will_learn: string | null;
    target_audience: string | null;
    average_rating: string;
    total_reviews: number;
    total_students: number;
    has_certificate: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface CartResponse {
  items: CartItem[];
  total: number;
  count: number;
}

type CheckoutFormData = {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    sameAsShipping: boolean;
  };
  paymentMethod: "creditCard" | "paypal" | "applePay" | "googlePay";
  creditCard?: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
  };
  promoCode: string;
  giftOption: boolean;
  receiveNewsletter: boolean;
  acceptTerms: boolean;
};

// Checkout steps
const STEPS = {
  CART_SUMMARY: 0,
  PERSONAL_INFO: 1,
  BILLING_INFO: 2,
  PAYMENT: 3,
  REVIEW: 4,
  SUCCESS: 5,
}

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(STEPS.CART_SUMMARY)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const { items: cartStore, fetchCart, removeFromCart, checkout } = useCartStore();
  const [orderNumber, setOrderNumber] = useState("")
  const [orderDate, setOrderDate] = useState("")
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Extraction des éléments du panier lors du chargement
  useEffect(() => {
    fetchCart().then(() => {
      const items = cartStore?.items || [];
      if (Array.isArray(items)) {
        setCartItems(items)
      }
    })
  }, [fetchCart, cartStore])

  const [formData, setFormData] = useState<CheckoutFormData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    billingAddress: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "France",
      sameAsShipping: true,
    },
    paymentMethod: "creditCard",
    creditCard: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
    promoCode: "",
    giftOption: false,
    receiveNewsletter: true,
    acceptTerms: false,
  })
  
  // Utilisation de cartItems au lieu de items directement
  console.log("items ======", cartItems)

  // Cours recommandés (données fictives)
  const recommendedCourses = [
    {
      id: 1,
      title: "Introduction à React",
      instructor: "John Doe",
      price: 49.99,
      originalPrice: 99.99,
      image: "/placeholder.svg",
      duration: "10h",
      level: "Débutant",
      rating: 4.8,
      reviews: 123
    },
    {
      id: 2,
      title: "JavaScript Avancé",
      instructor: "Jane Smith",
      price: 59.99,
      originalPrice: 129.99,
      image: "/placeholder.svg",
      duration: "15h",
      level: "Intermédiaire",
      rating: 4.6,
      reviews: 98
    }
  ];

  // Generate order details when reaching success page
  useEffect(() => {
    if (currentStep === STEPS.SUCCESS) {
      // Generate random order number
      const randomOrderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000)
      setOrderNumber(randomOrderNumber)

      // Set current date
      const now = new Date()
      const formattedDate = now.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      setOrderDate(formattedDate)
    }
  }, [currentStep])

  // Calculate totals
  const subtotal = cartItems.reduce((acc: number, item: CartItem) => acc + (parseFloat(item.price) || 0), 0);
  const originalTotal = subtotal; // Simplification pour éviter les erreurs
  const savings = originalTotal - subtotal
  const savingsPercentage = Math.round((savings / originalTotal) * 100) || 0
  const total = promoApplied ? subtotal - promoDiscount : subtotal

  // Handle promo code application
  const handleApplyPromo = () => {
    setIsLoading(true)
    setError(null)

    // Simulate API call
    setTimeout(() => {
      if (promoCode.toUpperCase() === "WELCOME15") {
        const discount = subtotal * 0.15
        setPromoDiscount(discount)
        setPromoApplied(true)
        setError(null)
      } else if (promoCode.toUpperCase() === "NEWUSER20") {
        const discount = subtotal * 0.2
        setPromoDiscount(discount)
        setPromoApplied(true)
        setError(null)
      } else {
        setError("Code promo invalide. Veuillez réessayer.")
        setPromoApplied(false)
        setPromoDiscount(0)
      }
      setIsLoading(false)
    }, 1000)
  }

  // Handle form input changes
  const handleInputChange = (section: keyof CheckoutFormData | "", field: string, value: unknown) => {
    if (section === "personalInfo" || section === "billingAddress") {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section as keyof CheckoutFormData],
          [field]: value,
        },
      })
    } else if (section === "creditCard") {
      setFormData({
        ...formData,
        creditCard: {
          ...formData.creditCard!,
          [field]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [field]: value,
      })
    }
  }

  // Handle payment method change
  const handlePaymentMethodChange = (value: "creditCard" | "paypal" | "applePay" | "googlePay") => {
    setFormData({
      ...formData,
      paymentMethod: value,
    })
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Définir les URLs de retour après paiement
      const successUrl = `${window.location.origin}/payment/success`;
      const cancelUrl = `${window.location.origin}/payment/cancel`;
      
      // Préparation des données d'adresse de facturation
      const billingAddress = {
        address: formData.billingAddress.address,
        city: formData.billingAddress.city,
        state: formData.billingAddress.state,
        zipCode: formData.billingAddress.zipCode,
        country: formData.billingAddress.country
      };
      
      // Préparation des informations du client
      const customerInfo = {
        firstName: formData.personalInfo.firstName,
        lastName: formData.personalInfo.lastName,
        email: formData.personalInfo.email,
        phone: formData.personalInfo.phone
      };
      
      // Appeler l'API de checkout via le store avec la méthode de paiement
      const checkoutUrl = await checkout(
        successUrl,
        cancelUrl,
        billingAddress,
        customerInfo,
        formData.paymentMethod // Ajout de la méthode de paiement
      );
      
      if (checkoutUrl) {
        // Rediriger vers la page de paiement Stripe
        window.location.href = checkoutUrl;
      } else {
        setError("Une erreur est survenue lors de la création de la session de paiement");
        setIsLoading(false);
      }
    } catch (err: unknown) {
      console.error("Erreur de paiement:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors du traitement de votre paiement";
      setError(errorMessage);
      setIsLoading(false);
    }
  }

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < STEPS.REVIEW) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      handleSubmit()
    }
  }

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > STEPS.CART_SUMMARY) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    } else {
      // Utilisation de window.location au lieu de router
      window.location.href = "/cart"
    }
  }

  // Format credit card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  // Validate form based on current step
  const isStepValid = () => {
    switch (currentStep) {
      case STEPS.CART_SUMMARY:
        return cartItems.length > 0
      case STEPS.PERSONAL_INFO:
        const { firstName, lastName, email, phone } = formData.personalInfo
        return (
          firstName.trim() !== "" &&
          lastName.trim() !== "" &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
          phone.trim() !== ""
        )
      case STEPS.BILLING_INFO:
        const { address, city, state, zipCode } = formData.billingAddress
        return address.trim() !== "" && city.trim() !== "" && state.trim() !== "" && zipCode.trim() !== ""
      case STEPS.PAYMENT:
        if (formData.paymentMethod === "creditCard") {
          const { cardNumber, cardName, expiryDate, cvv } = formData.creditCard!
          return (
            cardNumber.replace(/\s/g, "").length >= 16 &&
            cardName.trim() !== "" &&
            expiryDate.length === 5 &&
            cvv.length >= 3
          )
        }
        return true
      case STEPS.REVIEW:
        return formData.acceptTerms
      default:
        return false
    }
  }

  // Render cart summary
  const renderCartSummary = () => {
    if (cartItems.length === 0) {
      return (
        <div className="py-8 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">Votre panier est vide</h3>
          <p className="text-gray-600 mb-4">Vous n'avez pas encore ajouté de cours à votre panier.</p>
          <Button onClick={() => window.location.href = "/cart"} className="bg-orange-500 hover:bg-orange-600">
            Explorer les cours
          </Button>
        </div>
      )
    }

    return cartItems.map((item: CartItem) => (
      <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4 border-b">
        <div className="flex-shrink-0">
          <img
            src={getFullImageUrl(item?.course?.image_url) || "/placeholder.svg"}
            alt={item.course?.title}
            className="w-32 h-24 object-cover rounded-md"
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-medium text-lg">{item.course?.title}</h3>
          <p className="text-gray-600 text-sm">Cours #{item.course_id}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{item.course?.level}</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{item.course?.language}</span>
            {item.course?.average_rating && (
              <span className="text-xs bg-yellow-100 px-2 py-1 rounded-full flex items-center">
                <svg className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                {item.course.average_rating}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          <div className="text-right">
            <p className="font-bold text-lg">{parseFloat(item.price).toFixed(2)} €</p>
            {item.course?.discount !== "0.00" && (
              <p className="text-gray-500 line-through text-sm">{parseFloat(item.course?.price).toFixed(2)} €</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2"
            onClick={() => removeFromCart(item.course_id)}
          >
            <X className="w-4 h-4 mr-1" /> Supprimer
          </Button>
        </div>
      </div>
    ))
  }

  // Render checkout process (steps 0-4)
  const renderCheckoutProcess = () => {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Finaliser votre commande</h1>
          <p className="text-center text-gray-600 mb-6">Plus qu'une étape avant d'accéder à vos cours</p>

          {/* Progress bar */}
          <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${(currentStep + 1) * 20}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <div
                className={cn(
                  "flex flex-col items-center",
                  currentStep >= STEPS.CART_SUMMARY ? "text-orange-500 font-medium" : "",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                    currentStep >= STEPS.CART_SUMMARY ? "bg-orange-500 text-white" : "bg-gray-200",
                  )}
                >
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <span className="hidden sm:block">Panier</span>
              </div>
              <div
                className={cn(
                  "flex flex-col items-center",
                  currentStep >= STEPS.PERSONAL_INFO ? "text-orange-500 font-medium" : "",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                    currentStep >= STEPS.PERSONAL_INFO ? "bg-orange-500 text-white" : "bg-gray-200",
                  )}
                >
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:block">Informations</span>
              </div>
              <div
                className={cn(
                  "flex flex-col items-center",
                  currentStep >= STEPS.BILLING_INFO ? "text-orange-500 font-medium" : "",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                    currentStep >= STEPS.BILLING_INFO ? "bg-orange-500 text-white" : "bg-gray-200",
                  )}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="hidden sm:block">Adresse</span>
              </div>
              <div
                className={cn(
                  "flex flex-col items-center",
                  currentStep >= STEPS.PAYMENT ? "text-orange-500 font-medium" : "",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                    currentStep >= STEPS.PAYMENT ? "bg-orange-500 text-white" : "bg-gray-200",
                  )}
                >
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="hidden sm:block">Paiement</span>
              </div>
              <div
                className={cn(
                  "flex flex-col items-center",
                  currentStep >= STEPS.REVIEW ? "text-orange-500 font-medium" : "",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                    currentStep >= STEPS.REVIEW ? "bg-orange-500 text-white" : "bg-gray-200",
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="hidden sm:block">Confirmation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6">
                {/* Step 1: Cart Summary */}
                {currentStep === STEPS.CART_SUMMARY && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Votre panier ({cartItems.length} cours)</h2>

                    {renderCartSummary()}
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === STEPS.PERSONAL_INFO && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input
                          id="firstName"
                          value={formData.personalInfo.firstName}
                          onChange={(e) => handleInputChange("personalInfo", "firstName", e.target.value)}
                          placeholder="Votre prénom"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                          id="lastName"
                          value={formData.personalInfo.lastName}
                          onChange={(e) => handleInputChange("personalInfo", "lastName", e.target.value)}
                          placeholder="Votre nom"
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.personalInfo.email}
                        onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                        placeholder="votre.email@exemple.com"
                        className="mt-1"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Nous utiliserons cette adresse pour vous envoyer votre confirmation d'achat et vos accès aux
                        cours.
                      </p>
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.personalInfo.phone}
                        onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                        placeholder="Votre numéro de téléphone"
                        className="mt-1"
                        required
                      />
                    </div>

                    <div className="flex items-center mt-6">
                      <Checkbox
                        id="receiveNewsletter"
                        checked={formData.receiveNewsletter}
                        onCheckedChange={(checked) => handleInputChange("", "receiveNewsletter", checked === true)}
                      />
                      <Label htmlFor="receiveNewsletter" className="ml-2 text-sm">
                        Je souhaite recevoir des offres spéciales et des mises à jour sur les nouveaux cours
                      </Label>
                    </div>
                  </div>
                )}

                {/* Step 3: Billing Information */}
                {currentStep === STEPS.BILLING_INFO && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Adresse de facturation</h2>

                    <div className="mb-4">
                      <Label htmlFor="address">Adresse *</Label>
                      <Input
                        id="address"
                        value={formData.billingAddress.address}
                        onChange={(e) => handleInputChange("billingAddress", "address", e.target.value)}
                        placeholder="Numéro et nom de rue"
                        className="mt-1"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          value={formData.billingAddress.city}
                          onChange={(e) => handleInputChange("billingAddress", "city", e.target.value)}
                          placeholder="Votre ville"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Département/Région *</Label>
                        <Input
                          id="state"
                          value={formData.billingAddress.state}
                          onChange={(e) => handleInputChange("billingAddress", "state", e.target.value)}
                          placeholder="Votre département ou région"
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="zipCode">Code postal *</Label>
                        <Input
                          id="zipCode"
                          value={formData.billingAddress.zipCode}
                          onChange={(e) => handleInputChange("billingAddress", "zipCode", e.target.value)}
                          placeholder="Code postal"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Pays *</Label>
                        <select
                          id="country"
                          value={formData.billingAddress.country}
                          onChange={(e) => handleInputChange("billingAddress", "country", e.target.value)}
                          className="w-full rounded-md border border-gray-300 p-2 mt-1"
                          required
                        >
                          <option value="France">France</option>
                          <option value="Belgique">Belgique</option>
                          <option value="Suisse">Suisse</option>
                          <option value="Canada">Canada</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center mt-6">
                      <Checkbox
                        id="giftOption"
                        checked={formData.giftOption}
                        onCheckedChange={(checked) => handleInputChange("", "giftOption", checked === true)}
                      />
                      <Label htmlFor="giftOption" className="ml-2 text-sm">
                        J'achète ce cours comme cadeau
                      </Label>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment Method */}
                {currentStep === STEPS.PAYMENT && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Méthode de paiement</h2>

                    <Tabs defaultValue="creditCard" className="w-full">
                      <TabsList className="grid grid-cols-4 mb-6">
                        <TabsTrigger
                          value="creditCard"
                          onClick={() => handlePaymentMethodChange("creditCard")}
                          className={formData.paymentMethod === "creditCard" ? "bg-orange-50 border-orange-500" : ""}
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          <span className="hidden sm:inline">Carte</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="paypal"
                          onClick={() => handlePaymentMethodChange("paypal")}
                          className={formData.paymentMethod === "paypal" ? "bg-orange-50 border-orange-500" : ""}
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.5 8.5H18.5C18.5 5.74 16.26 3.5 13.5 3.5H7.5C4.74 3.5 2.5 5.74 2.5 8.5C2.5 11.26 4.74 13.5 7.5 13.5H10.5C13.26 13.5 15.5 15.74 15.5 18.5C15.5 21.26 13.26 23.5 10.5 23.5H4.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 8.5H7.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19.5 13.5H15.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15.5 18.5H10.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="hidden sm:inline">PayPal</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="applePay"
                          onClick={() => handlePaymentMethodChange("applePay")}
                          className={formData.paymentMethod === "applePay" ? "bg-orange-50 border-orange-500" : ""}
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.5 4.5C12.5 3.4 13.4 2.5 14.5 2.5C15.6 2.5 16.5 3.4 16.5 4.5C16.5 5.6 15.6 6.5 14.5 6.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.5 10.5V19.5C18.5 20.6 17.6 21.5 16.5 21.5H7.5C6.4 21.5 5.5 20.6 5.5 19.5V10.5C5.5 9.4 6.4 8.5 7.5 8.5H16.5C17.6 8.5 18.5 9.4 18.5 10.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.5 10.5H5.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9.5 6.5V8.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14.5 6.5V8.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="hidden sm:inline">Apple Pay</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="googlePay"
                          onClick={() => handlePaymentMethodChange("googlePay")}
                          className={formData.paymentMethod === "googlePay" ? "bg-orange-50 border-orange-500" : ""}
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="hidden sm:inline">Google Pay</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="creditCard" className="mt-0">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardNumber">Numéro de carte *</Label>
                            <div className="relative mt-1">
                              <div className="relative">
                                <Input
                                  id="cardNumber"
                                  className="pl-10"
                                  value={formData.creditCard?.cardNumber || ""}
                                  onChange={(e) => {
                                    const formatted = formatCardNumber(e.target.value)
                                    handleInputChange("creditCard", "cardNumber", formatted)
                                  }}
                                  placeholder="0000 0000 0000 0000"
                                  required
                                />
                                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="cardName">Nom sur la carte *</Label>
                            <Input
                              id="cardName"
                              value={formData.creditCard?.cardName || ""}
                              onChange={(e) => handleInputChange("creditCard", "cardName", e.target.value)}
                              placeholder="JEAN DUPONT"
                              className="mt-1"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiryDate">Date d'expiration *</Label>
                              <div className="relative mt-1">
                                <Input
                                  id="expiryDate"
                                  value={formData.creditCard?.expiryDate || ""}
                                  onChange={(e) => {
                                    const formatted = formatExpiryDate(e.target.value)
                                    handleInputChange("creditCard", "expiryDate", formatted)
                                  }}
                                  placeholder="MM/YY"
                                  className="pl-10"
                                  maxLength={5}
                                  required
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="cvv">Code de sécurité *</Label>
                              <div className="relative mt-1">
                                <Input
                                  id="cvv"
                                  type="password"
                                  value={formData.creditCard?.cvv || ""}
                                  onChange={(e) =>
                                    handleInputChange("creditCard", "cvv", e.target.value.replace(/\D/g, ""))
                                  }
                                  placeholder="123"
                                  className="pl-10"
                                  maxLength={4}
                                  required
                                />
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="paypal">
                        <div className="text-center py-8">
                          <svg
                            className="w-16 h-16 mx-auto mb-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.5 8.5H18.5C18.5 5.74 16.26 3.5 13.5 3.5H7.5C4.74 3.5 2.5 5.74 2.5 8.5C2.5 11.26 4.74 13.5 7.5 13.5H10.5C13.26 13.5 15.5 15.74 15.5 18.5C15.5 21.26 13.26 23.5 10.5 23.5H4.5"
                              stroke="#0070BA"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 8.5H7.5"
                              stroke="#0070BA"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19.5 13.5H15.5"
                              stroke="#0070BA"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15.5 18.5H10.5"
                              stroke="#0070BA"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="text-lg font-medium mb-2">Payer avec PayPal</p>
                          <p className="text-gray-600 mb-6">
                            Vous serez redirigé vers PayPal pour finaliser votre paiement en toute sécurité.
                          </p>
                          <Button className="bg-[#0070BA] hover:bg-[#005ea6]">Continuer avec PayPal</Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="applePay">
                        <div className="text-center py-8">
                          <svg
                            className="w-16 h-16 mx-auto mb-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.5 4.5C12.5 3.4 13.4 2.5 14.5 2.5C15.6 2.5 16.5 3.4 16.5 4.5C16.5 5.6 15.6 6.5 14.5 6.5"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.5 10.5V19.5C18.5 20.6 17.6 21.5 16.5 21.5H7.5C6.4 21.5 5.5 20.6 5.5 19.5V10.5C5.5 9.4 6.4 8.5 7.5 8.5H16.5C17.6 8.5 18.5 9.4 18.5 10.5Z"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.5 10.5H5.5"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9.5 6.5V8.5"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14.5 6.5V8.5"
                              stroke="#000000"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="text-lg font-medium mb-2">Payer avec Apple Pay</p>
                          <p className="text-gray-600 mb-6">
                            Vous serez invité à confirmer le paiement avec Face ID, Touch ID ou votre code d'accès.
                          </p>
                          <Button className="bg-black hover:bg-gray-800">Continuer avec Apple Pay</Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="googlePay">
                        <div className="text-center py-8">
                          <svg
                            className="w-16 h-16 mx-auto mb-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                              stroke="#4285F4"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                              stroke="#4285F4"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="text-lg font-medium mb-2">Payer avec Google Pay</p>
                          <p className="text-gray-600 mb-6">
                            Vous serez redirigé vers Google Pay pour finaliser votre paiement en toute sécurité.
                          </p>
                          <Button className="bg-[#4285F4] hover:bg-[#3367d6]">Continuer avec Google Pay</Button>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-green-600 mr-2" />
                        <p className="text-sm font-medium">Paiement 100% sécurisé</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 ml-7">
                        Toutes vos informations de paiement sont cryptées et sécurisées. Nous ne stockons pas vos
                        données de carte bancaire.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 5: Review and Confirm */}
                {currentStep === STEPS.REVIEW && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Vérification et confirmation</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Informations personnelles</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p>
                            <span className="font-medium">Nom:</span> {formData.personalInfo.firstName}{" "}
                            {formData.personalInfo.lastName}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span> {formData.personalInfo.email}
                          </p>
                          <p>
                            <span className="font-medium">Téléphone:</span> {formData.personalInfo.phone}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Adresse de facturation</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p>{formData.billingAddress.address}</p>
                          <p>
                            {formData.billingAddress.zipCode} {formData.billingAddress.city}
                          </p>
                          <p>
                            {formData.billingAddress.state}, {formData.billingAddress.country}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Méthode de paiement</h3>
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                          {formData.paymentMethod === "creditCard" && (
                            <>
                              <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                              <div>
                                <p className="font-medium">Carte bancaire</p>
                                <p className="text-gray-600">
                                  **** **** **** {formData.creditCard?.cardNumber.slice(-4)}
                                </p>
                              </div>
                            </>
                          )}
                          {formData.paymentMethod === "paypal" && (
                            <>
                              <svg
                                className="w-5 h-5 mr-3 text-[#0070BA]"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M19.5 8.5H18.5C18.5 5.74 16.26 3.5 13.5 3.5H7.5C4.74 3.5 2.5 5.74 2.5 8.5C2.5 11.26 4.74 13.5 7.5 13.5H10.5C13.26 13.5 15.5 15.74 15.5 18.5C15.5 21.26 13.26 23.5 10.5 23.5H4.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 8.5H7.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M19.5 13.5H15.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M15.5 18.5H10.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <p className="font-medium">PayPal</p>
                            </>
                          )}
                          {formData.paymentMethod === "applePay" && (
                            <>
                              <svg
                                className="w-5 h-5 mr-3"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.5 4.5C12.5 3.4 13.4 2.5 14.5 2.5C15.6 2.5 16.5 3.4 16.5 4.5C16.5 5.6 15.6 6.5 14.5 6.5"
                                  stroke="black"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M18.5 10.5V19.5C18.5 20.6 17.6 21.5 16.5 21.5H7.5C6.4 21.5 5.5 20.6 5.5 19.5V10.5C5.5 9.4 6.4 8.5 7.5 8.5H16.5C17.6 8.5 18.5 9.4 18.5 10.5Z"
                                  stroke="black"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M18.5 10.5H5.5"
                                  stroke="black"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9.5 6.5V8.5"
                                  stroke="black"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M14.5 6.5V8.5"
                                  stroke="black"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <p className="font-medium">Apple Pay</p>
                            </>
                          )}
                          {formData.paymentMethod === "googlePay" && (
                            <>
                              <svg
                                className="w-5 h-5 mr-3 text-[#4285F4]"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <p className="font-medium">Google Pay</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Votre commande</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                              <div>
                                <p className="font-medium">{item.course?.title}</p>
                                <p className="text-sm text-gray-600">Par {item.course?.instructor_id || "Instructeur"}</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{item.course?.level}</span>
                                  {item.course?.average_rating && (
                                    <span className="text-xs bg-yellow-100 px-2 py-1 rounded-full flex items-center">
                                      <svg className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                      </svg>
                                      {item.course.average_rating}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{parseFloat(item.price).toFixed(2)} €</p>
                                {item.course?.discount !== "0.00" && (
                                  <p className="text-gray-500 line-through text-sm">{parseFloat(item.course?.price).toFixed(2)} €</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center">
                        <Checkbox
                          id="acceptTerms"
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) => handleInputChange("", "acceptTerms", checked === true)}
                          required
                        />
                        <Label htmlFor="acceptTerms" className="ml-2 text-sm">
                          J'accepte les{" "}
                          <a href="#" className="text-orange-500 hover:underline">
                            conditions générales de vente
                          </a>{" "}
                          et la{" "}
                          <a href="#" className="text-orange-500 hover:underline">
                            politique de confidentialité
                          </a>
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Adblock warning message */}
            {hasAdBlocker && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-start">
                <svg
                  className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <div className="text-sm font-medium text-amber-800">
                    Bloqueur de publicité détecté
                  </div>
                  <p className="mt-1 text-sm text-amber-700">
                    Notre système de paiement utilise Stripe, qui peut être bloqué par votre bloqueur de publicités.
                    Si vous rencontrez des problèmes, veuillez désactiver temporairement votre bloqueur pour ce site.
                  </p>
                  <div className="mt-2">
                    <StripeHelp />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > STEPS.CART_SUMMARY ? (
                <Button variant="outline" onClick={prevStep} className="flex items-center">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              ) : (
                <Button variant="outline" onClick={() => window.location.href = "/cart"} className="flex items-center">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Retour au panier
                </Button>
              )}

              <Button
                onClick={nextStep}
                disabled={!isStepValid() || isLoading}
                className={cn(
                  "bg-orange-500 hover:bg-orange-600 text-white flex items-center",
                  isLoading && "opacity-70 cursor-not-allowed",
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    {currentStep === STEPS.REVIEW ? "Confirmer et payer" : "Continuer"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Récapitulatif de commande</CardTitle>
                  <CardDescription>
                    {cartItems.length} {cartItems.length > 1 ? "cours" : "cours"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Promo code */}
                    <div>
                      <Label htmlFor="promoCode">Code promo</Label>
                      <div className="flex mt-1">
                        <Input
                          id="promoCode"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Entrez votre code"
                          className="rounded-r-none"
                          disabled={promoApplied || isLoading}
                        />
                        <Button
                          onClick={handleApplyPromo}
                          disabled={!promoCode || promoApplied || isLoading}
                          className={cn(
                            "rounded-l-none",
                            promoApplied ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600",
                          )}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : promoApplied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            "Appliquer"
                          )}
                        </Button>
                      </div>
                      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                      {promoApplied && (
                        <div className="flex items-center text-green-600 text-sm mt-1">
                          <Check className="w-4 h-4 mr-1" />
                          <span>Code promo appliqué!</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Price breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prix original:</span>
                        <span className="text-gray-600 line-through">{originalTotal.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sous-total:</span>
                        <span>{subtotal.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Économies:</span>
                        <span>
                          -{savings.toFixed(2)} € ({savingsPercentage}%)
                        </span>
                      </div>
                      {promoApplied && (
                        <div className="flex justify-between text-orange-500">
                          <span>Réduction code promo:</span>
                          <span>-{promoDiscount.toFixed(2)} €</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>

                    <div className="text-xs text-gray-500 mt-2">* TVA incluse si applicable</div>

                    {/* Secure payment info */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Lock className="w-4 h-4 mr-2 text-green-600" />
                        <span>Paiement sécurisé</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Shield className="w-4 h-4 mr-2 text-green-600" />
                        <span>Garantie satisfait ou remboursé 30 jours</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Info className="w-4 h-4 mr-2 text-blue-600" />
                        <span>Accès à vie aux cours</span>
                      </div>
                    </div>

                    {/* Payment methods */}
                    <div className="flex justify-center space-x-3 mt-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M2 10H22" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <svg
                        className="w-8 h-8 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.5 8.5H18.5C18.5 5.74 16.26 3.5 13.5 3.5H7.5C4.74 3.5 2.5 5.74 2.5 8.5C2.5 11.26 4.74 13.5 7.5 13.5H10.5C13.26 13.5 15.5 15.74 15.5 18.5C15.5 21.26 13.26 23.5 10.5 23.5H4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 8.5H7.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19.5 13.5H15.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.5 18.5H10.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <svg
                        className="w-8 h-8 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.5 4.5C12.5 3.4 13.4 2.5 14.5 2.5C15.6 2.5 16.5 3.4 16.5 4.5C16.5 5.6 15.6 6.5 14.5 6.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.5 10.5V19.5C18.5 20.6 17.6 21.5 16.5 21.5H7.5C6.4 21.5 5.5 20.6 5.5 19.5V10.5C5.5 9.4 6.4 8.5 7.5 8.5H16.5C17.6 8.5 18.5 9.4 18.5 10.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.5 10.5H5.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.5 6.5V8.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.5 6.5V8.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <svg
                        className="w-8 h-8 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Need help */}
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Besoin d'aide ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <a href="#" className="flex items-center text-orange-500 hover:underline">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.18 20 9.89 19.71 8.7 19.16L3.5 20.5L4.87 15.4C4.29316 14.1777 3.99249 12.8484 4 11.5C4 9.91 4.44 8.37 5.28 7.03C6.11 5.69 7.3 4.6 8.7 3.89C9.89 3.34 11.18 3.05 12.5 3.05H13C15.0843 3.15224 17.053 4.05637 18.5291 5.58449C20.0051 7.1126 20.8322 9.12342 20.85 11.22V11.5H21Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Contacter le support</span>
                    </a>
                    <a href="#" className="flex items-center text-orange-500 hover:underline">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 7V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                      </svg>
                      <span>FAQ et aide</span>
                    </a>
                    <a href="#" className="flex items-center text-orange-500 hover:underline">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 12H21"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 3C14.5013 5.77167 15.9228 9.29363 16 13C16.0772 16.7064 14.6557 20.2283 12 23C9.34428 20.2283 7.92279 16.7064 8 13C8.07721 9.29363 9.49871 5.77167 12 3Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Conditions de vente</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Juste avant le renderCheckoutProcess()
  const [hasAdBlocker, setHasAdBlocker] = useState(false);

  // Ajouter cette fonction pour détecter un bloqueur de publicités
  useEffect(() => {
    const checkAdBlocker = async () => {
      try {
        // Essaie de charger un script depuis le domaine Stripe
        const response = await fetch('https://js.stripe.com/v3/');
        // Si la réponse est ok, les domaines Stripe ne sont pas bloqués
        setHasAdBlocker(!response.ok);
      } catch (error) {
        // S'il y a une erreur, il y a probablement un bloqueur
        setHasAdBlocker(true);
      }
    };
    
    checkAdBlocker();
  }, []);

  // Render success page
  const renderSuccessPage = () => {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Merci pour votre achat !</h1>
          <p className="text-gray-600">
            Votre commande a été traitée avec succès. Vous recevrez bientôt un email de confirmation.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-left">
                <p className="text-sm text-gray-600">Numéro de commande</p>
                <p className="font-medium">{orderNumber}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{orderDate}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600">Total payé</p>
                <p className="font-medium">{total.toFixed(2)} €</p>
              </div>
              <Separator />
              <div className="text-left">
                <p className="text-sm text-gray-600 mb-2">Cours achetés</p>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-medium">{item.course?.title}</p>
                      <p className="text-sm text-gray-600">Par {item.course?.instructor_id || "Instructeur"}</p>
                    </div>
                    <p className="font-medium">{parseFloat(item.price).toFixed(2)} €</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            onClick={() => window.location.href = "/student/courses"}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Accéder à mes cours
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  };

  // Render the appropriate view based on current step
  return currentStep === STEPS.SUCCESS ? renderSuccessPage() : renderCheckoutProcess()
}