import type React from "react"
import { Link } from "react-router-dom"
import { Shield, AlertTriangle, ArrowLeft, Home, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface UnauthorizedPageProps {
  title?: string
  message?: string
  showLoginButton?: boolean
  showHomeButton?: boolean
  showBackButton?: boolean
}

const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  title = "Accès non autorisé",
  message = "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
  showLoginButton = true,
  showHomeButton = true,
  showBackButton = true,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full shadow-lg border-red-200 dark:border-red-800">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="h-16 w-16 text-red-500 dark:text-red-400" />
              <AlertTriangle className="h-8 w-8 text-white dark:text-gray-900 absolute top-4 left-4" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">{title}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-base mt-2">{message}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 pb-2">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800/50">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur de la plateforme ou essayez
              de vous reconnecter.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          {showBackButton && (
            <Button
              variant="outline"
              className="w-full sm:w-auto flex items-center gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          )}
          {showHomeButton && (
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Home className="h-4 w-4" />
                Accueil
              </Button>
            </Link>
          )}
          {showLoginButton && (
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Se connecter
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default UnauthorizedPage

