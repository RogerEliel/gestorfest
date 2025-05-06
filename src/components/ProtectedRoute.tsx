
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Save the intended location for redirect after login
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login", { replace: true });
    }
  }, [loading, user, location, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!user) {
    return null; // Navigation will handle redirect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
