import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  component: React.ComponentType;
  allowedRoles: string[];
}

export const ProtectedRoute = ({
  component: Component,
  allowedRoles,
}: ProtectedRouteProps) => {

const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component />;
};



