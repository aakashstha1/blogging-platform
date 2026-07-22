// GuestOnlyRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function GuestOnlyRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/feeds" replace /> : <Outlet />;
}
