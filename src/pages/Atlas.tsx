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
  Trophy,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useLocation } from "@/contexts/LocationContext";
import { useEnvironmentalData } from "@/hooks/useEnvironmental";
import { getAQIColor, getAQIBgColor } from "@/lib/weatherService";
import { LocationSelector } from "@/components/LocationSelector";


const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Atlas", href: "/atlas", active: true },
  { icon: Globe, label: "Digital Twin", href: "/digital-twin" },
  { icon: Activity, label: "Simulations", href: "/simulations" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: User, label: "Profile", href: "/profile" },
];

const mapLayers = [
  { id: "air", label: "Air Quality", icon: Wind, color: "text-blue-400", active: true },
  { id: "heat", label: "Heat Index", icon: Thermometer, color: "text-orange-400", active: false },
  { id: "water", label: "Water Quality", icon: Droplets, color: "text-cyan-400", active: false },
  { id: "green", label: "Green Cover", icon: TreePine, color: "text-emerald-400", active: true },
  { id: "waste", label: "Waste Risk", icon: Trash2, color: "text-yellow-400", active: false },
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
  const [showZonePanel, setShowZonePanel] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [locationSelectorOpen, setLocationSelectorOpen] = useState(false);

  const { selectedLocation } = useLocation();
  const { weather, airQuality, loading: envLoading } = useEnvironmentalData();

  // Fetch reports for selected location
  useEffect(() => {
    const fetchReports = async () => {
      if (!selectedLocation) {
        setReports([]);
        return;
      }

      setReportsLoading(true);
      try {
        const q = query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        const reportsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setReports([]);
      } finally {
        setReportsLoading(false);
      }
    };

    fetchReports();
  }, [selectedLocation]);

  const toggleLayer = (id: string) => {
    setActiveLayers((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  if (!selectedLocation) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  Green Grid Atlas
                </h1>
              </div>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-md">
              <div className="flex justify-center">
                <MapPin className="h-12 w-12 text-primary/40" />
              </div>
              <h2 className="text-2xl font-bold">Select a Location</h2>
              <p className="text-muted-foreground">
                Choose a city to explore environmental data on the interactive map.
              </p>
              <Button onClick={() => setLocationSelectorOpen(true)} className="mt-6">
                Select Location
              </Button>

              {locationSelectorOpen && (
                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg text-left">
                  <LocationSelector onClose={() => setLocationSelectorOpen(false)} compact={false} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-xl">
          <div className="px-4 lg:px-6 py-3 flex flex-col gap-3">
            <div className="flex items-center justify-between h-12">
              <div>
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  Green Grid Atlas - {selectedLocation.city}
                </h1>
                <p className="text-xs text-muted-foreground">Real-time environmental data map</p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocationSelectorOpen(!locationSelectorOpen)}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Change Location
                </Button>
              </div>
            </div>

            {/* Location selector dropdown */}
            {locationSelectorOpen && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <LocationSelector onClose={() => setLocationSelectorOpen(false)} compact={false} />
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden">{/* Map Container */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="absolute inset-0 grid-pattern opacity-30" />

            {/* Simulated map with location marker */}
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

              {/* Location marker (center) */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 rounded-full bg-primary/30 animate-ping" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary shadow-[0_0_20px_hsl(160_84%_39%_)]" />
              </div>

              {/* User reports markers */}
              {reports.slice(0, 5).map((report, index) => {
                const angle = (index / 5) * 2 * Math.PI;
                const distance = 30;
                const x = 50 + distance * Math.cos(angle);
                const y = 50 + distance * Math.sin(angle);

                return (
                  <button
                    key={report.id}
                    onClick={() => setShowZonePanel(true)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className="relative">
                      <div className="w-5 h-5 rounded-full bg-blue-500 shadow-[0_0_15px_hsl(217_91%_60%_)] flex items-center justify-center">
                        <FileText className="h-2.5 w-2.5 text-white" />
                      </div>
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {report.type || "Report"}
                      </div>
                    </div>
                  </button>
                );
              })}
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
                    <h3 className="font-semibold">{selectedLocation.city}</h3>
                    <p className="text-xs text-muted-foreground">Real-time environmental data</p>
                  </div>
                  <button
                    onClick={() => setShowZonePanel(false)}
                    className="p-1 rounded hover:bg-white/10 text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {envLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  </div>
                ) : weather && airQuality ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="p-2 rounded-lg bg-white/5">
                        <div className="text-xs text-muted-foreground mb-1">Temperature</div>
                        <div className="font-semibold text-orange-400">{weather.temperature}°C</div>
                      </div>
                      <div className={`p-2 rounded-lg ${getAQIBgColor(airQuality.status)}`}>
                        <div className="text-xs text-muted-foreground mb-1">Air Quality</div>
                        <div className={`font-semibold ${getAQIColor(airQuality.status)}`}>AQI {airQuality.aqi}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5">
                        <div className="text-xs text-muted-foreground mb-1">Humidity</div>
                        <div className="font-semibold text-cyan-400">{weather.humidity}%</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5">
                        <div className="text-xs text-muted-foreground mb-1">Wind Speed</div>
                        <div className="font-semibold text-blue-400">{weather.windSpeed} m/s</div>
                      </div>
                    </div>

                    <div className="mb-4 p-2 rounded-lg bg-white/5">
                      <div className="text-xs text-muted-foreground mb-1">Air Quality Status</div>
                      <div className={`font-semibold capitalize ${getAQIColor(airQuality.status)}`}>
                        {airQuality.status}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">PM2.5: {airQuality.pm25} µg/m³</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <AlertCircle className="h-6 w-6 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Unable to load environmental data</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="hero" size="sm" className="flex-1" asChild>
                    <Link to="/simulations">Run Simulation</Link>
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1" asChild>
                    <Link to="/reports">View Reports</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Reports Panel */}
          <div className="absolute top-4 right-16 z-20 hidden xl:block">
            <div className="glass-card p-3 w-72">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Recent Reports ({selectedLocation.city})
                </span>
              </div>
              <div className="space-y-2 max-h-48 overflow-auto">
                {reportsLoading ? (
                  <div className="text-center py-4">
                    <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto" />
                  </div>
                ) : reports.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No reports yet</p>
                ) : (
                  reports.slice(0, 5).map((report) => (
                    <div key={report.id} className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{report.name || report.type}</div>
                        <div className="text-xs text-muted-foreground truncate">{report.description}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                <Link to="/reports">View All Reports</Link>
              </Button>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="absolute bottom-4 right-4 z-20 hidden lg:flex gap-2">
            <Button variant="glow" size="sm" asChild>
              <Link to="/simulations" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
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
