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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Map, label: "Atlas", href: "/atlas" },
  { icon: Globe, label: "Digital Twin", href: "/digital-twin" },
  { icon: Activity, label: "Simulations", href: "/simulations" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: User, label: "Profile", href: "/profile" },
];

const alertsData = [
  { type: "critical", message: "High pollution detected in Zone A-7", time: "2 min ago" },
  { type: "warning", message: "Heat index rising in downtown sector", time: "15 min ago" },
  { type: "info", message: "New citizen report submitted", time: "1 hr ago" },
];

const environmentalMetrics = [
  { icon: Thermometer, label: "Temperature", value: "28°C", trend: "+2°C", status: "warning" },
  { icon: Wind, label: "Air Quality", value: "Good", trend: "AQI 42", status: "good" },
  { icon: Droplets, label: "Humidity", value: "65%", trend: "-3%", status: "normal" },
  { icon: TreePine, label: "Green Cover", value: "34%", trend: "+0.5%", status: "good" },
];

const threatsList = [
  { name: "Urban Heat Island - Downtown", severity: "High", score: 78 },
  { name: "Air Pollution - Industrial Zone", severity: "Medium", score: 56 },
  { name: "Water Quality - River District", severity: "Low", score: 32 },
];

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <>
    {/* Mobile overlay */}
    {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
    
    <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-sidebar border-r border-white/5 z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
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

const TopBar = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl">
    <div className="flex items-center justify-between h-full px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-muted-foreground hover:text-foreground">
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-lg font-semibold">Mission Control</h1>
          <p className="text-xs text-muted-foreground">Real-time environmental intelligence</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Live</span>
        </div>
        
        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
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
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
          {/* Alerts Panel */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Live Alerts
              </h2>
              <span className="text-xs text-muted-foreground">Last updated: just now</span>
            </div>
            <div className="space-y-2">
              {alertsData.map((alert, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    alert.type === "critical"
                      ? "bg-destructive/10 border border-destructive/20"
                      : alert.type === "warning"
                      ? "bg-yellow-500/10 border border-yellow-500/20"
                      : "bg-primary/5 border border-primary/10"
                  }`}
                >
                  <AlertTriangle
                    className={`h-4 w-4 flex-shrink-0 ${
                      alert.type === "critical"
                        ? "text-destructive"
                        : alert.type === "warning"
                        ? "text-yellow-500"
                        : "text-primary"
                    }`}
                  />
                  <span className="flex-1 text-sm">{alert.message}</span>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Health Score + Metrics Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Green Health Score */}
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4">City Green Health Score</h2>
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
                      strokeDasharray={`${72 * 2 * Math.PI * 0.72} ${72 * 2 * Math.PI}`}
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
                    <span className="text-4xl font-bold gradient-text">72</span>
                    <span className="text-xs text-muted-foreground">Good</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-primary">
                <TrendingUp className="h-4 w-4" />
                <span>+3 points this week</span>
              </div>
            </div>

            {/* Environmental Metrics */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {environmentalMetrics.map((metric, i) => (
                <div key={i} className="glass-card-hover p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <metric.icon
                        className={`h-5 w-5 ${
                          metric.status === "good"
                            ? "text-primary"
                            : metric.status === "warning"
                            ? "text-yellow-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        metric.status === "good"
                          ? "bg-primary/10 text-primary"
                          : metric.status === "warning"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {metric.trend}
                    </span>
                  </div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </div>
              ))}
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
                {/* Simulated map markers */}
                <div className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-destructive/60 animate-ping" />
                <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-destructive" />
                <div className="absolute top-1/2 right-1/4 w-4 h-4 rounded-full bg-yellow-500/60 animate-ping" />
                <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-yellow-500" />
                <div className="absolute bottom-1/3 left-1/2 w-4 h-4 rounded-full bg-primary/60 animate-ping" />
                <div className="absolute bottom-1/3 left-1/2 w-3 h-3 rounded-full bg-primary" />
                <div className="scanner-line" />
              </div>
            </div>

            {/* Top Threats */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Top Environmental Threats
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/atlas" className="flex items-center gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-3">
                {threatsList.map((threat, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        threat.severity === "High"
                          ? "bg-destructive"
                          : threat.severity === "Medium"
                          ? "bg-yellow-500"
                          : "bg-primary"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{threat.name}</div>
                      <div className="text-xs text-muted-foreground">{threat.severity} priority</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono-data">{threat.score}</div>
                      <div className="text-xs text-muted-foreground">Risk Score</div>
                    </div>
                  </div>
                ))}
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
