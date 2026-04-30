import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/auth-shell";
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Smart Map" },
      { name: "description", content: "Sign in to start exploring your city." },
    ],
  }),
  component: SignInPage,
});

export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError("Please enter both email and password.");
    if (!validateEmail(email)) return setError("Please enter a valid email address.");

    setError("");
    try {
      const res = await authApi.login({ email, password });
      if (res?.token) {
        localStorage.setItem("token", res.token);
        navigate({ to: "/dashboard" });
      } else {
        setError("Invalid response from server");
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <AuthShell
      title={
        <>
          Welcome back, <span className="text-gradient">explorer</span>.
        </>
      }
      description="Sign in to pick up your missions where you left off."
      footer={
        <>
          By signing in you agree to our{" "}
          <a href="#" className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
          .
        </>
      }
    >
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            placeholder="you@city.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-xl bg-input/60 border border-border pl-10 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-xl bg-input/60 border border-border pl-10 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" variant="hero" size="lg" className="w-full">
          Sign in <ArrowRight className="w-4 h-4 ml-1" />
        </Button>

      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link
          to="/signup"
          className="text-primary hover:text-primary-glow font-semibold transition-colors"
        >
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
