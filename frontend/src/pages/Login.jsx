import LoginForm from "@/components/form/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(form) {
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Couldn't log in. Check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return <LoginForm onSubmit={handleLogin} loading={loading} error={error} />;
}
