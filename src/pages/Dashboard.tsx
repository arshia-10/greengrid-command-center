import { Link } from "react-router-dom";
import {
  Globe,
  Map,
  Activity,
  FileText,
  Users,
  User,
  ChevronDown,
  AlertTriangle,
  Thermometer,
  Wind,
  Droplets,
  TreePine,
  TrendingUp,
  ArrowRight,
  Zap,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  Trophy,
  MapPin,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { LocationSelector } from "@/components/LocationSelector";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "@/contexts/LocationContext";
import { useEnvironmentalData, useGreenHealthScore } from "@/hooks/useEnvironmental";
import { useActivity } from "@/contexts/ActivityContext";
import { getAQIColor, getAQIBgColor } from "@/lib/weatherService";

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Map, label: "Atlas", href: "/atlas" },
  { icon: Globe, label: "Digital Twin", href: "/digital-twin" },
  { icon: Activity, label: "Simulations", href: "/simulations" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: User, label: "Profile", href: "/profile" },
];

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <>
    {/* Mobile overlay */}
    {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
    
    <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-sidebar border-r border-white/5 z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
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

        {/* Navigation */}
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

        {/* Bottom actions */}
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

const TopBar = ({ onMenuClick, locationSelectorOpen, onLocationSelectorToggle }: { onMenuClick: () => void; locationSelectorOpen: boolean; onLocationSelectorToggle: () => void }) => {
  const { selectedLocation } = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="px-4 lg:px-6 py-3 flex flex-col gap-3">
        {/* Top row */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button onClick={onMenuClick} className="lg:hidden text-muted-foreground hover:text-foreground">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">GreenGrid</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">Live</span>
            </div>

            <NotificationDropdown />

            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <User className="h-4 w-4 text-slate-950" />
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </button>
          </div>
        </div>

        {/* Location selector row */}
        <div className="flex items-center gap-3 -mx-2">
          <button
            onClick={onLocationSelectorToggle}
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 transition-all"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {selectedLocation ? selectedLocation.city : "Select a location..."}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
          </button>
        </div>

        {/* Location selector dropdown */}
        {locationSelectorOpen && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <LocationSelector onClose={onLocationSelectorToggle} compact={false} />
          </div>
        )}
      </div>
    </header>
  );
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locationSelectorOpen, setLocationSelectorOpen] = useState(false);
  const [latestReports, setLatestReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const { selectedLocation } = useLocation();
  const { weather, airQuality, loading: envLoading, refetch: refetchEnv } = useEnvironmentalData();
  const healthScore = useGreenHealthScore();
  const activity = useActivity();
  const { user } = useAuth();

  // Dashboard shows only user-created reports; no static/demo reports here

  // Fetch latest reports for current user only
  useEffect(() => {
    const fetchLatestReports = async () => {
      if (!selectedLocation) {
        setLatestReports([]);
        setReportsLoading(false);
        return;
      }

      if (!user?.uid) {
        setLatestReports([]);
        setReportsLoading(false);
        return;
      }

      setReportsLoading(true);
      setReportsError(null);
      try {
        // Use reportService to load latest user reports only
        const { default: reportService } = await import("@/lib/reportService");
        const userReports = await reportService.getLatestUserReports(user.uid, 3);
        setLatestReports(userReports);
      } catch (error) {
        console.error("Error fetching reports (primary + fallback):", error);
        // On any failure, show an empty list rather than an error banner
        setLatestReports([]);
      } finally {
        setReportsLoading(false);
      }
    };

    fetchLatestReports();
  }, [selectedLocation, user?.uid]);

  const handleRefreshData = () => {
    refetchEnv();
  };

  if (!selectedLocation) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            onMenuClick={() => setSidebarOpen(true)}
            locationSelectorOpen={locationSelectorOpen}
            onLocationSelectorToggle={() => setLocationSelectorOpen(!locationSelectorOpen)}
          />

          <main className="flex-1 p-4 lg:p-6 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <div className="flex justify-center">
                <MapPin className="h-12 w-12 text-primary/40" />
              </div>
              <h2 className="text-2xl font-bold">Welcome to GreenGrid</h2>
              <p className="text-muted-foreground">
                Select a city to start exploring real-time environmental data for your location.
              </p>
              <Button
                onClick={() => setLocationSelectorOpen(true)}
                className="mt-6"
              >
                Select Your Location
              </Button>
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
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          locationSelectorOpen={locationSelectorOpen}
          onLocationSelectorToggle={() => setLocationSelectorOpen(!locationSelectorOpen)}
        />

        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
          {/* Latest Reports Panel */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Latest Reports ({selectedLocation.city})
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/reports" className="flex items-center gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {reportsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-white/5 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : latestReports.length === 0 ? (
                <div className="text-center py-6">
                  <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">You haven't submitted any reports yet.</p>
                  <Button variant="ghost" size="sm" asChild className="mt-3">
                    <Link to="/reports" className="flex items-center gap-1">
                      Create your first report
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                latestReports.map((report: any) => (
                  <div key={report.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{report.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{report.type}</div>
                      {report.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{report.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{report.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Health Score + Metrics Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Green Health Score */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Green Health Score</h2>
                <button
                  onClick={handleRefreshData}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  title="Refresh environmental data"
                >
                  <RefreshCw className={`h-4 w-4 ${envLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {envLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Loading...</p>
                  </div>
                </div>
              ) : healthScore !== null ? (
                <div className="flex items-center justify-center">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="64"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-white/5"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="64"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${64 * 2 * Math.PI * (healthScore / 100)} ${64 * 2 * Math.PI}`}
                        className="drop-shadow-[0_0_10px_hsl(160_84%_39%_/_0.5)]"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(160 84% 39%)" />
                          <stop offset="100%" stopColor="hsl(185 94% 48%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold gradient-text">{healthScore}</span>
                      <span className="text-xs text-muted-foreground">
                        {healthScore >= 75 ? "Good" : healthScore >= 50 ? "Fair" : "Poor"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Unable to calculate health score</p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <span>Based on real environmental data</span>
              </div>
            </div>

            {/* Environmental Metrics */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {/* Temperature */}
              {weather && (
                <div className="glass-card-hover p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      <span className="text-sm text-muted-foreground">Temperature</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{weather.temperature}°C</div>
                  <div className="text-xs text-muted-foreground mt-1">Feels like {weather.feelsLike}°C</div>
                </div>
              )}

              {/* Air Quality */}
              {airQuality && (
                <div className="glass-card-hover p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wind className={`h-5 w-5 ${getAQIColor(airQuality.status)}`} />
                      <span className="text-sm text-muted-foreground">Air Quality</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getAQIBgColor(
                        airQuality.status
                      )} ${getAQIColor(airQuality.status)}`}
                    >
                      {airQuality.status}
                    </span>
                  </div>
                  <div className="text-2xl font-bold">AQI {airQuality.aqi}</div>
                  <div className="text-xs text-muted-foreground mt-1">PM2.5: {airQuality.pm25} µg/m³</div>
                </div>
              )}

              {/* Humidity */}
              {weather && (
                <div className="glass-card-hover p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-cyan-400" />
                      <span className="text-sm text-muted-foreground">Humidity</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{weather.humidity}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Wind: {weather.windSpeed} m/s</div>
                </div>
              )}

              {/* User Activity */}
              <div className="glass-card-hover p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Your Activity</span>
                  </div>
                </div>
                <div className="text-2xl font-bold">{activity.activity.simulationsRun}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Simulations run • {activity.getActiveDaysCount()} active days
                </div>
              </div>
            </div>
          </div>

          {/* Map Preview + Threats */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Mini Map */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Map className="h-4 w-4 text-primary" />
                  Environmental Risk Map
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/atlas" className="flex items-center gap-1">
                    Open Atlas
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-secondary/50 to-background">
                <div className="absolute inset-0 grid-pattern opacity-50" />
                <div className="map-overlay" />
                {/* Location marker */}
                {selectedLocation && (
                  <>
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-primary/60 animate-ping" />
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-primary" />
                  </>
                )}
                <div className="scanner-line" />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Showing data for: {selectedLocation.city}
              </p>
            </div>

            {/* Top Threats */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Environmental Status
                </h2>
              </div>
              <div className="space-y-3">
                {!envLoading && airQuality ? (
                  <>
                    {/* AQI Status */}
                    <div className={`flex items-center gap-4 p-3 rounded-lg ${getAQIBgColor(airQuality.status)}`}>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          airQuality.status === "good"
                            ? "bg-primary"
                            : airQuality.status === "fair"
                            ? "bg-yellow-500"
                            : airQuality.status === "moderate"
                            ? "bg-orange-500"
                            : airQuality.status === "poor"
                            ? "bg-red-500"
                            : "bg-red-700"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Air Quality: {airQuality.status}</div>
                        <div className="text-xs text-muted-foreground">AQI {airQuality.aqi}</div>
                      </div>
                    </div>

                    {/* Temperature Status */}
                    {weather && (
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                        <div className={`w-3 h-3 rounded-full ${weather.temperature > 30 ? "bg-orange-500" : "bg-primary"}`} />
                        <div className="flex-1">
                          <div className="text-sm font-medium">Temperature: {weather.temperature}°C</div>
                          <div className="text-xs text-muted-foreground">
                            {weather.temperature > 30 ? "High heat warning" : "Moderate"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Custom Threats from User Reports */}
                    {latestReports.length > 0 && (
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">Recent Reports</div>
                          <div className="text-xs text-muted-foreground">
                            {latestReports.length} report{latestReports.length > 1 ? "s" : ""} submitted
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <AlertCircle className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading environmental status...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-4">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="glass" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/digital-twin">
                  <Globe className="h-6 w-6 text-primary" />
                  <span>Enter Digital Twin</span>
                </Link>
              </Button>
              <Button variant="glass" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/simulations">
                  <Activity className="h-6 w-6 text-cyan-400" />
                  <span>Run Simulation</span>
                </Link>
              </Button>
              <Button variant="glass" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/reports">
                  <FileText className="h-6 w-6 text-emerald-400" />
                  <span>Generate Report</span>
                </Link>
              </Button>
              <Button variant="glass" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/community">
                  <Zap className="h-6 w-6 text-yellow-400" />
                  <span>Report Issue</span>
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
