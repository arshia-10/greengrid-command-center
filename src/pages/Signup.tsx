import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";




import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, ArrowLeft, Eye, EyeOff, Mail, Lock, User, Building2, ShieldCheck, CloudSun, TriangleAlert, PlayCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const intents = [
  { id: "monitor", label: "Monitor environmental conditions", icon: CloudSun },
  { id: "risks", label: "Explore climate risks & forecasts", icon: TriangleAlert },
  { id: "simulate", label: "Simulate sustainability actions", icon: PlayCircle },
  { id: "learn", label: "Learn & research environmental data", icon: BookOpen },
] as const;
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedIntent, setSelectedIntent] =
    useState<(typeof intents)[number]["id"] | null>(null);

  // 🔐 Firebase form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (!selectedIntent) {
      setError("Please select how you'll use GreenGrid");
      return;
    }

    setLoading(true);
    
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        organization: organization || "",
        intent: selectedIntent,
        createdAt: serverTimestamp(),
        emailVerified: false,
      });
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      // Redirect to dashboard on successful signup (user is already authenticated)
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-secondary/20" />
        <div className="absolute -top-24 left-10 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to home</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
              <Globe className="h-4 w-4 text-slate-950" />
            </div>
            <span className="text-lg font-bold gradient-text">GreenGrid</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/30 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Secure onboarding • Climate-first</span>
              </div>
              <h1 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">Create your GreenGrid access</h1>
              <p className="mt-2 text-muted-foreground">Your personal climate intelligence workspace.</p>
            </div>

            <div className="glass-card p-7 sm:p-8">
              <div className="mb-6">
                <div className="text-sm font-medium">How will you use GreenGrid?</div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {intents.map((intent) => (
                    <button
                      key={intent.id}
                      type="button"
                      onClick={() => setSelectedIntent(intent.id)}
                      className={[
                        "group rounded-xl border px-4 py-3 text-left transition-all duration-300",
                        "bg-card/30 backdrop-blur",
                        "hover:border-white/20 hover:bg-card/40",
                        selectedIntent === intent.id ? "border-primary/35" : "border-white/10",
                      ].join(" ")}
                      aria-pressed={selectedIntent === intent.id}
                    >
                      <div className="flex items-center gap-3">
                        <intent.icon
                          className={[
                            "h-4 w-4",
                            selectedIntent === intent.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                          ].join(" ")}
                        />
                        <div className="text-sm leading-snug">{intent.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Optional — this won’t change your account or permissions.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="pl-10 rounded-xl bg-secondary/30 border-white/10 focus-visible:ring-primary/60 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

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
                  <Label htmlFor="organization">Organization (Optional)</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="organization"
                      placeholder="Your organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      disabled={loading}
                      className="pl-10 rounded-xl bg-secondary/30 border-white/10 focus-visible:ring-primary/60 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
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

                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
                    {error}
                  </div>
                )}
                <Button variant="hero" className="w-full" size="lg" type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Enter GreenGrid"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  No complex setup. GreenGrid adapts as you grow.
                </p>
              </form>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 p-12 relative overflow-hidden env-panel">
        <div className="noise-overlay" />
        <div className="absolute inset-0 map-overlay opacity-90" />
        <div className="scanner-line opacity-35" />

        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/12 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse-slow delay-1000" />

        <div className="relative flex w-full flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-[0_0_28px_hsl(160_84%_39%/_0.18)]">
              <Globe className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">GreenGrid</div>
              <div className="font-semibold tracking-tight">Personal climate intelligence</div>
            </div>
          </div>

          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold leading-tight">A calm place to understand climate.</h2>
            <p className="mt-3 text-muted-foreground">
              Explore environmental conditions, climate risks, and potential actions—then keep a simple record of what you learn.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="status-live">Secure</span>
            <span>•</span>
            <span>Clear</span>
            <span>•</span>
            <span>Hackathon-ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
