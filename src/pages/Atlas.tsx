import { Link } from "react-router-dom";
import {
  Globe,
  Map,
  Activity,
  FileText,
  Users,
  User,
  ChevronDown,
  Layers,
  Wind,
  Thermometer,
  Droplets,
  TreePine,
  Trash2,
  Search,
  ZoomIn,
  ZoomOut,
  Locate,
  Filter,
  AlertTriangle,
  TrendingUp,
  Camera,
  ArrowRight,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Atlas", href: "/atlas", active: true },
  { icon: Globe, label: "Digital Twin", href: "/digital-twin" },
  { icon: Activity, label: "Simulations", href: "/simulations" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: User, label: "Profile", href: "/profile" },
];

const mapLayers = [
  { id: "air", label: "Air Quality", icon: Wind, color: "text-blue-400", active: true },
  { id: "heat", label: "Heat Index", icon: Thermometer, color: "text-orange-400", active: false },
  { id: "water", label: "Water Quality", icon: Droplets, color: "text-cyan-400", active: false },
  { id: "green", label: "Green Cover", icon: TreePine, color: "text-emerald-400", active: true },
  { id: "waste", label: "Waste Risk", icon: Trash2, color: "text-yellow-400", active: false },
];

const zoneData = {
  name: "Downtown District",
  riskScore: 67,
  status: "Moderate Risk",
  metrics: [
    { label: "Air Quality Index", value: "72", status: "moderate" },
    { label: "Temperature", value: "32°C", status: "high" },
    { label: "Green Cover", value: "18%", status: "low" },
    { label: "Water Quality", value: "Good", status: "good" },
  ],
};

const citizenReports = [
  { id: 1, type: "Pollution", location: "Main Street", time: "10 min ago", status: "Pending" },
  { id: 2, type: "Illegal Dumping", location: "River Park", time: "1 hr ago", status: "Verified" },
  { id: 3, type: "Heat Hazard", location: "Central Plaza", time: "2 hrs ago", status: "Resolved" },
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

const Atlas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLayers, setActiveLayers] = useState(["air", "green"]);
  const [showZonePanel, setShowZonePanel] = useState(true);

  const toggleLayer = (id: string) => {
    setActiveLayers((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
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
                  <Map className="h-5 w-5 text-primary" />
                  Green Grid Atlas
                </h1>
                <p className="text-xs text-muted-foreground">Multi-layer environmental intelligence map</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations..."
                  className="pl-10 w-64 bg-secondary/50 border-white/10"
                />
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

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden">
          {/* Map Container */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            
            {/* Simulated map with data points */}
            <div className="absolute inset-0">
              {/* Grid overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                {[...Array(20)].map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="0"
                    y1={`${i * 5}%`}
                    x2="100%"
                    y2={`${i * 5}%`}
                    stroke="hsl(160 84% 39%)"
                    strokeWidth="0.5"
                  />
                ))}
                {[...Array(20)].map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={`${i * 5}%`}
                    y1="0"
                    x2={`${i * 5}%`}
                    y2="100%"
                    stroke="hsl(160 84% 39%)"
                    strokeWidth="0.5"
                  />
                ))}
              </svg>

              {/* Data zones */}
              <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full bg-orange-500/20 blur-2xl animate-pulse" />
              <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />
              <div className="absolute bottom-1/3 left-1/2 w-24 h-24 rounded-full bg-blue-500/20 blur-2xl animate-pulse" />

              {/* Markers */}
              <button
                onClick={() => setShowZonePanel(true)}
                className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2 group"
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-orange-500 shadow-[0_0_20px_hsl(25_95%_53%_/_0.6)] flex items-center justify-center">
                    <AlertTriangle className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Downtown District
                  </div>
                </div>
              </button>

              <button className="absolute top-1/2 right-1/3 transform -translate-x-1/2 -translate-y-1/2 group">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 shadow-[0_0_20px_hsl(160_84%_39%_/_0.6)] flex items-center justify-center">
                    <TreePine className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Central Park
                  </div>
                </div>
              </button>

              <button className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-blue-500 shadow-[0_0_20px_hsl(217_91%_60%_/_0.6)] flex items-center justify-center">
                    <Droplets className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    River District
                  </div>
                </div>
              </button>
            </div>

            {/* Scanner effect */}
            <div className="scanner-line" />
            <div className="map-overlay" />
          </div>

          {/* Layer Controls */}
          <div className="absolute top-4 left-4 z-20">
            <div className="glass-card p-3">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Map Layers</span>
              </div>
              <div className="space-y-2">
                {mapLayers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => toggleLayer(layer.id)}
                    className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all ${
                      activeLayers.includes(layer.id)
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-white/5"
                    }`}
                  >
                    <layer.icon className={`h-4 w-4 ${layer.color}`} />
                    <span>{layer.label}</span>
                    <div
                      className={`ml-auto w-2 h-2 rounded-full ${
                        activeLayers.includes(layer.id) ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <div className="glass-card p-1 flex flex-col gap-1">
              <button className="p-2 rounded hover:bg-white/10 transition-colors">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button className="p-2 rounded hover:bg-white/10 transition-colors">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button className="p-2 rounded hover:bg-white/10 transition-colors">
                <Locate className="h-4 w-4" />
              </button>
              <button className="p-2 rounded hover:bg-white/10 transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Zone Detail Panel */}
          {showZonePanel && (
            <div className="absolute bottom-4 left-4 right-4 lg:left-4 lg:right-auto lg:w-96 z-20">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{zoneData.name}</h3>
                    <p className="text-xs text-muted-foreground">{zoneData.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-400 font-mono-data">{zoneData.riskScore}</div>
                      <div className="text-xs text-muted-foreground">Risk Score</div>
                    </div>
                    <button
                      onClick={() => setShowZonePanel(false)}
                      className="p-1 rounded hover:bg-white/10 text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {zoneData.metrics.map((metric, i) => (
                    <div key={i} className="p-2 rounded-lg bg-white/5">
                      <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
                      <div
                        className={`font-semibold ${
                          metric.status === "good"
                            ? "text-emerald-400"
                            : metric.status === "moderate"
                            ? "text-yellow-400"
                            : metric.status === "high"
                            ? "text-orange-400"
                            : "text-destructive"
                        }`}
                      >
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="hero" size="sm" className="flex-1" asChild>
                    <Link to="/digital-twin">
                      Enter Digital Twin
                    </Link>
                  </Button>
                  <Button variant="glass" size="sm" className="flex-1">
                    Run Prediction
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Citizen Reports Panel */}
          <div className="absolute top-4 right-16 z-20 hidden xl:block">
            <div className="glass-card p-3 w-72">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Camera className="h-4 w-4 text-primary" />
                  Citizen Reports
                </span>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-auto">
                {citizenReports.map((report) => (
                  <div key={report.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        report.status === "Pending"
                          ? "bg-yellow-500"
                          : report.status === "Verified"
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{report.type}</div>
                      <div className="text-xs text-muted-foreground truncate">{report.location}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">{report.time}</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-2">
                Submit Report
              </Button>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="absolute bottom-4 right-4 z-20 hidden lg:flex gap-2">
            <Button variant="glow" size="sm" asChild>
              <Link to="/digital-twin" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Enter Digital Twin
              </Link>
            </Button>
            <Button variant="glass" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Run Prediction
            </Button>
            <Button variant="glass" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Atlas;
