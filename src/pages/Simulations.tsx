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
  Trophy,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";
import { runSimulation as runSim, saveScenarioToStorage, loadSavedScenarios } from "@/lib/simulationEngine";
import { registerScenario, type ScenarioInput as ScenarioServiceInput } from "@/lib/scenarioService";
import { useCredits } from "@/contexts/CreditsContext";
import { useActivity } from "@/contexts/ActivityContext";
import { toast } from "sonner";

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Atlas", href: "/atlas" },
  { icon: Globe, label: "Digital Twin", href: "/digital-twin" },
  { icon: Activity, label: "Simulations", href: "/simulations", active: true },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
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

const Simulations = () => {
  const { addCredit } = useCredits();
  const { incrementSimulations } = useActivity();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [controlValues, setControlValues] = useState<Record<string, number>>(
    Object.fromEntries(scenarioControls.map((c) => [c.id, c.defaultValue]))
  );

  // Simulation data & state
  const [days, setDays] = useState<string[]>([]);
  const [baselineData, setBaselineData] = useState<number[]>([]);
  const [scenarioData, setScenarioData] = useState<number[]>([]);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [outcomes, setOutcomes] = useState({ aqiImprovementPct: 0, heatReductionC: 0, waterStressReliefPct: 0 });
  const [saved, setSaved] = useState(loadSavedScenarios());
  const animRef = useRef<number | null>(null);

  const handleControlChange = (id: string, value: number[]) => {
    setControlValues((prev) => ({ ...prev, [id]: value[0] }));
  };

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (animRef.current) window.clearInterval(animRef.current);
    };
  }, []);

  const handleRun = () => {
    setIsRunningSim(true);
    const input = {
      treesAdded: controlValues.trees,
      trafficReduced: controlValues.traffic,
      wasteManaged: controlValues.waste,
      coolRoofs: controlValues.cooling,
    };

    // Check scenario eligibility for credits
    // NOTE: Credits are NOT awarded here - only when user exports/submits meaningful outcomes
    const scenarioInput: ScenarioServiceInput = {
      zone: "downtown-district", // Default zone for now
      trees: input.treesAdded,
      traffic: input.trafficReduced,
      waste: input.wasteManaged,
      cooling: input.coolRoofs,
    };

    const scenarioCheck = registerScenario(scenarioInput);

    const result = runSim(input, 30);

    setDays(result.days);
    setBaselineData(result.baseline);
    setScenarioData(result.scenario);
    setDisplayedCount(1);
    setOutcomes(result.outcomes);

    // Show feedback based on scenario uniqueness
    if (scenarioCheck.isDuplicate) {
      toast.info("No new impact detected. Try a different intervention.");
    } else if (!scenarioCheck.creditEligible) {
      toast.info("You can still simulate, but credits won't be awarded today (3 limit reached).");
    } else {
      toast.info("New scenario detected — save or export to claim impact credit.");
    }

    // animate reveal over the 30 points
    let i = 1;
    if (animRef.current) window.clearInterval(animRef.current);
    animRef.current = window.setInterval(() => {
      i += 1;
      setDisplayedCount(i);
      if (i >= result.days.length) {
        if (animRef.current) window.clearInterval(animRef.current);
        setIsRunningSim(false);
      }
    }, 60);

    incrementSimulations();
  };

  const handleSave = (name?: string) => {
    if (!days.length || !scenarioData.length) return;
    
    // Award credit for saving a unique scenario
    const scenarioInput: ScenarioServiceInput = {
      zone: "downtown-district",
      trees: controlValues.trees,
      traffic: controlValues.traffic,
      waste: controlValues.waste,
      cooling: controlValues.cooling,
    };
    const scenarioCheck = registerScenario(scenarioInput, true); // true = will generate action plan via save

    const entry = saveScenarioToStorage({ name, input: {
      treesAdded: controlValues.trees,
      trafficReduced: controlValues.traffic,
      wasteManaged: controlValues.waste,
      coolRoofs: controlValues.cooling,
    }, result: { days, baseline: baselineData, scenario: scenarioData, outcomes } });
    setSaved((s) => [entry, ...s].slice(0, 20));
    
    // Award credit if scenario is unique and eligible
    if (scenarioCheck.creditEligible) {
      addCredit("scenario_save");
      toast.success("Scenario saved — +1 impact credit awarded for unique intervention.");
    } else {
      toast.success("Scenario saved");
    }
  };

  const handleLoadSaved = (id: string) => {
    const item = loadSavedScenarios().find((s) => s.id === id);
    if (!item) return;
    // restore controls
    setControlValues({
      trees: item.input.treesAdded,
      traffic: item.input.trafficReduced,
      waste: item.input.wasteManaged,
      cooling: item.input.coolRoofs,
    } as Record<string, number>);
    // restore result (show instantly)
    setDays(item.result.days);
    setBaselineData(item.result.baseline);
    setScenarioData(item.result.scenario);
    setDisplayedCount(item.result.days.length);
    setOutcomes(item.result.outcomes);
    toast.success("Scenario restored");
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
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 140" preserveAspectRatio="none">
                    {/* dynamic polylines built from arrays */}
                    {baselineData.length > 0 && (
                      <polyline
                        points={(() => {
                          const pts: string[] = [];
                          const len = Math.max(1, baselineData.length);
                          const visible = Math.max(1, Math.min(displayedCount, len));
                          const min = Math.min(...baselineData, ...(scenarioData.length ? scenarioData : []));
                          const max = Math.max(...baselineData, ...(scenarioData.length ? scenarioData : []));
                          const w = 580; // padding
                          const h = 100;
                          for (let i = 0; i < visible; i++) {
                            const x = (i / Math.max(1, len - 1)) * w + 10;
                            const v = baselineData[i] as number;
                            const y = max === min ? 20 + h / 2 : 20 + h - ((v - min) / (max - min)) * h;
                            pts.push(`${x},${y}`);
                          }
                          return pts.join(" ");
                        })()}
                        fill="none"
                        stroke="hsl(0 84% 60%)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    )}

                    {scenarioData.length > 0 && (
                      <polyline
                        points={(() => {
                          const pts: string[] = [];
                          const len = Math.max(1, scenarioData.length);
                          const visible = Math.max(1, Math.min(displayedCount, len));
                          const min = Math.min(...scenarioData, ...(baselineData.length ? baselineData : []));
                          const max = Math.max(...scenarioData, ...(baselineData.length ? baselineData : []));
                          const w = 580;
                          const h = 100;
                          for (let i = 0; i < visible; i++) {
                            const x = (i / Math.max(1, len - 1)) * w + 10;
                            const v = scenarioData[i] as number;
                            const y = max === min ? 20 + h / 2 : 20 + h - ((v - min) / (max - min)) * h;
                            pts.push(`${x},${y}`);
                          }
                          return pts.join(" ");
                        })()}
                        fill="none"
                        stroke="hsl(160 84% 39%)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    )}
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
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">AQI Improvement</span>
                    </div>
                    <div className="text-xl font-bold font-mono-data mb-1">{outcomes.aqiImprovementPct}%</div>
                    <div className="text-xs text-muted-foreground">Estimated improvement vs baseline</div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Heat Stress Reduction</span>
                    </div>
                    <div className="text-xl font-bold font-mono-data mb-1">{outcomes.heatReductionC}°C</div>
                    <div className="text-xs text-muted-foreground">Peak afternoon reduction</div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Water Stress Relief</span>
                    </div>
                    <div className="text-xl font-bold font-mono-data mb-1">{outcomes.waterStressReliefPct}%</div>
                    <div className="text-xs text-muted-foreground">Projected relief over baseline</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Scenario controls */}
            <div className="space-y-6">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Scenario Setup</h2>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-help" title="Credits are awarded for unique, impactful actions — not repeated simulations. Save scenarios to claim impact credit.">
                    <Info className="h-4 w-4" />
                  </div>
                </div>
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
                <Button variant="hero" className="w-full mt-6" onClick={handleRun}>
                  <Play className="h-4 w-4 mr-2" />
                  Run Scenario on Digital Twin
                </Button>

                {days.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    <button
                      className="flex-1 p-2 rounded-lg bg-white/5 text-sm"
                      onClick={() => handleSave()}
                    >
                      Save Scenario
                    </button>
                    <button
                      className="p-2 rounded-lg bg-white/5 text-sm"
                      onClick={() => {
                        setDays([]);
                        setBaselineData([]);
                        setScenarioData([]);
                        setDisplayedCount(0);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <div className="glass-card p-4">
                <h2 className="font-semibold mb-3">Saved Scenarios</h2>
                <div className="space-y-2 text-sm">
                  {saved.length === 0 && (
                    <div className="text-xs text-muted-foreground">No saved scenarios yet. Run a scenario and click Save.</div>
                  )}
                  {saved.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div className="flex flex-col">
                        <button className="text-left" onClick={() => handleLoadSaved(s.id)}>
                          <span className="font-medium">{s.name}</span>
                          <div className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleString()}</div>
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-emerald-400">{s.result.outcomes.heatReductionC}°C</div>
                        <div className="text-xs text-muted-foreground">{s.result.outcomes.aqiImprovementPct}% AQI</div>
                      </div>
                    </div>
                  ))}
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

