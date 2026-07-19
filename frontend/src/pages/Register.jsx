import RegisterForm from "@/components/form/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(form) {
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Couldn't register in. Check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <RegisterForm onSubmit={handleRegister} loading={loading} error={error} />
  );
}
