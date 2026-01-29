import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Globe, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
<<<<<<< Updated upstream
=======
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
>>>>>>> Stashed changes
import { auth } from "@/firebase";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  // If redirected from signup, show the verification message
  const redirectedFromSignup = (location.state as any)?.fromSignup;
  const signupEmail = (location.state as any)?.email || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    // reset verification flags
    setVerificationError("");
    setVerificationSent(false);

    try {
<<<<<<< Updated upstream
      await auth.signInWithEmailAndPassword(auth, email, password);
=======
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        // Try to resend verification email
        try {
          await sendEmailVerification(user);
          setVerificationSent(true);
        } catch (sendErr: any) {
          console.error("Failed to send verification email:", sendErr);
          setVerificationError(sendErr?.message || "Failed to send verification email");
        }

        // Sign out unverified user to prevent access
        try {
          await signOut(auth);
        } catch (signOutErr) {
          console.warn("Sign out after unverified login failed:", signOutErr);
        }

        setError("Email not verified. A verification link was (re)sent — please check your inbox and verify before logging in.");
        setLoading(false);
        return;
      }

      // Verified — proceed
>>>>>>> Stashed changes
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Visual */}
      <div className="hidden lg:flex flex-1 p-12 relative overflow-hidden env-panel">
        <div className="noise-overlay" />
        <div className="absolute inset-0 map-overlay opacity-90" />
        <div className="scanner-line opacity-35" />

        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/12 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse-slow delay-1000" />

        <div className="relative flex w-full flex-col justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="GreenGrid logo"
              className="h-11 w-auto rounded-2xl shadow-[0_0_28px_hsl(160_84%_39%/_0.18)]"
            />
            <div>
              <div className="text-sm text-muted-foreground">GreenGrid</div>
              <div className="font-semibold tracking-tight">Personal climate intelligence</div>
            </div>
          </div>

          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold leading-tight">See the world more clearly.</h2>
            <p className="mt-3 text-muted-foreground">
              GreenGrid turns environmental signals into simple, actionable insights—so you can explore conditions, understand risks, and track impact over time.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="status-live">Secure</span>
            <span>•</span>
            <span>Climate-first</span>
            <span>•</span>
            <span>Made for the demo</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-secondary/20" />
        <div className="absolute -top-24 right-10 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to home</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="GreenGrid logo" className="h-8 w-auto rounded-lg" />
            <span className="text-lg font-bold gradient-text">GreenGrid</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/30 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <span className="status-live">Encrypted</span>
                <span>Climate-first • Data-driven</span>
              </div>
              <h1 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">Welcome back to GreenGrid</h1>
              <p className="mt-2 text-muted-foreground">Your climate intelligence system.</p>
            </div>

            <div className="glass-card p-7 sm:p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="pl-10 rounded-xl bg-secondary/30 border-white/10 focus-visible:ring-primary/60 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="pl-10 pr-10 rounded-xl bg-secondary/30 border-white/10 focus-visible:ring-primary/60 focus-visible:ring-offset-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {verificationSent && (
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 mb-2">
                    Verification email sent — check your inbox (and spam) and then sign in.
                  </div>
                )}
                {redirectedFromSignup && (
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 mb-2">
                    We've sent a verification link to {signupEmail ?? 'your email'}. Please verify your address before signing in.
                  </div>
                )}

                {verificationError && (
                  <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3 text-sm text-yellow-400 mb-2">
                    {verificationError}
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 mb-2">
                    {error}
                  </div>
                )}

                <Button variant="hero" className="w-full" size="lg" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Enter GreenGrid"}
                </Button>
                <p className="text-xs text-muted-foreground">Secure sign-in. Climate-first. We never sell your data.</p>
              </form>

              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="glass" className="w-full">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="glass" className="w-full">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-7">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
