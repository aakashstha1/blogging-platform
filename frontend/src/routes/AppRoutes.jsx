import { Routes, Route } from "react-router-dom";

// import Home from "@/pages/Home";
// import Dashboard from "@/pages/Dashboard";
// import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import ProtectedRoute from "./ProtectedRoutes";
import Register from "@/pages/Register";
import MainLayout from "@/layouts/MainLayout";
import LandingPage from "@/pages/home/LandingPage";
import MyFeed from "@/pages/home/MyFeed";
import TrendingPosts from "@/pages/TrendingPosts";
import RecommendedPosts from "@/pages/RecommendedPosts";
import Profile from "@/pages/Profile";
import SinglePost from "../components/common/SinglePost";
import CreatePost from "../pages/CreatePost";
import PublicRoute from "./PublicRoutes";
import MyPosts from "@/pages/MyPosts";
import EditPost from "@/pages/EditPost";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes, no Navbar (auth pages are full-screen) */}

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
      </Route>

      {/* Routes with the shared Navbar layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />

        {/* Anything nested here requires a logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/feeds" element={<MyFeed />} />
          <Route path="/trending" element={<TrendingPosts />} />
          <Route path="/write" element={<CreatePost />} />
          <Route path="/recommended" element={<RecommendedPosts />} />
          <Route path="/posts/:slug" element={<SinglePost />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts/edit/:slug" element={<EditPost />} />
        </Route>
      </Route>

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
