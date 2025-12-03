import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Swal from 'sweetalert2';
import { useState } from "react";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(20, { message: "Password must be at most 20 characters" }),
});

interface LoginError {
  code?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const onsubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      await axiosClient.get('/sanctum/csrf-cookie');
      const response = await axiosClient.post('/api/login', values);
 
      if (response.status === 200) {
        const { user, token } = response.data;
        useAuth.getState().login(user, token);
        
       
        await Swal.fire({
          title: 'Connexion réussie!',
          text: 'Bienvenue sur notre plateforme!',
          icon: 'success',
          confirmButtonText: 'Continuer',
          confirmButtonColor: '#FF9500',
        });
        
        if (user.role === "teacher") {
          navigate('/teacher-dashboard');
        } else if (user.role === "admin") {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error: unknown) {
    
      const loginError = error as LoginError;

      
      if (loginError.code === 'ERR_NETWORK') {
        Swal.fire({
          title: 'Erreur de connexion',
          text: 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion réseau ou réessayer plus tard.',
          icon: 'error',
          confirmButtonColor: '#FF9500',
        });
      } else if (loginError.response?.status === 403 && 
                 loginError.response?.data?.message?.includes('pending approval')) {
        // Message spécifique pour compte en attente d'approbation
        Swal.fire({
          title: 'Compte en attente',
          text: 'Votre compte est en attente d\'approbation par un administrateur. Veuillez patienter ou contacter l\'administrateur.',
          icon: 'warning',
          confirmButtonColor: '#FF9500',
        });
      } else if (loginError.response?.data?.message) {
        // Autres erreurs avec message
        Swal.fire({
          title: 'Échec de connexion',
          text: loginError.response.data.message,
          icon: 'error',
          confirmButtonColor: '#FF9500',
        });
      } else {
        // Erreur générique
        Swal.fire({
          title: 'Échec de connexion',
          text: 'La connexion a échoué. Veuillez réessayer plus tard.',
          icon: 'error',
          confirmButtonColor: '#FF9500',
        });
      }
    }
  };

  return (
    <>
    
      <div className="min-h-screen flex flex-col bg-white">
        <main className="container mx-auto px-4 py-8 md:py-16 overflow-visible flex-1">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Section Témoignages */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#333333]">
                Students Testimonials
              </h2>
              <img src="./../../public/img/login.jfif" alt="testimonials" />
            </div>

           
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
                <h2 className="text-2xl font-bold text-center mb-2">Login</h2>
                <p className="text-center text-[#656567] mb-6">
                  Welcome back! Please login to your account.
                </p>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#333333]"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="Enter your Email"
                    className={`border-gray-200 ${errors.email ? "border-red-500" : ""}`}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
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
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
                      className={`border-gray-200 pr-10 ${errors.password ? "border-red-500" : ""}`}
                      aria-invalid={errors.password ? "true" : "false"}
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
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label htmlFor="remember" className="text-sm text-[#656567]">
                      Remember Me
                    </label>
                  </div>
                  <Button
                    variant="link"
                    onClick={() => navigate('/forgot-password')}
                    className="text-[#FF9500] hover:text-[#e68600] p-0"
                  >
                    Forgot Password?
                  </Button>
                </div>

               
                <Button
                  type="submit"
                  className="w-full bg-[#FF9500] hover:bg-[#e68600] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-200 absolute w-full"></div>
                  <span className="bg-white px-2 relative text-sm text-[#656567]">
                    OR
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-gray-200 flex items-center gap-2"
                >
                  <img
                    src="./../../public/img/OIP (3).jfif"
                    alt="Google logo"
                    width={20}
                    height={20}
                  />
                  <span>Continue with Google</span>
                </Button>

                <p className="text-center text-sm text-[#656567]">
                  Don't have an account?{" "}
                  <Button 
                    disabled={isSubmitting}
                    variant="link"
                    className="text-[#FF9500] hover:text-[#e68600] p-0"
                    onClick={() => navigate('/signup')}
                  >
                   Sign Up
                  </Button>
                </p>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Login;
