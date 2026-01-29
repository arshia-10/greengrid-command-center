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
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  MapPin,
  Radio,
  Mail,
  Shield,
  Moon,
  Sun,
  Download,
  Eye,
  Save,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Atlas", href: "/atlas" },
  { icon: Globe, label: "Digital Twin", href: "/digital-twin" },
  { icon: Activity, label: "Simulations", href: "/simulations" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: UserIcon, label: "Profile", href: "/profile" },
];

const roleLabels: Record<string, string> = {
  "climate-explorer": "Climate Explorer",
  "campus-operator": "Campus Operator",
  researcher: "Researcher",
};

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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
            >
              <link.icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="space-y-1 pt-4 border-t border-white/5">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20"
          >
            <SettingsIcon className="h-5 w-5" />
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

type SettingsTab = "profile" | "monitoring" | "alerts" | "notifications" | "privacy" | "data";

const Settings = () => {
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Monitoring state
  const [monitoringMode, setMonitoringMode] = useState<"primary" | "radius">("primary");
  const [primaryLat, setPrimaryLat] = useState("");
  const [primaryLng, setPrimaryLng] = useState("");
  const [radiusKm, setRadiusKm] = useState("5");
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [monitoringSaved, setMonitoringSaved] = useState(false);

  // Alerts state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [digestFrequency, setDigestFrequency] = useState<"realtime" | "daily" | "weekly">("realtime");
  const [alertsSaved, setAlertsSaved] = useState(false);

  // Notifications & Privacy
  const [pushEnabled, setPushEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [exportRequested, setExportRequested] = useState(false);

  const settingsTabs: { id: SettingsTab; label: string; icon: typeof UserIcon }[] = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "monitoring", label: "Monitoring", icon: MapPin },
    { id: "alerts", label: "Alerts & Notifications", icon: Bell },
    { id: "notifications", label: "Notification Preferences", icon: Mail },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "data", label: "Data & Export", icon: Download },
  ];

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
          setPrimaryLat(position.coords.latitude.toFixed(6));
          setPrimaryLng(position.coords.longitude.toFixed(6));
          setIsGettingLocation(false);
        },
        () => setIsGettingLocation(false)
      );
    } else {
      setIsGettingLocation(false);
    }
  };

  const handleSaveMonitoring = () => {
    setMonitoringSaved(true);
    setTimeout(() => setMonitoringSaved(false), 3000);
  };

  const handleSaveAlerts = () => {
    setAlertsSaved(true);
    setTimeout(() => setAlertsSaved(false), 3000);
  };

  const handleExportData = () => {
    setExportRequested(true);
    setTimeout(() => setExportRequested(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                  Settings
                </h1>
                <p className="text-xs text-muted-foreground">Manage your account, monitoring, and alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-slate-950" />
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Mobile: Tab pills */}
          <div className="md:hidden flex gap-2 p-4 overflow-x-auto border-b border-white/5 bg-sidebar/30">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id ? "bg-primary/10 text-primary border border-primary/20" : "bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Left: Settings sub-nav (desktop) */}
          <nav className="hidden md:flex w-56 flex-shrink-0 flex-col border-r border-white/5 bg-sidebar/50 p-4 space-y-1">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Right: Content */}
          <div className="flex-1 p-4 lg:p-6 overflow-auto">
            {/* Profile */}
            {activeTab === "profile" && (
              <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Profile Summary</h2>
                  <p className="text-sm text-muted-foreground">Your account details from sign-up</p>
                </div>
                <div className="glass-card p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-slate-950">
                      {(profile?.name || "U").split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{profile?.name || "—"}</div>
                      <div className="text-sm text-muted-foreground">{profile?.email || "—"}</div>
                      <div className="mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary w-fit">
                        {profile?.role ? roleLabels[profile.role] || profile.role : "—"}
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <div className="font-medium mt-1">{profile?.name || "—"}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <div className="font-medium mt-1">{profile?.email || "—"}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Role</Label>
                      <div className="font-medium mt-1">{profile?.role ? roleLabels[profile.role] : "—"}</div>
                    </div>
                  </div>
                  <Button variant="glass" size="sm" asChild>
                    <Link to="/profile">Edit full profile</Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Monitoring */}
            {activeTab === "monitoring" && (
              <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Monitoring Area</h2>
                  <p className="text-sm text-muted-foreground">Set primary location or a radius around you for environmental alerts</p>
                </div>

                <div className="glass-card p-6 space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Monitoring mode</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setMonitoringMode("primary")}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          monitoringMode === "primary"
                            ? "bg-primary/10 border-primary/30"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <MapPin className={`h-5 w-5 mb-2 ${monitoringMode === "primary" ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="font-medium">Primary area</div>
                        <div className="text-xs text-muted-foreground">Single GPS point</div>
                      </button>
                      <button
                        onClick={() => setMonitoringMode("radius")}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          monitoringMode === "radius"
                            ? "bg-primary/10 border-primary/30"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <Radio className={`h-5 w-5 mb-2 ${monitoringMode === "radius" ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="font-medium">Nearby radius</div>
                        <div className="text-xs text-muted-foreground">Area around a point</div>
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm mb-2 block">Latitude</Label>
                      <Input
                        value={primaryLat}
                        onChange={(e) => setPrimaryLat(e.target.value)}
                        placeholder="e.g. 28.6139"
                        className="bg-secondary/40 border-white/10"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block">Longitude</Label>
                      <Input
                        value={primaryLng}
                        onChange={(e) => setPrimaryLng(e.target.value)}
                        placeholder="e.g. 77.2090"
                        className="bg-secondary/40 border-white/10"
                      />
                    </div>
                  </div>

                  {monitoringMode === "radius" && (
                    <div>
                      <Label className="text-sm mb-2 block">Radius (km)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={radiusKm}
                        onChange={(e) => setRadiusKm(e.target.value)}
                        className="bg-secondary/40 border-white/10 max-w-[120px]"
                      />
                    </div>
                  )}

                  <Button variant="glass" size="sm" onClick={getCurrentLocation} disabled={isGettingLocation}>
                    {isGettingLocation ? "Getting location…" : <><Navigation className="h-4 w-4 mr-2" /> Use current GPS</>}
                  </Button>

                  {gpsCoords && (
                    <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 text-sm">
                      <div className="font-medium text-primary mb-1">Current GPS</div>
                      <div className="font-mono text-muted-foreground">{gpsCoords.lat.toFixed(6)}, {gpsCoords.lng.toFixed(6)}</div>
                    </div>
                  )}

                  <div className="rounded-xl overflow-hidden border border-white/10 bg-secondary/30 min-h-[280px] w-full">
                    {primaryLat && primaryLng && !Number.isNaN(parseFloat(primaryLat)) && !Number.isNaN(parseFloat(primaryLng)) ? (
                      <iframe
                        title="Monitoring area map"
                        className="w-full h-full min-h-[280px] aspect-video border-0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(primaryLng) - 0.05}%2C${Number(primaryLat) - 0.05}%2C${Number(primaryLng) + 0.05}%2C${Number(primaryLat) + 0.05}&layer=mapnik&marker=${encodeURIComponent(primaryLat)}%2C${encodeURIComponent(primaryLng)}`}
                      />
                    ) : (
                      <div className="aspect-video min-h-[280px] flex items-center justify-center">
                        <div className="text-center p-4">
                          <Map className="h-12 w-12 text-primary mx-auto mb-2 opacity-80" />
                          <p className="text-sm text-muted-foreground">Map preview for selected location</p>
                          <p className="text-xs text-muted-foreground mt-1">Set coordinates above or use &quot;Use current GPS&quot; to see the map</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button variant="hero" onClick={handleSaveMonitoring}>
                    <Save className="h-4 w-4 mr-2" />
                    Save monitoring area
                  </Button>
                  {monitoringSaved && (
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Settings saved.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Alerts & Notifications */}
            {activeTab === "alerts" && (
              <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Alerts & Notifications</h2>
                  <p className="text-sm text-muted-foreground">Receive alerts via email and in-app notifications</p>
                </div>

                <div className="glass-card p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Email alerts
                      </div>
                      <div className="text-sm text-muted-foreground">Get critical environmental alerts by email</div>
                    </div>
                    <button
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${emailAlerts ? "bg-primary" : "bg-white/10"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${emailAlerts ? "left-6" : "left-1"}`}></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        Critical alerts only
                      </div>
                      <div className="text-sm text-muted-foreground">Only high-severity events</div>
                    </div>
                    <button
                      onClick={() => setCriticalOnly(!criticalOnly)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${criticalOnly ? "bg-primary" : "bg-white/10"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${criticalOnly ? "left-6" : "left-1"}`}></span>
                    </button>
                  </div>

                  <div>
                    <Label className="text-sm mb-2 block">Email digest frequency</Label>
                    <div className="flex gap-2 flex-wrap">
                      {(["realtime", "daily", "weekly"] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => setDigestFrequency(f)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            digestFrequency === f ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/5 border border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {f === "realtime" ? "Real-time" : f === "daily" ? "Daily digest" : "Weekly digest"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button variant="hero" onClick={handleSaveAlerts}>
                    <Save className="h-4 w-4 mr-2" />
                    Save alert preferences
                  </Button>
                  {alertsSaved && (
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Preferences saved.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notification Preferences */}
            {activeTab === "notifications" && (
              <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">Control how you receive updates</p>
                </div>
                <div className="glass-card p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Push notifications</div>
                      <div className="text-sm text-muted-foreground">Browser or app push</div>
                    </div>
                    <button
                      onClick={() => setPushEnabled(!pushEnabled)}
                      className={`relative w-11 h-6 rounded-full ${pushEnabled ? "bg-primary" : "bg-white/10"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white ${pushEnabled ? "left-6" : "left-1"}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium flex items-center gap-2">Theme</div>
                      <div className="text-sm text-muted-foreground">Dark / Light</div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                    >
                      {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      <span className="text-sm">{darkMode ? "Dark" : "Light"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Security */}
            {activeTab === "privacy" && (
              <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Privacy & Security</h2>
                  <p className="text-sm text-muted-foreground">Data and account security</p>
                </div>
                <div className="glass-card p-6 space-y-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <Shield className="h-8 w-8 text-primary" />
                    <div>
                      <div className="font-medium">Your data is encrypted</div>
                      <div className="text-sm text-muted-foreground">We use industry-standard encryption for profile and location data.</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Show activity to operators
                      </div>
                      <div className="text-sm text-muted-foreground">Allow campus/region admins to see your report activity</div>
                    </div>
                    <button className="relative w-11 h-6 rounded-full bg-primary">
                      <span className="absolute top-1 left-6 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Data & Export */}
            {activeTab === "data" && (
              <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Data & Export</h2>
                  <p className="text-sm text-muted-foreground">Download your data or reports</p>
                </div>
                <div className="glass-card p-6 space-y-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                    <Download className="h-8 w-8 text-primary" />
                    <div>
                      <div className="font-medium">Export my data</div>
                      <div className="text-sm text-muted-foreground">Download profile, reports, and activity as JSON or CSV.</div>
                    </div>
                  </div>
                  <Button variant="hero" onClick={handleExportData} disabled={exportRequested}>
                    {exportRequested ? (
                      <>Preparing download…</>
                    ) : (
                      <><Download className="h-4 w-4 mr-2" /> Export data</>
                    )}
                  </Button>
                  {exportRequested && (
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Export started. Check your downloads.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
