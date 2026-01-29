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
  Settings,
  LogOut,
  Menu,
  X,
  Camera,
  Edit2,
  Save,
  Building2,
  MapPin,
  TrendingUp,
  Zap,
  MessageCircle,
  Clock,
  Calendar,
  Award,
  Target,
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
  { icon: User, label: "Profile", href: "/profile", active: true },
];

const roleOptions = [
  { value: "climate-explorer", label: "Climate Explorer", icon: Globe, description: "Explore environmental data and insights" },
  { value: "campus-operator", label: "Campus Operator", icon: Building2, description: "Manage campus sustainability operations" },
  { value: "researcher", label: "Researcher", icon: FileText, description: "Conduct environmental research and analysis" },
];

// Map intent to role (same as in Signup)
const mapIntentToRole = (intent: string): string => {
  const intentMap: Record<string, string> = {
    monitor: "climate-explorer",
    risks: "climate-explorer",
    simulate: "campus-operator",
    learn: "researcher",
  };
  return intentMap[intent] || "climate-explorer";
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

const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("climate-explorer");
  const [region, setRegion] = useState("");
  const [campus, setCampus] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [pan, setPan] = useState("");
  const [saveError, setSaveError] = useState<string>("");

  // Load profile data from auth context
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setRole(profile.role || (profile.intent ? mapIntentToRole(profile.intent) : "climate-explorer"));
      setRegion(profile.region || "");
      setCampus(profile.campus || "");
      setAadhaar(profile.aadhaar || "");
      setPan(profile.pan || "");
    }
  }, [profile]);

  // Mock activity data
  const activityStats = {
    simulationsRun: 12,
    reportsSubmitted: 8,
    communityReports: 15,
    activeDays: 23,
    lastActive: "2 hours ago",
    memberSince: "Jan 2024",
    totalImpact: 47,
  };

  const handleSave = () => {
    const aadhaarDigits = aadhaar.replace(/\D/g, "");
    if (aadhaar && aadhaarDigits.length !== 12) {
      setSaveError("Aadhaar number must be 12 digits.");
      return;
    }
    setSaveError("");
    
    // Update profile in auth context
    updateProfile({
      name,
      email,
      role,
      region,
      campus,
      aadhaar,
      pan,
    });
    
    setIsEditing(false);
  };

  const selectedRole = roleOptions.find((r) => r.value === role) || roleOptions[0];

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const formatPan = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);

  const maskAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 4) return "•••• •••• ••••";
    const last4 = digits.slice(-4);
    return `•••• •••• ${last4}`;
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
                  <User className="h-5 w-5 text-primary" />
                  Profile & Activity
                </h1>
                <p className="text-xs text-muted-foreground">Manage your account and view your environmental impact</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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
        <main className="flex-1 p-4 lg:p-6 overflow-auto space-y-6">
          {/* Profile Header */}
          <div className="glass-card p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center md:items-start">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-slate-950 shadow-lg">
                    {name.split(" ").map((n) => n[0]).join("") || "U"}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary border-2 border-background flex items-center justify-center hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4 text-white" />
                    </button>
                  )}
                </div>
                <div className="mt-4 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                    <span className="text-xs text-muted-foreground">Last active {activityStats.lastActive}</span>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">Profile Information</h2>
                    <p className="text-sm text-muted-foreground">Manage your personal details and preferences</p>
                  </div>
                  <Button
                    variant={isEditing ? "hero" : "glass"}
                    size="sm"
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                {saveError && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-400">
                    {saveError}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2">Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-secondary/40 border-white/10"
                      />
                    ) : (
                      <div className="text-base font-medium">{name || "—"}</div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2">Email Address</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-secondary/40 border-white/10"
                      />
                    ) : (
                      <div className="text-base">{email || "—"}</div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Role
                    </Label>
                    {isEditing ? (
                      <div className="space-y-2">
                        {roleOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setRole(option.value)}
                            className={`w-full p-3 rounded-lg border text-left transition-all ${
                              role === option.value
                                ? "bg-primary/10 border-primary/30 border-2"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <option.icon className={`h-5 w-5 ${role === option.value ? "text-primary" : "text-muted-foreground"}`} />
                              <div>
                                <div className={`font-medium ${role === option.value ? "text-primary" : "text-foreground"}`}>
                                  {option.label}
                                </div>
                                <div className="text-xs text-muted-foreground">{option.description}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <selectedRole.icon className="h-5 w-5 text-primary" />
                        <span className="text-base font-medium">{selectedRole.label}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Region / Campus (Optional)
                    </Label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          placeholder="Enter region or campus name"
                          className="bg-secondary/40 border-white/10 mb-2"
                        />
                        <Input
                          value={campus}
                          onChange={(e) => setCampus(e.target.value)}
                          placeholder="Campus name (optional)"
                          className="bg-secondary/40 border-white/10"
                        />
                      </div>
                    ) : (
                      <div className="text-base">
                        {region || "—"}
                        {campus && ` · ${campus}`}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2">
                      Aadhaar Number <span className="text-red-400">*</span>
                    </Label>
                    {isEditing ? (
                      <>
                        <Input
                          value={aadhaar}
                          inputMode="numeric"
                          placeholder="1234 5678 9012"
                          onChange={(e) => setAadhaar(formatAadhaar(e.target.value))}
                          className="bg-secondary/40 border-white/10"
                        />
                        <div className="mt-1 text-xs text-muted-foreground">
                          Required for verification (demo field).
                        </div>
                      </>
                    ) : (
                      <div className="text-base font-mono-data">{aadhaar ? maskAadhaar(aadhaar) : "—"}</div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2">PAN Number (Optional)</Label>
                    {isEditing ? (
                      <>
                        <Input
                          value={pan}
                          placeholder="ABCDE1234F"
                          onChange={(e) => setPan(formatPan(e.target.value))}
                          className="bg-secondary/40 border-white/10"
                        />
                        <div className="mt-1 text-xs text-muted-foreground">
                          Optional — useful for institutional accounts.
                        </div>
                      </>
                    ) : (
                      <div className="text-base font-mono-data">{pan || "—"}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Environment Dashboard */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Environment Dashboard
              </h2>
              <span className="text-xs text-muted-foreground">Your activity and impact metrics</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Simulations Run */}
              <div className="glass-card p-5 hover:bg-white/5 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <Activity className="h-6 w-6 text-cyan-400" />
                  </div>
                  <Link to="/simulations" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    View all →
                  </Link>
                </div>
                <div className="text-3xl font-bold font-mono-data mb-1">{activityStats.simulationsRun}</div>
                <div className="text-sm text-muted-foreground mb-2">Simulations Run</div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  <span>+3 this month</span>
                </div>
              </div>

              {/* Reports Submitted */}
              <div className="glass-card p-5 hover:bg-white/5 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <FileText className="h-6 w-6 text-emerald-400" />
                  </div>
                  <Link to="/reports" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    View all →
                  </Link>
                </div>
                <div className="text-3xl font-bold font-mono-data mb-1">{activityStats.reportsSubmitted}</div>
                <div className="text-sm text-muted-foreground mb-2">Reports Submitted</div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  <span>+2 this week</span>
                </div>
              </div>

              {/* Community Reports */}
              <div className="glass-card p-5 hover:bg-white/5 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <Link to="/community" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    View all →
                  </Link>
                </div>
                <div className="text-3xl font-bold font-mono-data mb-1">{activityStats.communityReports}</div>
                <div className="text-sm text-muted-foreground mb-2">Community Reports</div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  <span>+5 this week</span>
                </div>
              </div>

              {/* Active Days */}
              <div className="glass-card p-5 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-mono-data mb-1">{activityStats.activeDays}</div>
                <div className="text-sm text-muted-foreground mb-2">Active Days This Month</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Member since {activityStats.memberSince}</span>
                </div>
              </div>

              {/* Total Impact */}
              <div className="glass-card p-5 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-mono-data mb-1">{activityStats.totalImpact}</div>
                <div className="text-sm text-muted-foreground mb-2">Total Impact Score</div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <Zap className="h-3 w-3" />
                  <span>High engagement</span>
                </div>
              </div>

              {/* Activity Streak */}
              <div className="glass-card p-5 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-mono-data mb-1">7</div>
                <div className="text-sm text-muted-foreground mb-2">Day Streak</div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <Zap className="h-3 w-3" />
                  <span>Keep it up!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Activity Summary
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-xs text-muted-foreground mb-1">Most Active Feature</div>
                <div className="font-medium">Community Reports</div>
                <div className="text-xs text-muted-foreground mt-1">15 submissions this month</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-xs text-muted-foreground mb-1">Peak Activity</div>
                <div className="font-medium">Tuesday, 2:00 PM</div>
                <div className="text-xs text-muted-foreground mt-1">Most productive time</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <div className="text-xs text-muted-foreground mb-1">Engagement Level</div>
                <div className="font-medium text-emerald-400">Highly Active</div>
                <div className="text-xs text-muted-foreground mt-1">Top 15% of users</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
