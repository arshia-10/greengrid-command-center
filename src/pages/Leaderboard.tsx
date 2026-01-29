import { Link } from "react-router-dom";
import {
  Globe,
  Map,
  Activity,
  FileText,
  Users,
  User,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Trophy,
  Medal,
  Award,
  Zap,
  TrendingUp,
  FileCheck,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useCredits } from "@/contexts/CreditsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo, useState } from "react";

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Atlas", href: "/atlas" },
  { icon: Globe, label: "Digital Twin", href: "/digital-twin" },
  { icon: Activity, label: "Simulations", href: "/simulations" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard", active: true },
  { icon: User, label: "Profile", href: "/profile" },
];

const Leaderboard = () => {
  const { getLeaderboard, getMyCredits } = useCredits();
  const { profile } = useAuth();
  const leaderboard = useMemo(() => getLeaderboard(), [getLeaderboard]);
  const myCredits = getMyCredits();
  const myEntry = leaderboard.find((e) => e.isCurrentUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <>
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-sidebar border-r border-white/5 z-50 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-8 px-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                  <Globe className="h-5 w-5 text-slate-950" />
                </div>
                <span className="text-lg font-bold gradient-text">GreenGrid</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
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

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Leaderboard
                </h1>
                <p className="text-xs text-muted-foreground">
                  Top contributors by credits — file reports, community signals, and run simulations to climb.
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
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto space-y-6">
          {/* Your rank card */}
          {myEntry && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 lg:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">Your standing</span>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-lg font-bold text-slate-950">
                    #{myEntry.rank}
                  </div>
                  <div>
                    <div className="font-medium">{profile?.name ?? "You"}</div>
                    <div className="text-sm text-muted-foreground">
                      {myCredits?.reports ?? 0} reports · {myCredits?.community ?? 0} community ·{" "}
                      {myCredits?.simulations ?? 0} simulations
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/60 border border-white/10">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold font-mono text-primary">{myEntry.total}</span>
                  <span className="text-sm text-muted-foreground">total credits</span>
                </div>
              </div>
            </div>
          )}

          {/* How to earn */}
          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              How to earn credits
            </h3>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <FileCheck className="h-5 w-5 text-emerald-400" />
                <span>1 report filed = 1 credit</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <MessageCircle className="h-5 w-5 text-cyan-400" />
                <span>1 community report = 1 credit</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span>1 simulation run = 1 credit</span>
              </div>
            </div>
          </div>

          {/* Leaderboard table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <Medal className="h-5 w-5 text-primary" />
                Rankings
              </h2>
              <span className="text-xs text-muted-foreground">Sorted by total credits (high → low)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4 font-medium w-16">Rank</th>
                    <th className="py-3 px-4 font-medium">Contributor</th>
                    <th className="py-3 px-4 font-medium text-center w-24">Reports</th>
                    <th className="py-3 px-4 font-medium text-center w-24">Community</th>
                    <th className="py-3 px-4 font-medium text-center w-24">Simulations</th>
                    <th className="py-3 px-4 font-medium text-right w-28">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.email}
                      className={`border-b border-white/5 transition-colors ${
                        entry.isCurrentUser ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-white/5"
                      }`}
                    >
                      <td className="py-3 px-4">
                        {entry.rank <= 3 ? (
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                              entry.rank === 1
                                ? "bg-amber-500/20 text-amber-400"
                                : entry.rank === 2
                                  ? "bg-slate-400/20 text-slate-300"
                                  : "bg-amber-700/30 text-amber-600"
                            }`}
                          >
                            {entry.rank === 1 ? "1" : entry.rank === 2 ? "2" : "3"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground font-medium">#{entry.rank}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-sm font-semibold text-primary">
                            {entry.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <span className="font-medium">{entry.name}</span>
                            {entry.isCurrentUser && (
                              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-muted-foreground">{entry.reports}</td>
                      <td className="py-3 px-4 text-center font-mono text-muted-foreground">{entry.community}</td>
                      <td className="py-3 px-4 text-center font-mono text-muted-foreground">{entry.simulations}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold font-mono text-primary">{entry.total}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;
