import { Link } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  return (
    <div className="min-h-screen flex bg-memento-cream" data-testid="signup-page">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1600&q=80"
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-memento-espresso/70 via-memento-espresso/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <p className="text-xs tracking-[0.3em] uppercase text-memento-apricot font-semibold mb-4">
            Memento
          </p>
          <h2 className="font-serif text-4xl text-memento-cream leading-tight tracking-tight max-w-md">
            Plan a trip in 78 seconds.
            <br />
            <em className="italic font-normal text-memento-cream/80">
              Remember it for years.
            </em>
          </h2>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-16">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-10" data-testid="auth-home-link">
            <div className="w-9 h-9 rounded-full bg-memento-espresso text-memento-cream flex items-center justify-center font-serif">
              M
            </div>
            <span className="font-serif text-xl text-memento-espresso">
              Memento
            </span>
          </Link>

          <h1 className="font-serif text-4xl text-memento-espresso tracking-tight mb-2">
            Create your account.
          </h1>
          <p className="text-memento-coffee mb-8">
            Free forever. No credit card.
          </p>

          <div className="space-y-3 mb-6">
            <button
              data-testid="signup-google"
              className="w-full h-12 rounded-full border border-memento-parchment bg-white hover:bg-memento-sand flex items-center justify-center gap-3 text-sm font-medium text-memento-espresso transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
            <button
              data-testid="signup-apple"
              className="w-full h-12 rounded-full bg-memento-espresso hover:bg-memento-coffee text-memento-cream flex items-center justify-center gap-3 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Sign up with Apple
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-memento-parchment" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-memento-cream text-memento-coffee uppercase tracking-wider">
                Or with email
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="name" className="text-xs uppercase tracking-wider text-memento-coffee font-semibold">
                Name
              </Label>
              <div className="relative mt-1.5">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-memento-coffee" />
                <Input
                  id="name"
                  data-testid="signup-name"
                  placeholder="Jordan Smith"
                  className="pl-11 h-12 rounded-xl border-memento-parchment bg-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-memento-coffee font-semibold">
                Email
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-memento-coffee" />
                <Input
                  id="email"
                  type="email"
                  data-testid="signup-email"
                  placeholder="you@email.com"
                  className="pl-11 h-12 rounded-xl border-memento-parchment bg-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-memento-coffee font-semibold">
                Password
              </Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-memento-coffee" />
                <Input
                  id="password"
                  type="password"
                  data-testid="signup-password"
                  placeholder="At least 8 characters"
                  className="pl-11 h-12 rounded-xl border-memento-parchment bg-white"
                />
              </div>
            </div>

            <p className="text-xs text-memento-coffee leading-relaxed">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-memento-terracotta hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-memento-terracotta hover:underline">
                Privacy Policy
              </a>
              .
            </p>

            <Button
              type="submit"
              data-testid="signup-submit"
              className="w-full h-12 rounded-full bg-memento-terracotta hover:bg-memento-terracotta-dark text-white font-medium"
            >
              Create account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-sm text-memento-coffee text-center mt-8">
            Already have one?{" "}
            <Link
              to="/auth/login"
              className="text-memento-terracotta hover:text-memento-terracotta-dark font-medium"
              data-testid="signup-to-login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
