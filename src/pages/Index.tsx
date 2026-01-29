import { Link } from "react-router-dom";
import { ArrowRight, Globe, Zap, Shield, BarChart3, Users, TreePine, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroGlobe from "@/assets/hero-globe.jpg";
import builtForNeedsImage from "@/assets/built-for-needs.png";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="GreenGrid logo"
          className="h-10 w-auto rounded-lg shadow-[0_0_24px_rgba(16,185,129,0.45)]"
        />
        <span className="text-xl font-bold gradient-text">GreenGrid</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
        <a href="#use-cases" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Use Cases</a>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" asChild>
          <Link to="/login">Sign In</Link>
        </Button>
        <Button variant="hero" size="sm" asChild>
          <Link to="/signup">Get Started</Link>
        </Button>
      </div>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    {/* Background */}
    <div className="absolute inset-0 z-0">
      <img src={heroGlobe} alt="" className="w-full h-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
    </div>
    
    {/* Animated particles */}
    <div className="absolute inset-0 z-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse-slow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>

    <div className="container relative z-10 mx-auto px-4 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
        <span className="status-live text-sm text-primary font-medium">Live Environmental Intelligence</span>
      </div>
      
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up delay-100">
        The Environmental Intelligence
        <br />
        <span className="gradient-text">System for Future Cities</span>
      </h1>
      
      <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 animate-fade-up delay-200">
        Monitor, predict, and simulate environmental conditions using AI-powered 
        Green Grids and Digital Twins. Transform your city into a sustainable ecosystem.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
        <Button variant="hero" size="xl" asChild>
          <Link to="/signup">
            Launch GreenGrid
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button variant="heroOutline" size="xl" asChild>
          <Link to="/dashboard">View Live Demo</Link>
        </Button>
      </div>

      {/* Stats preview removed as requested */}
    </div>
  </section>
);

