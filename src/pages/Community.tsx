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
  MapPin,
  Clock,
  Gauge,
  ChevronRight,
  Navigation,
  Eye,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";

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
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [observation, setObservation] = useState("");
  const [location, setLocation] = useState("");
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [selectedReportForRoute, setSelectedReportForRoute] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get GPS location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          // Auto-fill location with coordinates
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setIsGettingLocation(false);
        },
        () => {
          setIsGettingLocation(false);
          // Fallback to manual entry
          setLocation("Location access denied - please enter manually");
        }
      );
    } else {
      setIsGettingLocation(false);
      setLocation("GPS not available - please enter manually");
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !observation.trim()) return;
    if (currentStep === 2 && !location.trim()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Extract report type from observation
    const text = observation.toLowerCase();
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

    const newReport = {
      id: Date.now(),
      type: reportType,
      location: location,
      time: "just now",
      status: "Pending" as const,
      hasImage: !!selectedImage,
      severity: severity,
      coordinates: gpsCoordinates,
    };

    setRecentReports((prev) => [newReport, ...prev]);
    
    // Reset form
    setCurrentStep(1);
    setObservation("");
    setLocation("");
    setGpsCoordinates(null);
    setSeverity("medium");
    setSelectedImage(null);
    setIsSubmitting(false);
    setSubmitSuccess(true);

    setTimeout(() => setSubmitSuccess(false), 3000);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRouteClick = (reportId: number) => {
    setSelectedReportForRoute(reportId);
    setShowRouteMap(true);
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
            {/* Left: Multi-step form + feed */}
            <div className="space-y-6">
              <div className="glass-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Submit Environmental Report
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    Step {currentStep} of 3
                  </span>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 h-1.5 rounded-full transition-colors ${
                        step <= currentStep ? "bg-primary" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                {submitSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">Report submitted successfully!</span>
                  </div>
                )}

                {/* Step 1: Local Observation */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                    <div>
                      <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        What did you observe?
                      </Label>
                      <Textarea
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        className="min-h-[120px] bg-secondary/40 border-white/10 mt-2"
                        placeholder="Describe the environmental issue you're seeing. For example: 'Heavy smoke coming from industrial area, affecting visibility and air quality...'"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Camera className="h-4 w-4 text-primary" />
                        Add Photo Evidence (Optional)
                      </Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      {selectedImage ? (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <ImageIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm text-primary flex-1 truncate">{selectedImage.name}</span>
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
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={triggerImageUpload}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Upload photo evidence
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={handleNextStep}
                      disabled={!observation.trim()}
                    >
                      Continue to Location
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Location Context */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                    <div>
                      <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Where is this happening?
                      </Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="bg-secondary/40 border-white/10"
                          placeholder="Enter address or landmark"
                        />
                        <Button
                          variant="glass"
                          size="sm"
                          onClick={getCurrentLocation}
                          disabled={isGettingLocation}
                        >
                          {isGettingLocation ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Navigation className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {gpsCoordinates && (
                        <p className="text-xs text-muted-foreground mt-2">
                          GPS: {gpsCoordinates.lat.toFixed(4)}, {gpsCoordinates.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="glass"
                        className="flex-1"
                        onClick={handlePrevStep}
                      >
                        Back
                      </Button>
                      <Button
                        variant="hero"
                        className="flex-1"
                        onClick={handleNextStep}
                        disabled={!location.trim()}
                      >
                        Continue to Severity
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Time & Severity */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                    <div>
                      <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-primary" />
                        How severe is this issue?
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          { value: "low", label: "Low", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                          { value: "medium", label: "Medium", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
                          { value: "high", label: "High", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
                          { value: "critical", label: "Critical", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
                        ].map((level) => (
                          <button
                            key={level.value}
                            onClick={() => setSeverity(level.value as any)}
                            className={`p-3 rounded-lg border transition-all ${
                              severity === level.value
                                ? `${level.bg} ${level.border} border-2`
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <div className={`font-medium ${severity === level.value ? level.color : "text-foreground"}`}>
                              {level.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="glass"
                        className="flex-1"
                        onClick={handlePrevStep}
                      >
                        Back
                      </Button>
                      <Button
                        variant="hero"
                        className="flex-1"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Submit Report
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
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
                      <Button
                        variant="glass"
                        size="sm"
                        onClick={() => handleRouteClick(report.id)}
                      >
                        <Map className="h-3 w-3 mr-1" />
                        Route
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: System integration info */}
            <div className="space-y-4">
              <div className="glass-card p-4">
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Report Processing Pipeline
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Auto-tagging in Atlas</div>
                      <div className="text-xs text-muted-foreground">
                        Your report location is automatically mapped and tagged in the Green Grid Atlas for real-time monitoring.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-cyan-400">2</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Scenario Creation</div>
                      <div className="text-xs text-muted-foreground">
                        Verified reports become test scenarios in the Digital Twin simulation lab for impact analysis.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-emerald-400">3</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">KPI Integration</div>
                      <div className="text-xs text-muted-foreground">
                        Resolved reports feed into sustainability metrics and response time KPIs on the Dashboard.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4">
                <h2 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  Impact This Week
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reports submitted</span>
                    <span className="font-medium">{recentReports.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. response time</span>
                    <span className="font-medium text-emerald-400">2.3 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issues resolved</span>
                    <span className="font-medium text-primary">68%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Map Modal */}
            {showRouteMap && selectedReportForRoute && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="glass-card p-6 max-w-2xl w-full mx-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Map className="h-5 w-5 text-primary" />
                      Route to Report Location
                    </h3>
                    <button
                      onClick={() => {
                        setShowRouteMap(false);
                        setSelectedReportForRoute(null);
                      }}
                      className="p-1 rounded-lg hover:bg-white/10 text-muted-foreground"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br from-secondary/60 to-background mb-4">
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {recentReports.find((r) => r.id === selectedReportForRoute)?.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Map view would show route from your location
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="glass"
                      className="flex-1"
                      onClick={() => {
                        setShowRouteMap(false);
                        setSelectedReportForRoute(null);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      variant="hero"
                      className="flex-1"
                      onClick={() => {
                        // In real app, this would open navigation app
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            recentReports.find((r) => r.id === selectedReportForRoute)?.location || ""
                          )}`,
                          "_blank"
                        );
                      }}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Open in Maps
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Community;

