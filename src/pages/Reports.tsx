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
  Download,
  Filter,
  CalendarRange,
  PieChart,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  Settings,
  LogOut,
  Upload,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Atlas", href: "/atlas" },
  { icon: Globe, label: "Digital Twin", href: "/digital-twin" },
  { icon: Activity, label: "Simulations", href: "/simulations" },
  { icon: FileText, label: "Reports", href: "/reports", active: true },
  { icon: Users, label: "Community", href: "/community" },
  { icon: User, label: "Profile", href: "/profile" },
];

const initialReports = [
  { id: 1, name: "Summer Heatwave Readiness – Downtown", type: "Impact Assessment", status: "Published", age: "2 hours ago" },
  { id: 2, name: "AQI Improvement Pilot – Industrial Belt", type: "Policy Draft", status: "In review", age: "1 day ago" },
  { id: 3, name: "Riverfront Cleanup – Phase 1", type: "Post-Action Report", status: "Published", age: "3 days ago" },
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

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentReports, setRecentReports] = useState(initialReports);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    // Simulate upload delay for professional feel
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Extract filename without extension
    const fileName = file.name.replace(/\.pdf$/i, "").trim() || "Environmental Report";
    
    // Generate report type based on filename
    const reportTypes = ["Impact Assessment", "Policy Draft", "Post-Action Report", "Environmental Analysis", "Risk Evaluation"];
    const randomType = reportTypes[Math.floor(Math.random() * reportTypes.length)];

    // Create new report entry
    const newReport = {
      id: Date.now(),
      name: fileName,
      type: randomType,
      status: "Published" as const,
      age: "just now",
    };

    setRecentReports((prev) => [newReport, ...prev]);
    setIsUploading(false);
    setUploadSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => setUploadSuccess(false), 3000);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
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
                  <FileText className="h-5 w-5 text-primary" />
                  Environmental Reports
                </h1>
                <p className="text-xs text-muted-foreground">
                  Turn simulations and live data into decision-ready documents.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="glass" size="sm" className="hidden sm:inline-flex">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
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
        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
          <div className="grid lg:grid-cols-[1.4fr,1fr] gap-6">
            {/* Recent reports table */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold">Recent Reports</h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarRange className="h-4 w-4" />
                  <span>Last 30 days</span>
                </div>
              </div>
              <div className="divide-y divide-white/5 text-sm">
                <div className="grid grid-cols-[minmax(0,2fr),minmax(0,1.3fr),120px,120px] py-2 text-xs text-muted-foreground">
                  <span>Title</span>
                  <span>Type</span>
                  <span>Status</span>
                  <span>Last updated</span>
                </div>
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="grid grid-cols-[minmax(0,2fr),minmax(0,1.3fr),120px,120px] items-center py-3 animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <span className="truncate pr-4">{report.name}</span>
                    <span className="text-xs text-muted-foreground truncate pr-4">{report.type}</span>
                    <span className="flex items-center gap-1">
                      {report.status === "Published" ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-yellow-400" />
                      )}
                      <span className="text-xs">{report.status}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{report.age}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI snapshot */}
            <div className="space-y-4">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    KPI Snapshot
                  </h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">City Green Health Index</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                      <span className="font-mono-data text-emerald-400">+3.2</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Average AQI across zones</span>
                    <span className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-emerald-400" />
                      <span className="font-mono-data text-emerald-400">-14</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Water risk alerts</span>
                    <span className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-emerald-400" />
                      <span className="font-mono-data text-emerald-400">-27%</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 space-y-3">
                <h2 className="font-semibold">Export Center</h2>
                <p className="text-xs text-muted-foreground">
                  Upload a PDF report to add it to your recent reports, or download existing reports.
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={triggerFileUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Uploaded Successfully
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload PDF Report
                    </>
                  )}
                </Button>
                
                <Button variant="glass" className="w-full" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Latest Report
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;

