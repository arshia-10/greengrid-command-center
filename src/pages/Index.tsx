import { Link } from "react-router-dom";
import { ArrowRight, Globe, Zap, Shield, BarChart3, Users, TreePine, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroGlobe from "@/assets/hero-globe.jpg";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
          <Globe className="h-5 w-5 text-slate-950" />
        </div>
        <span className="text-xl font-bold gradient-text">GreenGrid</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
        <a href="#use-cases" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Use Cases</a>
        <a href="#impact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impact</a>
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

      {/* Stats preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 animate-fade-up delay-400">
        {[
          { value: "2.4M+", label: "Data Points Analyzed" },
          { value: "156", label: "Cities Connected" },
          { value: "99.9%", label: "Uptime SLA" },
          { value: "40%", label: "Carbon Reduction" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold gradient-text font-mono-data">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
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
            title: "Reactive Systems",
            description: "Current systems only respond after damage occurs. No prediction, no prevention.",
          },
          {
            icon: BarChart3,
            title: "Fragmented Data",
            description: "Environmental data exists in silos. No unified view of city health.",
          },
          {
            icon: Activity,
            title: "No Future Vision",
            description: "Without simulation capabilities, cities can't test strategies before implementation.",
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
            subtitle: "Detect & Predict",
            description: "Live environmental mapping with AI-powered risk detection and predictive analytics.",
            color: "from-emerald-500/20 to-emerald-500/5",
          },
          {
            step: "02",
            icon: Activity,
            title: "Digital Twin",
            subtitle: "Simulate & Test",
            description: "Create virtual replicas of your environment to test scenarios before implementation.",
            color: "from-cyan-500/20 to-cyan-500/5",
          },
          {
            step: "03",
            icon: Zap,
            title: "Decision Engine",
            subtitle: "Act & Optimize",
            description: "AI-driven recommendations for environmental interventions and policy decisions.",
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
          Everything you need to monitor, predict, and optimize your environment
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Globe, title: "Live Risk Maps", description: "Real-time environmental monitoring with heat, air, water, and waste tracking" },
          { icon: Activity, title: "AI Prediction", description: "Machine learning models forecast environmental changes days in advance" },
          { icon: Zap, title: "Digital Twin Lab", description: "Test environmental scenarios in a virtual replica of your city" },
          { icon: Shield, title: "Smart Actions", description: "AI-generated recommendations for intervention and policy decisions" },
          { icon: Users, title: "Citizen Reports", description: "Crowdsourced environmental intelligence from community members" },
          { icon: BarChart3, title: "Impact Dashboards", description: "Track sustainability metrics and environmental KPIs" },
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
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built For Your Needs</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          From smart cities to university campuses, GreenGrid adapts to your scale
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            title: "Smart Cities",
            description: "City-wide environmental monitoring and policy simulation for urban planners",
            features: ["Urban heat island mapping", "Air quality prediction", "Traffic emission modeling"],
          },
          {
            title: "Campuses & Universities",
            description: "Sustainable campus management and environmental research platform",
            features: ["Campus green score", "Research data access", "Student engagement tools"],
          },
          {
            title: "Disaster Management",
            description: "Early warning systems and emergency response coordination",
            features: ["Flood prediction", "Fire risk assessment", "Emergency simulations"],
          },
          {
            title: "ESG & Sustainability",
            description: "Environmental compliance tracking and sustainability reporting",
            features: ["Carbon footprint tracking", "ESG report generation", "Goal monitoring"],
          },
        ].map((useCase, i) => (
          <div key={i} className="glass-card-hover p-8">
            <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
            <p className="text-muted-foreground mb-6">{useCase.description}</p>
            <ul className="space-y-2">
              {useCase.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ImpactSection = () => (
  <section id="impact" className="py-24 relative overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Real Impact, Real Numbers</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          GreenGrid is making a measurable difference in communities worldwide
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { value: "12,500+", label: "Risk Zones Monitored", icon: Globe },
          { value: "1.2M", label: "Simulations Run", icon: Activity },
          { value: "340K", label: "Tons CO₂ Reduced", icon: TreePine },
          { value: "89", label: "Communities Impacted", icon: Users },
        ].map((stat, i) => (
          <div key={i} className="relative group">
            <div className="absolute inset-0 rounded-xl bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors" />
            <div className="relative glass-card p-6 text-center">
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold gradient-text font-mono-data mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
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
  <footer className="py-12 border-t border-white/5">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
            <Globe className="h-4 w-4 text-slate-950" />
          </div>
          <span className="text-lg font-bold gradient-text">GreenGrid</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">About</a>
          <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        </div>
        <div className="text-sm text-muted-foreground">
          © 2025 GreenGrid. All rights reserved.
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
      <ImpactSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
