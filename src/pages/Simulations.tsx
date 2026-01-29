import { Link } from "react-router-dom";
import {
  Globe,
  Map,
  Activity,
  FileText,
  Users,
  User,
  Bell,
  ChevronDown,
  Play,
  Clock,
  CalendarRange,
  Sparkles,
  Thermometer,
  Wind,
  Droplets,
  TreePine,
  Trash2,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Atlas", href: "/atlas" },
  { icon: Globe, label: "Digital Twin", href: "/digital-twin" },
  { icon: Activity, label: "Simulations", href: "/simulations", active: true },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: User, label: "Profile", href: "/profile" },
];

const scenarioControls = [
  { id: "trees", label: "Trees Added", icon: TreePine, unit: "%", color: "text-emerald-400", defaultValue: 15 },
  { id: "traffic", label: "Traffic Reduced", icon: Activity, unit: "%", color: "text-orange-400", defaultValue: 25 },
  { id: "waste", label: "Waste Managed", icon: Trash2, unit: "%", color: "text-yellow-400", defaultValue: 10 },
  { id: "cooling", label: "Cool Roofs", icon: Thermometer, unit: "%", color: "text-cyan-400", defaultValue: 20 },
];

const keyOutcomes = [
  { label: "AQI Improvement", value: "18%", detail: "Better than baseline", icon: Wind },
  { label: "Heat Stress Reduction", value: "2.3°C", detail: "Peak afternoon", icon: Thermometer },
  { label: "Water Stress Relief", value: "12%", detail: "Monsoon season", icon: Droplets },
];

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <>
    {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

    <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-sidebar border-r border-white/5 z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-8 px-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
              <Globe className="h-5 w-5 text-slate-950" />
            </div>
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

const Simulations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [controlValues, setControlValues] = useState<Record<string, number>>(
    Object.fromEntries(scenarioControls.map((c) => [c.id, c.defaultValue]))
  );

  const handleControlChange = (id: string, value: number[]) => {
    setControlValues((prev) => ({ ...prev, [id]: value[0] }));
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
                  <Activity className="h-5 w-5 text-primary" />
                  Scenario Simulations
                </h1>
                <p className="text-xs text-muted-foreground">
                  Test “what-if” interventions before implementing them in the real world.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">Digital Twin Connected</span>
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

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="grid xl:grid-cols-[1.4fr,1fr] gap-6">
            {/* Left: Timeline + results */}
            <div className="space-y-6">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    30-Day Future Timeline
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarRange className="h-4 w-4" />
                    <span>Baseline vs Scenario</span>
                  </div>
                </div>
                {/* Simple schematic chart */}
                <div className="relative h-56 rounded-xl bg-gradient-to-b from-secondary/60 to-background overflow-hidden">
                  <div className="absolute inset-0 grid-pattern opacity-30" />
                  <svg className="absolute inset-0 w-full h-full">
                    {/* Baseline line */}
                    <polyline
                      points="0,120 60,130 120,135 180,138 240,140 300,142 360,145"
                      fill="none"
                      stroke="hsl(0 84% 60%)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    {/* Scenario line */}
                    <polyline
                      points="0,115 60,110 120,108 180,100 240,96 300,94 360,92"
                      fill="none"
                      stroke="hsl(160 84% 39%)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-0.5 bg-red-400 border border-red-400 border-dashed" />
                      <span className="text-muted-foreground">Baseline</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-0.5 bg-emerald-400" />
                      <span className="text-muted-foreground">Scenario</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4">
                <h2 className="font-semibold mb-4">Key Outcomes</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {keyOutcomes.map((outcome) => (
                    <div key={outcome.label} className="p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <outcome.icon className="h-4 w-4 text-primary" />
                        <span className="text-xs text-muted-foreground">{outcome.label}</span>
                      </div>
                      <div className="text-xl font-bold font-mono-data mb-1">{outcome.value}</div>
                      <div className="text-xs text-muted-foreground">{outcome.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Scenario controls */}
            <div className="space-y-6">
              <div className="glass-card p-4">
                <h2 className="font-semibold mb-4">Scenario Setup</h2>
                <div className="space-y-5">
                  {scenarioControls.map((control) => (
                    <div key={control.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <control.icon className={`h-4 w-4 ${control.color}`} />
                          <span className="text-sm">{control.label}</span>
                        </div>
                        <span className="text-sm font-mono-data">
                          {controlValues[control.id]}
                          {control.unit}
                        </span>
                      </div>
                      <Slider
                        value={[controlValues[control.id]]}
                        onValueChange={(value) => handleControlChange(control.id, value)}
                        max={80}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
                <Button variant="hero" className="w-full mt-6">
                  <Play className="h-4 w-4 mr-2" />
                  Run Scenario on Digital Twin
                </Button>
              </div>

              <div className="glass-card p-4">
                <h2 className="font-semibold mb-3">Saved Scenarios</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <div className="flex flex-col">
                      <span className="font-medium">Summer Heat + Trees</span>
                      <span className="text-xs text-muted-foreground">Downtown · Last run: 2 days ago</span>
                    </div>
                    <span className="text-xs text-emerald-400">-2.1°C peak</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <div className="flex flex-col">
                      <span className="font-medium">Traffic Restriction Pilot</span>
                      <span className="text-xs text-muted-foreground">Industrial zone · Last run: 5 days ago</span>
                    </div>
                    <span className="text-xs text-emerald-400">-14% AQI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Simulations;

