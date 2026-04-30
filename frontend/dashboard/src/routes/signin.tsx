import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Smart Map" },
      { name: "description", content: "Sign in to start exploring your city." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError("Please enter both email and password.");
    if (!validateEmail(email)) return setError("Please enter a valid email address.");
    setError("");
    // UI-only demo
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/30 blur-[140px] animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-accent/20 blur-[140px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 md:p-10 shadow-glow">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Map className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-extrabold">Smart Map</span>
          </Link>

          <h1 className="font-display text-3xl font-extrabold mb-2">
            Welcome back, <span className="text-gradient">explorer</span>.
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Sign in to pick up your missions where you left off.
          </p>

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
            Don't have an account?{" "}
            <a href="#" className="text-primary hover:text-primary-glow font-semibold transition-colors">
              Sign up, it's free
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in you agree to our <a href="#" className="underline">Terms</a> and{" "}
          <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
}
