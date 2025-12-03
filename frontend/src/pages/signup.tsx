import { useState, FormEvent } from "react";
import { Eye, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Swal from 'sweetalert2';

interface ApiErrorResponse {
  data?: {
    errors?: Record<string, string[]>;
    message?: string;
  };
}

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs requis"
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        variant: "destructive",
        title: "Conditions d'utilisation",
        description: "Veuillez accepter les conditions d'utilisation"
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        variant: "destructive",
        title: "Mot de passe invalide",
        description: "Le mot de passe doit contenir au moins 8 caractères"
      });
      return;
    }

    try {
      setIsLoading(true);
      await axiosClient.get("/sanctum/csrf-cookie");
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password,
        role: formData.role,
      };
       console.log(userData)

      const response = await axiosClient.post("/api/register", userData);

      if (response.status === 201 || response.status === 200) {
        if (response.data?.token && response.data?.user) {
          const { user, token } = response.data;
          useAuth.getState().login(user, token);
          
          // Afficher SweetAlert pour le succès
          await Swal.fire({
            title: 'Inscription réussie!',
            text: 'Bienvenue sur notre plateforme!',
            icon: 'success',
            confirmButtonText: 'Continuer',
            confirmButtonColor: '#FF9500',
          });
          
          navigate("/");
        } else {
          // Afficher SweetAlert pour le succès
          await Swal.fire({
            title: 'Inscription réussie!',
            text: 'Veuillez vous connecter avec vos identifiants',
            icon: 'success',
            confirmButtonText: 'Se connecter',
            confirmButtonColor: '#FF9500',
          });
          
          navigate("/login");
        }
      }
    } catch (error: unknown) {
      console.error("Registration failed:", error);

      const apiError = error as ApiErrorResponse;
      
      if (apiError?.data?.errors) {
        const errorMessages = Object.values(apiError.data.errors)
          .flat()
          .join("\n");
        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: errorMessages
        });
      } else if (apiError?.data?.message) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: apiError.data.message
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "L'inscription a échoué. Veuillez réessayer plus tard."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      {/* Contenu principal */}
      <div className="min-h-screen flex flex-col bg-white">
        <main className="container mx-auto px-4 py-8 md:py-16 overflow-visible flex-1">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Section Témoignages */}
            <div className="space-y-6 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-[#333333] text-center">
                Créez votre compte et commencez
              </h2>
              
              <p className="text-[#656567] text-center max-w-md">
                Rejoignez notre plateforme d'apprentissage et accédez à des cours de qualité pour développer vos compétences.
              </p>
              <div className="w-full max-w-md">
                <img 
                  src="./../../public/img/online-education-application-learning-worldwide-on-phone-mobile-website-background-social-distance-concept-the-classroom-training-course-library-illustration-flat-design-vector.jpg" 
                  alt="Créer un compte" 
                  className="w-full h-auto rounded-lg mb-6"
                />
              </div>
              
             
            </div>

            {/* Section Formulaire */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
                <p className="text-center text-[#656567] mb-6">
                  Create an account to unlock exclusive features.
                </p>

                {/* Champ Nom Complet */}
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-[#333333]"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="Entrer votre prénom"
                    className="border-gray-200"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="laststName"
                    className="block text-sm font-medium text-[#333333]"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Entrer votre prénom"
                    className="border-gray-200"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Champ Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#333333]"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your Email"
                    className="border-gray-200"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Select pour Type d'utilisateur */}
                <div className="space-y-2">
                  <label
                    htmlFor="userType"
                    className="block text-sm font-medium text-[#333333]"
                  >
                    I want to register as
                  </label>
                  <div className="relative">
                    <select
                      id="userType"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-2 appearance-none pr-10 h-10 text-gray-800"
                    >
                      <option value="1">Student</option>
                      <option value="2">Teacher</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#333333]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
                      className="border-gray-200 pr-10"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Case à cocher pour les conditions */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        agreeToTerms: checked === true,
                      }))
                    }
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-[#656567]"
                  >
                    I agree with{" "}
                    <a href="#" className="text-[#333333] underline">
                      Terms of Use
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#333333] underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Bouton d'inscription */}
                <Button
                  type="submit"
                  className="w-full bg-[#FF9500] hover:bg-[#e68600] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inscription en cours...
                    </>
                  ) : (
                    `S'inscrire en tant que ${userType === "student" ? "Étudiant" : "Enseignant"}`
                  )}
                </Button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-200 absolute w-full"></div>
                  <span className="bg-white px-2 relative text-sm text-[#656567]">
                    OR
                  </span>
                </div>

                {/* Inscription avec Google */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-200 flex items-center gap-2"
                >
                  <img
                    src="./../../public/img/OIP (3).jfif"
                    alt="Google logo"
                    width={20}
                    height={20}
                  />
                  <span>Sign up with Google</span>
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Signup;
