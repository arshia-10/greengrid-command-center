import { Link } from "react-router-dom";
import {
  Globe,
  Map,
  Activity,
  FileText,
  Users,
  User,
  ChevronDown,
  Thermometer,
  Wind,
  Droplets,
  TreePine,
  Car,
  Factory,
  CloudRain,
  Trash2,
  Play,
  RotateCcw,
  Download,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Leaf,
  Heart,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Atlas", href: "/atlas" },
  { icon: Globe, label: "Digital Twin", href: "/digital-twin", active: true },
  { icon: Activity, label: "Simulations", href: "/simulations" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: User, label: "Profile", href: "/profile" },
];

const controls = [
  { id: "trees", label: "Tree Coverage", icon: TreePine, value: 34, unit: "%", color: "text-emerald-400" },
  { id: "traffic", label: "Traffic Density", icon: Car, value: 65, unit: "%", color: "text-orange-400" },
  { id: "rainfall", label: "Rainfall Stress", icon: CloudRain, value: 20, unit: "mm", color: "text-blue-400" },
  { id: "industry", label: "Industrial Output", icon: Factory, value: 45, unit: "%", color: "text-yellow-400" },
  { id: "waste", label: "Waste Mismanagement", icon: Trash2, value: 15, unit: "%", color: "text-red-400" },
];

const environmentalState = [
  { label: "Air Quality Index", current: 72, predicted: 68, change: -4, unit: "AQI" },
  { label: "Temperature", current: 32, predicted: 31, change: -1, unit: "°C" },
  { label: "CO₂ Levels", current: 420, predicted: 395, change: -25, unit: "ppm" },
  { label: "Humidity", current: 65, predicted: 68, change: 3, unit: "%" },
];

const impactMetrics = [
  { label: "Sustainability Index", value: 72, change: 8, icon: Leaf, color: "text-emerald-400" },
  { label: "Health Impact Score", value: 85, change: 5, icon: Heart, color: "text-pink-400" },
  { label: "Energy Efficiency", value: 68, change: 12, icon: Zap, color: "text-yellow-400" },
];

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <>
    {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
    
    <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-sidebar border-r border-white/5 z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-8 px-2">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="GreenGrid logo"
              className="h-9 w-auto rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            />
            <span className="text-lg font-bold gradient-text">GreenGrid</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                link.active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="space-y-1 pt-4 border-t border-white/5">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Log out</span>
          </Link>
        </div>
      </div>
    </aside>
  </>
);