const ProblemSection = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">The Environmental Challenge</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Traditional environmental management is broken. Cities are struggling with outdated systems.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Shield,
            title: "Lagging Telemetry",
            description: "Signals arrive late or incomplete. Response starts after impact is visible.",
          },
          {
            icon: BarChart3,
            title: "Siloed Evidence",
            description: "Air, heat, water, waste live in separate dashboards. No shared state or provenance.",
          },
          {
            icon: Activity,
            title: "No Counterfactuals",
            description: "Policies ship without scenario testing. No measurable “what-if” outcomes.",
          },
        ].map((problem, i) => (
          <div key={i} className="glass-card-hover p-6 text-center group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
              <problem.icon className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
            <p className="text-muted-foreground">{problem.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card">
          <Zap className="h-5 w-5 text-primary" />
          <span className="text-lg">
            <span className="font-semibold gradient-text">GreenGrid</span> transforms environmental management from reaction to prediction.
          </span>
        </div>
      </div>
    </div>
  </section>
);

const SolutionSection = () => (
  <section className="py-24 relative bg-gradient-to-b from-transparent via-primary/5 to-transparent">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">The GreenGrid Solution</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A three-pillar approach to predictive environmental intelligence
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            step: "01",
            icon: Globe,
            title: "Green Grid Atlas",
            subtitle: "Fuse & Localize",
            description: "Stream sensor + citizen signals into live risk surfaces per zone.",
            color: "from-emerald-500/20 to-emerald-500/5",
          },
          {
            step: "02",
            icon: Activity,
            title: "Digital Twin",
            subtitle: "Simulate Scenarios",
            description: "Run intervention what-ifs before rollout. Compare trajectories and tradeoffs.",
            color: "from-cyan-500/20 to-cyan-500/5",
          },
          {
            step: "03",
            icon: Zap,
            title: "Decision Engine",
            subtitle: "Rank Actions",
            description: "Prioritize interventions by impact, cost, and sustainability constraints.",
            color: "from-primary/20 to-primary/5",
          },
        ].map((solution, i) => (
          <div key={i} className="relative group">
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${solution.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative glass-card-hover p-8 h-full">
              <div className="text-6xl font-bold text-primary/10 absolute top-4 right-4">{solution.step}</div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <solution.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{solution.title}</h3>
              <p className="text-primary font-medium mb-4">{solution.subtitle}</p>
              <p className="text-muted-foreground">{solution.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Connection lines */}
      <div className="hidden md:flex justify-center mt-8">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="w-24 h-px bg-gradient-to-r from-transparent to-primary/50" />
          <ArrowRight className="h-5 w-5 text-primary" />
          <div className="w-24 h-px bg-primary/50" />
          <ArrowRight className="h-5 w-5 text-primary" />
          <div className="w-24 h-px bg-gradient-to-r from-primary/50 to-transparent" />
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section id="features" className="py-24 relative">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Operator-grade blocks you can demo live — no imagination required.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Globe, title: "Risk Map Console", description: "Heat, air, and water layers on a single live surface." },
          { icon: Activity, title: "Forecast Timeline", description: "Scrub 24–72h ahead to see risk move by zone." },
          { icon: Zap, title: "Scenario Sandbox", description: "Run A/B interventions on the shared digital twin." },
          { icon: Shield, title: "Action Queue", description: "Rank and dispatch environmental playbooks by impact." },
          { icon: Users, title: "Signal Fusion", description: "Blend sensors, citizen reports, and model outputs." },
          { icon: BarChart3, title: "Ops Dashboard", description: "Watch sustainability KPIs shift in real time." },
        ].map((feature, i) => (
          <div key={i} className="glass-card-hover p-6 group">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const UseCasesSection = () => (
  <section id="use-cases" className="py-24 relative bg-gradient-to-b from-transparent via-secondary/30 to-transparent">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Heading and bullet points */}
        <div className="space-y-6 text-left md:pr-8">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Built For Your Needs
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Each domain ships as a focused environmental intelligence module, ready to plug into your operations.
          </p>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">Smart Cities</span> – Tune heat, air, and mobility policies and see predicted risk per district.
            </li>
            <li>
              <span className="font-semibold text-foreground">Campuses &amp; Universities</span> – Track buildings and quads against live footprint and comfort targets.
            </li>
            <li>
              <span className="font-semibold text-foreground">Disaster Management</span> – Stress-test floods or fires and pre-plan playbooks before events hit.
            </li>
            <li>
              <span className="font-semibold text-foreground">ESG &amp; Sustainability</span> – Simulate policies and see CO₂ and resilience curves over time.
            </li>
          </ul>
        </div>

        {/* Right: Illustration image */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-full max-w-xl rounded-3xl overflow-hidden border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.65)] bg-gradient-to-b from-slate-950/70 to-slate-900/70">
            <img
              src={builtForNeedsImage}
              alt="Built for your needs modules preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-4">
      <div className="relative overflow-hidden rounded-3xl glass-card p-8 sm:p-12 md:p-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Start Building Your City's
            <br />
            <span className="gradient-text">Environmental Twin Today</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join forward-thinking cities, universities, and organizations that are transforming 
            environmental management with predictive intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="glass" size="xl">
              Request Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-white/10 bg-gradient-to-b from-background to-background/60">
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="grid gap-10 md:grid-cols-[2fr,1.2fr,1.2fr] items-start">
        {/* Brand + description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="GreenGrid logo"
              className="h-9 w-auto rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight">GreenGrid Command Center</span>
              <span className="text-xs text-muted-foreground uppercase tracking-[0.18em]">
                Environmental Intelligence Platform
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Built for the Microsoft Sustainability Hackathon — a live, operator-grade console for monitoring,
            simulating, and acting on environmental risk in real time.
          </p>
        </div>

        {/* Product links */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold tracking-wide text-foreground/90">Product</h4>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Live Command Center
            </Link>
            <Link to="/atlas" className="hover:text-foreground transition-colors">
              Green Grid Atlas
            </Link>
            <Link to="/signup" className="hover:text-foreground transition-colors">
              Get Started
            </Link>
          </div>
        </div>

        {/* About / hackathon context */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold tracking-wide text-foreground/90">About this project</h4>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground/90 transition-colors">
              Final-round submission · Sustainability &amp; Climate
            </span>
            <span className="hover:text-foreground/90 transition-colors">
              Focused on cities, campuses, and resilience operations
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} GreenGrid. Prototype for hackathon judging only — not a production service.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <TreePine className="h-3 w-3 text-emerald-400" />
            <span>Simulation-first sustainability</span>
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span>Designed &amp; engineered for live demo</span>
        </div>
      </div>
    </div>
  </footer>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <UseCasesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;