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
  MessageCircle,
  Camera,
  AlertTriangle,
  HeartHandshake,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Atlas", href: "/atlas" },
  { icon: Globe, label: "Digital Twin", href: "/digital-twin" },
  { icon: Activity, label: "Simulations", href: "/simulations" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Users, label: "Community", href: "/community", active: true },
  { icon: User, label: "Profile", href: "/profile" },
];

const initialReports = [
  { id: 1, type: "Smoke / Pollution", location: "Industrial Belt · Ward 7", time: "5 min ago", status: "Pending" },
  { id: 2, type: "Illegal Dumping", location: "Riverfront · Sector B", time: "32 min ago", status: "Verified" },
  { id: 3, type: "Extreme Heat", location: "Central Plaza", time: "2 hrs ago", status: "In Action" },
];

const Community = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentReports, setRecentReports] = useState(initialReports);
  const [reportText, setReportText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!reportText.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Extract report type from text (simple keyword matching)
    const text = reportText.toLowerCase();
    let reportType = "Environmental Issue";
    if (text.includes("smoke") || text.includes("pollution") || text.includes("air")) {
      reportType = "Smoke / Pollution";
    } else if (text.includes("heat") || text.includes("temperature")) {
      reportType = "Extreme Heat";
    } else if (text.includes("waste") || text.includes("dumping") || text.includes("garbage")) {
      reportType = "Illegal Dumping";
    } else if (text.includes("water") || text.includes("flood")) {
      reportType = "Water Quality Issue";
    }

    // Generate location (could be extracted from text in real app)
    const locations = [
      "Downtown District · Zone A",
      "Industrial Belt · Ward 7",
      "Riverfront · Sector B",
      "Central Plaza",
      "Residential Area · Block 3",
    ];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    const newReport = {
      id: Date.now(),
      type: reportType,
      location: randomLocation,
      time: "just now",
      status: "Pending" as const,
      hasImage: !!selectedImage,
    };

    setRecentReports((prev) => [newReport, ...prev]);
    setReportText("");
    setSelectedImage(null);
    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset success message
    setTimeout(() => setSubmitSuccess(false), 3000);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <>
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-sidebar border-r border-white/5 z-50 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-8 px-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                  <Globe className="h-5 w-5 text-slate-950" />
                </div>
                <span className="text-lg font-bold gradient-text">GreenGrid</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
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

      {/* Main column */}
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
                  <Users className="h-5 w-5 text-primary" />
                  Community & Citizen Signals
                </h1>
                <p className="text-xs text-muted-foreground">
                  Bring citizen reports into the same loop as simulations and actions.
                </p>
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

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto space-y-6">
          <div className="grid lg:grid-cols-[1.4fr,1fr] gap-6">
            {/* Left: new report form + feed */}
            <div className="space-y-6">
              <div className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Submit a new environmental report
                  </h2>
                  <span className="text-xs text-muted-foreground hidden sm:inline-flex">
                    Goes into the same pipeline as alerts and simulations.
                  </span>
                </div>
                
                {submitSuccess && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400">Report submitted successfully!</span>
                  </div>
                )}
                
                <Textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  className="min-h-[96px] bg-secondary/40 border-white/10"
                  placeholder="Example: 'Yahan pe raat bhar smoke hai, bachchon ko problem ho rahi hai…'"
                />
                
                {selectedImage && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-top-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span className="text-xs text-primary flex-1 truncate">{selectedImage.name}</span>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={triggerImageUpload}
                  >
                    <Camera className="h-4 w-4" />
                    {selectedImage ? "Change photo" : "Add photo (optional)"}
                  </Button>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!reportText.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit to Command Center"
                    )}
                  </Button>
                </div>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    Live Citizen Reports
                  </h2>
                  <span className="text-xs text-muted-foreground">Auto-sorted by urgency</span>
                </div>
                <div className="space-y-3 text-sm">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/5 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      <div
                        className={`mt-1 w-2 h-2 rounded-full ${
                          report.status === "Pending"
                            ? "bg-yellow-400"
                            : report.status === "Verified"
                            ? "bg-emerald-400"
                            : "bg-primary"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium truncate">{report.type}</div>
                          {(report as any).hasImage && (
                            <Camera className="h-3 w-3 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{report.location}</div>
                        <div className="text-xs text-muted-foreground mt-1">{report.status} · {report.time}</div>
                      </div>
                      <Button variant="glass" size="sm">
                        Route
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: collaboration card */}
            <div className="glass-card p-4 flex flex-col h-full justify-between">
              <div>
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-emerald-400" />
                  How this connects to your system
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Community signals yahan se Dashboard, Atlas aur Digital Twin tak flow karte hain — taaki jo log
                  ground pe dekh rahe hain, wohi same story data aur simulations mein bhi dikhe.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>High-urgency reports automatically tag critical zones in the Atlas.</li>
                  <li>Verified issues become scenarios in the Simulations lab.</li>
                  <li>Resolved items reflect in your sustainability and response KPIs.</li>
                </ul>
              </div>
              <Button variant="glass" className="mt-6">
                View how this feeds into reports
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Community;