const DigitalTwin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [controlValues, setControlValues] = useState<Record<string, number>>({
    trees: 34,
    traffic: 65,
    rainfall: 20,
    industry: 45,
    waste: 15,
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const handleControlChange = (id: string, value: number[]) => {
    setControlValues((prev) => ({ ...prev, [id]: value[0] }));
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Environmental Digital Twin
                </h1>
                <p className="text-xs text-muted-foreground">Downtown District Simulation Lab</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-medium text-cyan-400">Simulation Ready</span>
              </div>
              <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-950" />
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="grid lg:grid-cols-3 gap-6 h-full">
            {/* Control Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Zone Overview */}
              <div className="glass-card p-4">
                <h2 className="font-semibold mb-4">Selected Zone</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
                    <Map className="h-8 w-8 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Downtown District</h3>
                    <p className="text-sm text-muted-foreground">Area: 12.4 km²</p>
                    <p className="text-sm text-muted-foreground">Population: 145,000</p>
                  </div>
                </div>
                <Button variant="glass" size="sm" className="w-full" asChild>
                  <Link to="/atlas">Change Zone</Link>
                </Button>
              </div>

              {/* Simulation Controls */}
              <div className="glass-card p-4">
                <h2 className="font-semibold mb-4">Simulation Controls</h2>
                <div className="space-y-6">
                  {controls.map((control) => (
                    <div key={control.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <control.icon className={`h-4 w-4 ${control.color}`} />
                          <span className="text-sm">{control.label}</span>
                        </div>
                        <span className="text-sm font-mono-data">
                          {controlValues[control.id]}{control.unit}
                        </span>
                      </div>
                      <Slider
                        value={[controlValues[control.id]]}
                        onValueChange={(value) => handleControlChange(control.id, value)}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="glass-card p-4 space-y-3">
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={runSimulation}
                  disabled={isSimulating}
                >
                  {isSimulating ? (
                    <>
                      <Activity className="h-4 w-4 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Simulation
                    </>
                  )}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="glass" size="sm">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button variant="glass" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Visualization & Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* 3D Visualization Placeholder */}
              <div className="glass-card p-4 relative overflow-hidden">
                <h2 className="font-semibold mb-4">Zone Sensitivity Heatmap</h2>
                <div className="aspect-video rounded-lg bg-gradient-to-br from-secondary/50 to-background relative overflow-hidden">
                  <div className="absolute inset-0 grid-pattern opacity-30" />
                  
                  {/* Simulated heatmap zones */}
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-red-500/30 blur-xl" />
                  <div className="absolute top-1/3 right-1/3 w-40 h-40 rounded-full bg-orange-500/30 blur-xl" />
                  <div className="absolute bottom-1/4 left-1/3 w-36 h-36 rounded-full bg-yellow-500/30 blur-xl" />
                  <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-emerald-500/30 blur-xl" />

                  {/* Grid overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-20">
                    {[...Array(10)].map((_, i) => (
                      <line
                        key={`h${i}`}
                        x1="0"
                        y1={`${i * 10}%`}
                        x2="100%"
                        y2={`${i * 10}%`}
                        stroke="hsl(185 94% 48%)"
                        strokeWidth="0.5"
                      />
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <line
                        key={`v${i}`}
                        x1={`${i * 10}%`}
                        y1="0"
                        x2={`${i * 10}%`}
                        y2="100%"
                        stroke="hsl(185 94% 48%)"
                        strokeWidth="0.5"
                      />
                    ))}
                  </svg>

                  <div className="scanner-line" />
                  <div className="map-overlay" />

                  {/* Legend */}
                  <div className="absolute bottom-4 right-4 glass-card p-2">
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-emerald-500" />
                        <span>Low</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-yellow-500" />
                        <span>Medium</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live vs Predicted Comparison */}
              <div className="glass-card p-4">
                <h2 className="font-semibold mb-4">Live vs. Predicted Comparison</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {environmentalState.map((metric, i) => (
                    <div key={i} className="p-4 rounded-lg bg-white/5">
                      <div className="text-sm text-muted-foreground mb-2">{metric.label}</div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground">Current</div>
                          <div className="text-xl font-bold font-mono-data">
                            {metric.current}{metric.unit}
                          </div>
                        </div>
                        <div className="text-center px-4">
                          {metric.change > 0 ? (
                            <TrendingUp className="h-5 w-5 text-red-400 mx-auto" />
                          ) : metric.change < 0 ? (
                            <TrendingDown className="h-5 w-5 text-emerald-400 mx-auto" />
                          ) : (
                            <Minus className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                          <div className={`text-sm font-medium ${
                            metric.change > 0 ? "text-red-400" : metric.change < 0 ? "text-emerald-400" : "text-muted-foreground"
                          }`}>
                            {metric.change > 0 ? "+" : ""}{metric.change}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Predicted</div>
                          <div className="text-xl font-bold font-mono-data text-cyan-400">
                            {metric.predicted}{metric.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="glass-card p-4">
                <h2 className="font-semibold mb-4">Projected Impact</h2>
                <div className="grid grid-cols-3 gap-4">
                  {impactMetrics.map((metric, i) => (
                    <div key={i} className="text-center p-4 rounded-lg bg-white/5">
                      <metric.icon className={`h-8 w-8 mx-auto mb-2 ${metric.color}`} />
                      <div className="text-2xl font-bold font-mono-data">{metric.value}</div>
                      <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
                      <div className="text-sm text-emerald-400">+{metric.change}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button variant="hero" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Action Plan
                </Button>
                <Button variant="glass" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export Impact Report
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DigitalTwin;
