import api from "@/api/axios";
import { AuthContext } from "./AuthContext";
import { useState } from "react";
import { useEffect } from "react";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (userData) => {
    const { data } = await api.post("/auth/login", userData);
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
