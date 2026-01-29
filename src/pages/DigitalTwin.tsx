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
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { useDigitalTwin } from "@/hooks/useDigitalTwin";
import { ZONE_DATA, generateAndDownloadImpactReport, GridCell } from "@/lib/digitalTwinEngine";
import { ZoneImpactGrid } from "@/components/ZoneImpactGrid";

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


const controlConfig = [
  { id: "treeCoverage", label: "Tree Coverage", icon: TreePine, unit: "%", color: "text-emerald-400", max: 100 },
  { id: "trafficDensity", label: "Traffic Density", icon: Car, unit: "%", color: "text-orange-400", max: 100 },
  { id: "rainfallStress", label: "Rainfall Stress", icon: CloudRain, unit: "mm", color: "text-blue-400", max: 100 },
  { id: "industrialOutput", label: "Industrial Output", icon: Factory, unit: "%", color: "text-yellow-400", max: 100 },
  { id: "wasteMismanagement", label: "Waste Mismanagement", icon: Trash2, unit: "%", color: "text-red-400", max: 100 },
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
  const { state, updateControl, runSimulation, reset, isSimulating } = useDigitalTwin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [heatmapIntensity, setHeatmapIntensity] = useState(state.stress.overallStress);

  // Update heatmap intensity when stress changes
  useEffect(() => {
    setHeatmapIntensity(state.stress.overallStress);
  }, [state.stress.overallStress]);

  // Map control key names
  const getControlValue = (key: string) => {
    return state.controls[key as keyof typeof state.controls] || 0;
  };

  // Calculate delta between current and predicted
  const getDelta = (current: number, predicted: number | null, decimals = 1) => {
    if (!predicted) return 0;
    const delta = predicted - current;
    return delta.toFixed(decimals);
  };

  const getChangeIcon = (delta: number | string) => {
    const val = typeof delta === "string" ? parseFloat(delta) : delta;
    if (val > 0.5) return <TrendingUp className="h-5 w-5 text-red-400" />;
    if (val < -0.5) return <TrendingDown className="h-5 w-5 text-emerald-400" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  const getChangeColor = (delta: number | string) => {
    const val = typeof delta === "string" ? parseFloat(delta) : delta;
    if (val > 0.5) return "text-red-400";
    if (val < -0.5) return "text-emerald-400";
    return "text-muted-foreground";
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
                    <h3 className="font-medium">{ZONE_DATA[state.zone]?.name || "Unknown Zone"}</h3>
                    <p className="text-sm text-muted-foreground">Area: {ZONE_DATA[state.zone]?.area || "—"} km²</p>
                    <p className="text-sm text-muted-foreground">Population: {ZONE_DATA[state.zone]?.population.toLocaleString() || "—"}</p>
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
                  {controlConfig.map((control) => (
                    <div key={control.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <control.icon className={`h-4 w-4 ${control.color}`} />
                          <span className="text-sm">{control.label}</span>
                        </div>
                        <span className="text-sm font-mono-data">
                          {getControlValue(control.id)}{control.unit}
                        </span>
                      </div>
                      <Slider
                        value={[getControlValue(control.id)]}
                        onValueChange={(value) => updateControl(control.id as any, value[0])}
                        max={control.max}
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
                  <Button variant="glass" size="sm" onClick={reset}>
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
                  
                  {/* Dynamic heatmap zones — intensity based on stress */}
                  <div
                    className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-xl transition-all duration-500"
                    style={{
                      backgroundColor: `rgba(239, 68, 68, ${Math.max(0.1, heatmapIntensity / 100 * 0.4)})`,
                    }}
                  />
                  <div
                    className="absolute top-1/3 right-1/3 w-40 h-40 rounded-full blur-xl transition-all duration-500"
                    style={{
                      backgroundColor: `rgba(249, 115, 22, ${Math.max(0.1, (heatmapIntensity * 0.8) / 100 * 0.4)})`,
                    }}
                  />
                  <div
                    className="absolute bottom-1/4 left-1/3 w-36 h-36 rounded-full blur-xl transition-all duration-500"
                    style={{
                      backgroundColor: `rgba(234, 179, 8, ${Math.max(0.1, (heatmapIntensity * 0.6) / 100 * 0.4)})`,
                    }}
                  />
                  <div
                    className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-xl transition-all duration-500"
                    style={{
                      backgroundColor: `rgba(34, 197, 94, ${Math.max(0.1, (100 - heatmapIntensity) / 100 * 0.4)})`,
                    }}
                  />

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

                  {/* Overall Stress Indicator */}
                  <div className="absolute top-4 left-4 glass-card p-3">
                    <div className="text-xs text-muted-foreground mb-1">Overall Stress</div>
                    <div className="text-2xl font-bold font-mono-data">{state.stress.overallStress.toFixed(0)}</div>
                    <div className="w-24 h-1 rounded-full bg-white/10 mt-2">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${state.stress.overallStress}%`,
                          backgroundColor: state.stress.overallStress > 70 ? "#ef4444" : state.stress.overallStress > 40 ? "#f59e0b" : "#22c55e",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live vs Predicted Comparison */}
              <div className="glass-card p-4">
                <h2 className="font-semibold mb-4">Live vs. Predicted Comparison</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="text-sm text-muted-foreground mb-2">Air Quality Index</div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Current</div>
                        <div className="text-xl font-bold font-mono-data">{state.live.aqi.toFixed(0)} AQI</div>
                      </div>
                      <div className="text-center px-4">
                        {getChangeIcon(getDelta(state.live.aqi, state.predicted?.aqi))}
                        <div className={`text-sm font-medium ${getChangeColor(getDelta(state.live.aqi, state.predicted?.aqi))}`}>
                          {getDelta(state.live.aqi, state.predicted?.aqi) > 0 ? "+" : ""}{getDelta(state.live.aqi, state.predicted?.aqi)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Predicted</div>
                        <div className="text-xl font-bold font-mono-data text-cyan-400">
                          {state.predicted?.aqi.toFixed(0) || "—"} AQI
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="text-sm text-muted-foreground mb-2">Temperature</div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Current</div>
                        <div className="text-xl font-bold font-mono-data">{state.live.temperature.toFixed(1)}°C</div>
                      </div>
                      <div className="text-center px-4">
                        {getChangeIcon(getDelta(state.live.temperature, state.predicted?.temperature))}
                        <div className={`text-sm font-medium ${getChangeColor(getDelta(state.live.temperature, state.predicted?.temperature))}`}>
                          {getDelta(state.live.temperature, state.predicted?.temperature) > 0 ? "+" : ""}{getDelta(state.live.temperature, state.predicted?.temperature)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Predicted</div>
                        <div className="text-xl font-bold font-mono-data text-cyan-400">
                          {state.predicted?.temperature.toFixed(1) || "—"}°C
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="text-sm text-muted-foreground mb-2">CO₂ Levels</div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Current</div>
                        <div className="text-xl font-bold font-mono-data">{state.live.co2.toFixed(0)} ppm</div>
                      </div>
                      <div className="text-center px-4">
                        {getChangeIcon(getDelta(state.live.co2, state.predicted?.co2, 0))}
                        <div className={`text-sm font-medium ${getChangeColor(getDelta(state.live.co2, state.predicted?.co2, 0))}`}>
                          {getDelta(state.live.co2, state.predicted?.co2, 0) > 0 ? "+" : ""}{getDelta(state.live.co2, state.predicted?.co2, 0)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Predicted</div>
                        <div className="text-xl font-bold font-mono-data text-cyan-400">
                          {state.predicted?.co2.toFixed(0) || "—"} ppm
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="text-sm text-muted-foreground mb-2">Humidity</div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Current</div>
                        <div className="text-xl font-bold font-mono-data">{state.live.humidity.toFixed(0)}%</div>
                      </div>
                      <div className="text-center px-4">
                        {getChangeIcon(getDelta(state.live.humidity, state.predicted?.humidity))}
                        <div className={`text-sm font-medium ${getChangeColor(getDelta(state.live.humidity, state.predicted?.humidity))}`}>
                          {getDelta(state.live.humidity, state.predicted?.humidity) > 0 ? "+" : ""}{getDelta(state.live.humidity, state.predicted?.humidity)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Predicted</div>
                        <div className="text-xl font-bold font-mono-data text-cyan-400">
                          {state.predicted?.humidity.toFixed(0) || "—"}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="glass-card p-4">
                <h2 className="font-semibold mb-4">Projected Impact</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <Leaf className="h-8 w-8 mx-auto mb-2 text-emerald-400" />
                    <div className="text-2xl font-bold font-mono-data">{state.live.sustainabilityIndex.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground mb-1">Sustainability Index</div>
                    <div className="text-sm text-emerald-400">+{(state.predicted?.sustainabilityIndex ? Math.max(0, state.predicted.sustainabilityIndex - state.live.sustainabilityIndex) : 0).toFixed(0)}%</div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-pink-400" />
                    <div className="text-2xl font-bold font-mono-data">{state.live.healthImpactScore.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground mb-1">Health Impact Score</div>
                    <div className="text-sm text-emerald-400">+{(state.predicted?.healthImpactScore ? Math.max(0, state.predicted.healthImpactScore - state.live.healthImpactScore) : 0).toFixed(0)}%</div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-white/5">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold font-mono-data">{state.live.energyEfficiency.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground mb-1">Energy Efficiency</div>
                    <div className="text-sm text-emerald-400">+{(state.predicted?.energyEfficiency ? Math.max(0, state.predicted.energyEfficiency - state.live.energyEfficiency) : 0).toFixed(0)}%</div>
                  </div>
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

              {/* Action Recommendations */}
              {state.recommendations.length > 0 && (
                <div className="glass-card p-4">
                  <h2 className="font-semibold mb-4">AI-Generated Action Plan</h2>
                  <div className="space-y-3">
                    {state.recommendations.map((action, i) => (
                      <div key={i} className="p-3 rounded-lg border border-white/10 bg-white/5">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{action.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{action.title}</h3>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  action.priority === "critical"
                                    ? "bg-red-500/20 text-red-300"
                                    : action.priority === "high"
                                    ? "bg-orange-500/20 text-orange-300"
                                    : "bg-blue-500/20 text-blue-300"
                                }`}
                              >
                                {action.priority}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                            <div className="text-xs text-emerald-400 font-medium">Expected: {action.expectedImpact}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DigitalTwin;
