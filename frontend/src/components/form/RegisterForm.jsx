import { useState } from "react";

import { Eye, EyeOff, User, Lock, Feather, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Purely presentational — the page that renders this (Login.jsx) owns the
// real auth logic and passes it down as props.
function RegisterForm({ onSubmit, loading = false, error = "" }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(form);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0F1B1A] px-4">
      {/* Ambient glow shapes behind the glass card */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#1F5F5B] opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#3D8B87] opacity-30 blur-3xl" />

      {/* Glass card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md">
            <Feather className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-medium text-white">Create an account</h1>

          <p className="text-sm text-white/60"> Start your blogging journey.</p>
        </div>

        <div className="flex flex-col gap-4">
          {error && (
            <div className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username" className="text-white/80">
              Username
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="yourusername"
                required
                value={form.username}
                onChange={handleChange}
                className="border-white/15 bg-white/5 pl-9 text-white placeholder:text-white/40 focus-visible:ring-white/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-white/80">
              Email
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                placeholder="xyz@example.com"
                required
                value={form.email}
                onChange={handleChange}
                className="border-white/15 bg-white/5 pl-9 text-white placeholder:text-white/40 focus-visible:ring-white/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white/80">
                Password
              </Label>
              <a
                href="/forgot-password"
                className="text-xs text-white/60 hover:text-white"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={handleChange}
                className="border-white/15 bg-white/5 pl-9 pr-10 text-white placeholder:text-white/40 focus-visible:ring-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 border border-white/20 bg-white/90 text-[#0F1B1A] hover:bg-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing up ...
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-white hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
