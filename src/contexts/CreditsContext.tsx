import { createContext, useContext, useCallback, useMemo, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "greengrid_credits";

export type CreditType = "report" | "community" | "simulation";

export interface UserCredits {
  email: string;
  name: string;
  reports: number;
  community: number;
  simulations: number;
}

export interface LeaderboardEntry {
  rank: number;
  email: string;
  name: string;
  reports: number;
  community: number;
  simulations: number;
  total: number;
  isCurrentUser: boolean;
}

interface CreditsData {
  [email: string]: Omit<UserCredits, "email">;
}

const defaultMockLeaderboard: UserCredits[] = [
  { email: "priya.sharma@example.com", name: "Priya Sharma", reports: 12, community: 8, simulations: 6 },
  { email: "arjun.mehta@example.com", name: "Arjun Mehta", reports: 10, community: 6, simulations: 5 },
  { email: "ananya.verma@example.com", name: "Ananya Verma", reports: 9, community: 7, simulations: 4 },
  { email: "rahul.kumar@example.com", name: "Rahul Kumar", reports: 8, community: 5, simulations: 7 },
  { email: "sneha.patel@example.com", name: "Sneha Patel", reports: 7, community: 9, simulations: 3 },
  { email: "vikram.singh@example.com", name: "Vikram Singh", reports: 6, community: 4, simulations: 5 },
  { email: "kavya.reddy@example.com", name: "Kavya Reddy", reports: 5, community: 6, simulations: 4 },
  { email: "aditya.joshi@example.com", name: "Aditya Joshi", reports: 4, community: 3, simulations: 6 },
];

function loadCredits(): CreditsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {};
}

function saveCredits(data: CreditsData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

interface CreditsContextType {
  addCredit: (type: CreditType) => void;
  getLeaderboard: () => LeaderboardEntry[];
  getMyCredits: () => UserCredits | null;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();

  const addCredit = useCallback(
    (type: CreditType) => {
      const email = profile?.email;
      const name = profile?.name ?? "User";
      if (!email) return;

      const data = loadCredits();
      const current = data[email] ?? { name, reports: 0, community: 0, simulations: 0 };
      if (type === "report") current.reports += 1;
      else if (type === "community") current.community += 1;
      else if (type === "simulation") current.simulations += 1;
      current.name = name;
      data[email] = current;
      saveCredits(data);
    },
    [profile?.email, profile?.name]
  );

  const getLeaderboard = useCallback((): LeaderboardEntry[] => {
    const data = loadCredits();
    const currentEmail = profile?.email ?? null;

    const merged: Record<string, UserCredits> = {};

    defaultMockLeaderboard.forEach((u) => {
      merged[u.email] = { ...u };
    });

    Object.entries(data).forEach(([email, rest]) => {
      if (merged[email]) {
        merged[email] = {
          email,
          name: rest.name,
          reports: rest.reports,
          community: rest.community,
          simulations: rest.simulations,
        };
      } else {
        merged[email] = { email, name: rest.name, reports: rest.reports, community: rest.community, simulations: rest.simulations };
      }
    });

    if (currentEmail && !merged[currentEmail]) {
      merged[currentEmail] = {
        email: currentEmail,
        name: profile?.name ?? "You",
        reports: 0,
        community: 0,
        simulations: 0,
      };
    }

    const list = Object.values(merged)
      .map((u) => ({
        ...u,
        total: u.reports + u.community + u.simulations,
        isCurrentUser: u.email === currentEmail,
      }))
      .sort((a, b) => b.total - a.total);

    return list.map((entry, index) => ({
      rank: index + 1,
      email: entry.email,
      name: entry.name,
      reports: entry.reports,
      community: entry.community,
      simulations: entry.simulations,
      total: entry.total,
      isCurrentUser: entry.isCurrentUser,
    }));
  }, [profile?.email, profile?.name]);

  const getMyCredits = useCallback((): UserCredits | null => {
    const email = profile?.email;
    if (!email) return null;
    const data = loadCredits();
    const rest = data[email];
    if (!rest) return { email, name: profile?.name ?? "You", reports: 0, community: 0, simulations: 0 };
    return { email, name: rest.name, reports: rest.reports, community: rest.community, simulations: rest.simulations };
  }, [profile?.email, profile?.name]);

  const value = useMemo(
    () => ({ addCredit, getLeaderboard, getMyCredits }),
    [addCredit, getLeaderboard, getMyCredits]
  );

  return <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>;
}

export function useCredits() {
  const ctx = useContext(CreditsContext);
  if (!ctx) throw new Error("useCredits must be used within CreditsProvider");
  return ctx;
}
