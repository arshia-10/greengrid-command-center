import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, ArrowLeft, Eye, EyeOff, Mail, Lock, User, Building2, GraduationCap, FlaskConical, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const userTypes = [
  { id: "citizen", label: "Student / Citizen", icon: User, description: "Personal environmental monitoring" },
  { id: "campus", label: "Campus Authority", icon: GraduationCap, description: "University & campus management" },
  { id: "researcher", label: "Researcher", icon: FlaskConical, description: "Environmental research & data" },
  { id: "government", label: "Government / ESG", icon: Landmark, description: "City planning & compliance" },
];

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (step === 1 && selectedType) {
      setStep(2);
    } else if (step === 2) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-12">
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
            {step === 1 ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Join GreenGrid</h1>
                  <p className="text-muted-foreground">Select your role to get started</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {userTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                        selectedType === type.id
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-white/10 bg-card/60 hover:border-white/20 hover:bg-card/80"
                      }`}
                    >
                      <type.icon className={`h-6 w-6 mb-3 ${selectedType === type.id ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="font-medium mb-1">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </button>
                  ))}
                </div>

                <Button variant="hero" className="w-full" size="lg" disabled={!selectedType} onClick={handleContinue}>
                  Continue
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create your account</h1>
                  <p className="text-muted-foreground">Enter your details below</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="name" placeholder="John Doe" className="pl-10 bg-secondary/50 border-white/10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@example.com" className="pl-10 bg-secondary/50 border-white/10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization (Optional)</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="organization" placeholder="Your organization" className="pl-10 bg-secondary/50 border-white/10" />
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
                        className="pl-10 pr-10 bg-secondary/50 border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button variant="hero" className="w-full" size="lg" type="submit">
                    Create Account
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">Terms</a>
                  {" "}and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden bg-gradient-to-br from-secondary/50 to-background">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        
        <div className="relative text-center">
          <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-glow animate-float">
            <Globe className="h-16 w-16 text-slate-950" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Environmental Intelligence</h2>
          <p className="text-muted-foreground max-w-sm">
            Join thousands of cities and organizations transforming environmental management with AI-powered insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
