import { Routes, Route } from "react-router-dom";

// import Home from "@/pages/Home";
// import Dashboard from "@/pages/Dashboard";
// import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import ProtectedRoute from "./ProtectedRoutes";
import Register from "@/pages/Register";
import MainLayout from "@/layouts/MainLayout";
import LandingPage from "@/pages/home/LandingPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes, no Navbar (auth pages are full-screen) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />

      {/* Routes with the shared Navbar layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />

        {/* Anything nested here requires a logged-in user */}
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Route>
      </Route>

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
