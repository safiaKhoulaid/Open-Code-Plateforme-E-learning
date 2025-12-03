import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";

// Schéma de validation Zod
const ResetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password cannot exceed 100 characters" }),
  password_confirmation: z.string()
    .min(8, { message: "Password confirmation must match password" }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
  message?: string;
  code?: string;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isValidLink, setIsValidLink] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (!tokenParam || !emailParam) {
      setIsValidLink(false);
      Swal.fire({
        title: 'Lien invalide',
        text: 'Le lien de réinitialisation de mot de passe est invalide ou a expiré.',
        icon: 'error',
        confirmButtonColor: '#ff9500',
      }).then(() => {
        navigate('/login');
      });
    } else {
      setToken(tokenParam);
      setEmail(emailParam);
    }
  }, [searchParams, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token || !email) return;
    
    try {
      // Get CSRF cookie first
      await axiosClient.get('/sanctum/csrf-cookie');
      
      // Send reset password request
      const response = await axiosClient.post('/api/reset-password', {
        token,
        email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      if (response.status === 200) {
        // Afficher un message de succès
        await Swal.fire({
          title: 'Mot de passe réinitialisé !',
          text: 'Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
          icon: 'success',
          confirmButtonText: 'Se connecter',
          confirmButtonColor: '#ff9500',
        });
        
        navigate('/login');
      }
    } catch (error: unknown) {
      console.error('Password reset failed:', error);
      
      const resetError = error as ResetPasswordError;
      
      if (resetError.code === 'ERR_NETWORK') {
        Swal.fire({
          title: 'Erreur de connexion',
          text: 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion réseau.',
          icon: 'error',
          confirmButtonColor: '#ff9500',
        });
      } else if (resetError.response?.data?.errors?.password) {
        // Erreur de validation mot de passe
        Swal.fire({
          title: 'Mot de passe invalide',
          text: resetError.response.data.errors.password.join(', '),
          icon: 'error',
          confirmButtonColor: '#ff9500',
        });
      } else if (resetError.response?.status === 422) {
        // Erreur de validation
        Swal.fire({
          title: 'Erreur de validation',
          text: 'Veuillez vérifier vos informations et réessayer.',
          icon: 'error',
          confirmButtonColor: '#ff9500',
        });
      } else if (resetError.response?.status === 419 || resetError.response?.status === 401) {
        // Token expiré ou invalide
        Swal.fire({
          title: 'Lien expiré',
          text: 'Le lien de réinitialisation a expiré ou est invalide. Veuillez demander un nouveau lien.',
          icon: 'warning',
          confirmButtonColor: '#ff9500',
        }).then(() => {
          navigate('/forgot-password');
        });
      } else if (resetError.response?.data?.message) {
        // Message d'erreur spécifique du serveur
        Swal.fire({
          title: 'Erreur',
          text: resetError.response.data.message,
          icon: 'error',
          confirmButtonColor: '#ff9500',
        });
      } else {
        // Erreur générique
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la réinitialisation du mot de passe.',
          icon: 'error',
          confirmButtonColor: '#ff9500',
        });
      }
    }
  };

  if (!isValidLink) {
    return null; // Ne rien afficher si le lien est invalide
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex flex-1 flex-col justify-center p-6 lg:p-10 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
            {/* Logo */}
            <div className="bg-[#ff9500] h-16 w-16 rounded-md flex items-center justify-center">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Reset Your Password
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Please enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    {...register("password")}
                    className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="password_confirmation" 
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    {...register("password_confirmation")}
                    className={`mt-1 ${errors.password_confirmation ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#ff9500] hover:bg-[#e68600]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>

            <Button
              variant="link"
              onClick={() => navigate('/login')}
              className="w-full text-[#ff9500] hover:text-[#e68600]"
            >
              Back to login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 