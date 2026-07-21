import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/feeds" replace />;
    // or return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
