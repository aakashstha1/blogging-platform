import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Still checking the httpOnly cookie on first load — don't redirect yet,
  // or a logged-in user gets bounced to /login for a split second.
  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
