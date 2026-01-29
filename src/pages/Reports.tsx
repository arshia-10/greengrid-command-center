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
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import { db, auth } from "@/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { useNotifications } from "@/contexts/NotificationContext";

// db may be mock (firebase.ts); type assertion allows Firestore API when real Firebase is used
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const firestoreDb = db as any;
import { useCredits } from "@/contexts/CreditsContext";

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Atlas", href: "/atlas" },
  { icon: Globe, label: "Digital Twin", href: "/digital-twin" },
  { icon: Activity, label: "Simulations", href: "/simulations" },
  { icon: FileText, label: "Reports", href: "/reports", active: true },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: User, label: "Profile", href: "/profile" },
];

const initialReports = [
  { id: "1", name: "Summer Heatwave Readiness – Downtown", type: "Impact Assessment", status: "Published", age: "2 hours ago", description: "Analysis of heat impact on downtown region" },
  { id: "2", name: "AQI Improvement Pilot – Industrial Belt", type: "Policy Draft", status: "In review", age: "1 day ago", description: "Air quality improvement initiatives" },
  { id: "3", name: "Riverfront Cleanup – Phase 1", type: "Post-Action Report", status: "Published", age: "3 days ago", description: "Cleanup project completion report" },
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
  const { addCredit } = useCredits();
  const { addNotification } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentReports, setRecentReports] = useState(initialReports);
  
  // Text Report States
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmittingText, setIsSubmittingText] = useState(false);
  const [textSubmitSuccess, setTextSubmitSuccess] = useState(false);
  
  // PDF Upload States
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [pdfUploadSuccess, setPdfUploadSuccess] = useState(false);
  const [pdfTitle, setPdfTitle] = useState("");
  const pdfFileInputRef = useRef<HTMLInputElement>(null);

  // Load reports from Firebase on mount
  useEffect(() => {
    const loadReports = async () => {
      try {
        const q = query(collection(firestoreDb, "reports"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const firestoreReports = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any[];
        if (firestoreReports.length > 0) {
          setRecentReports(firestoreReports);
        }
      } catch (error) {
        console.log("No reports in Firebase yet or error loading:", error);
      }
    };
    loadReports();
  }, []);

  // Handle Text Report Submission
  const handleTextSubmit = async () => {
    if (!reportTitle.trim()) {
      alert("Please enter a report title");
      return;
    }

    setIsSubmittingText(true);
    setTextSubmitSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newReport = {
        name: reportTitle,
        type: "Text Report",
        status: "Published" as const,
        age: "just now",
        description: reportDescription || "(No description provided)",
        createdAt: new Date(),
        reportType: "text",
        userId: auth.currentUser?.uid || "anonymous",
      };

      // Save to Firebase
      try {
        const docRef = await addDoc(collection(firestoreDb, "reports"), newReport);
        const reportWithId = {
          id: docRef.id,
          ...newReport,
        };
        setRecentReports((prev) => [reportWithId, ...prev]);
        console.log("Report saved to Firebase with ID:", docRef.id);
        
        // Add notification
        addNotification({
          type: "report",
          title: "New Report Submitted",
          message: `"${reportTitle}" has been added successfully`,
          data: reportWithId,
        });
      } catch (firestoreError) {
        console.error("Firebase error:", firestoreError);
        // Still add locally if Firebase fails
        const reportWithId = {
          id: Date.now().toString(),
          ...newReport,
        };
        setRecentReports((prev) => [reportWithId, ...prev]);
        
        // Add notification for local add
        addNotification({
          type: "report",
          title: "New Report Submitted",
          message: `"${reportTitle}" has been added`,
          data: reportWithId,
        });
      }

      addCredit("report");
      setIsSubmittingText(false);
      setTextSubmitSuccess(true);
      setReportTitle("");
      setReportDescription("");

      setTimeout(() => setTextSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Submit error:", error);
      setIsSubmittingText(false);
      alert("Error submitting report. Please try again.");
    }
  };

  // Handle PDF Upload
  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }

    setIsPdfUploading(true);
    setPdfUploadSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const reportTypes = ["Impact Assessment", "Policy Draft", "Post-Action Report", "Environmental Analysis", "Risk Evaluation"];
      const randomType = reportTypes[Math.floor(Math.random() * reportTypes.length)];

      // Use provided title or extract from filename
      const title = pdfTitle.trim() || file.name.replace(/\.pdf$/i, "").trim() || "Environmental Report";

      const newReport = {
        name: title,
        type: randomType,
        status: "Published" as const,
        age: "just now",
        description: `PDF Document: ${file.name}`,
        createdAt: new Date(),
        fileName: file.name,
        reportType: "pdf",
        userId: auth.currentUser?.uid || "anonymous",
      };

      try {
        const docRef = await addDoc(collection(firestoreDb, "reports"), newReport);
        const reportWithId = {
          id: docRef.id,
          ...newReport,
        };
        setRecentReports((prev) => [reportWithId, ...prev]);
        console.log("PDF report saved to Firebase with ID:", docRef.id);
        
        // Trigger notification
        addNotification({
          type: "report",
          title: "PDF Report Uploaded",
          message: `"${newReport.name}" has been uploaded successfully`,
          data: reportWithId,
        });
      } catch (firestoreError) {
        console.error("Firebase error:", firestoreError);
        // Still add locally if Firebase fails
        const reportWithId = {
          id: Date.now().toString(),
          ...newReport,
        };
        setRecentReports((prev) => [reportWithId, ...prev]);
        
        // Trigger notification for local fallback
        addNotification({
          type: "report",
          title: "PDF Report Added",
          message: `"${newReport.name}" has been added to your reports`,
          data: reportWithId,
        });
      }

      addCredit("report");
      setIsPdfUploading(false);
      setPdfUploadSuccess(true);
      setPdfTitle("");

      setTimeout(() => setPdfUploadSuccess(false), 3000);

      if (pdfFileInputRef.current) {
        pdfFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      setIsPdfUploading(false);
      alert("Error uploading PDF. Please try again.");
    }
  };

  const triggerPdfUpload = () => {
    pdfFileInputRef.current?.click();
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
              <div className="space-y-3">
                {recentReports.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">No reports yet. Upload one to get started!</p>
                ) : (
                  recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 transition-colors animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate pr-2">{report.name}</h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-muted-foreground">{report.type}</span>
                            <span className="flex items-center gap-1">
                              {report.status === "Published" ? (
                                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 text-yellow-400" />
                              )}
                              <span className="text-xs">{report.status}</span>
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{report.age}</span>
                      </div>
                      {report.description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{report.description}</p>
                      )}
                    </div>
                  ))
                )}
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
                <h2 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Write Text Report
                </h2>
                <p className="text-xs text-muted-foreground">
                  Write a direct report with title and description.
                </p>

                {textSubmitSuccess && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400">Report submitted successfully!</span>
                  </div>
                )}
                
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Report Title"
                  className="w-full px-3 py-2 bg-secondary/40 border border-white/10 rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                
                <Textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="min-h-[80px] bg-secondary/40 border-white/10"
                  placeholder="Describe your report... (e.g., 'Analysis of Q4 environmental impact and recommendations for sustainable initiatives')"
                />
                
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handleTextSubmit}
                  disabled={isSubmittingText || !reportTitle.trim()}
                >
                  {isSubmittingText ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>

              <div className="glass-card p-4 space-y-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  Upload PDF Document
                </h2>
                <p className="text-xs text-muted-foreground">
                  Upload a PDF file to add it to your recent reports.
                </p>

                {pdfUploadSuccess && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400">PDF uploaded successfully!</span>
                  </div>
                )}
                
                <input
                  type="text"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  placeholder="PDF Title"
                  className="w-full px-3 py-2 bg-secondary/40 border border-white/10 rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                
                <input
                  ref={pdfFileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={triggerPdfUpload}
                  disabled={isPdfUploading}
                >
                  {isPdfUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : pdfUploadSuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Uploaded Successfully
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Select PDF File
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

