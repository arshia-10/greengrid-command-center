import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ActivityData {
  simulationsRun: number;
  reportsGenerated: number;
  activeDays: string[]; // Array of YYYY-MM-DD dates when user performed actions
}

interface ActivityContextType {
  activity: ActivityData;
  incrementSimulations: () => void;
  incrementReports: () => void;
  getActiveDaysCount: () => number;
  getImpactScore: () => number;
  isNewUser: () => boolean;
  loadActivity: () => void;
  recordLoginDay: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = "greengrid_activity_"; // per-user key: greengrid_activity_{uid}

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [activity, setActivity] = useState<ActivityData>({
    simulationsRun: 0,
    reportsGenerated: 0,
    activeDays: [],
  });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => new Date().toISOString().split("T")[0];

  // Build per-user storage key
  const getStorageKeyForUser = (uid?: string) => {
    if (!uid) return null;
    return `${STORAGE_KEY_PREFIX}${uid}`;
  };

  // Load activity for the current authenticated user
  const loadActivity = () => {
    try {
      const key = getStorageKeyForUser(user?.uid);
      if (!key) return;
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        setActivity({
          simulationsRun: parsed.simulationsRun ?? 0,
          reportsGenerated: parsed.reportsGenerated ?? 0,
          activeDays: parsed.activeDays ?? [],
        });
      } else {
        // Initialize clean for new users
        setActivity({ simulationsRun: 0, reportsGenerated: 0, activeDays: [] });
      }
    } catch (error) {
      console.error("Failed to load activity data:", error);
    }
  };

  useEffect(() => {
    // When auth user changes, load that user's activity
    if (user?.uid) {
      loadActivity();
      // Record login date once on sign-in (doesn't double-count multiple logins same day)
      recordLoginDay();
    } else {
      // Clear activity when no user is authenticated
      setActivity({ simulationsRun: 0, reportsGenerated: 0, activeDays: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  // Save activity to localStorage for the current user
  const saveActivity = (newActivity: ActivityData) => {
    try {
      const key = getStorageKeyForUser(user?.uid);
      if (!key) return;
      localStorage.setItem(key, JSON.stringify(newActivity));
    } catch (error) {
      console.error("Failed to save activity data:", error);
    }
  };

  // Increment simulations (does NOT affect activeDays directly)
  const incrementSimulations = () => {
    setActivity((prev) => {
      const updated = {
        simulationsRun: prev.simulationsRun + 1,
        reportsGenerated: prev.reportsGenerated,
        activeDays: prev.activeDays,
      };
      saveActivity(updated);
      return updated;
    });
  };

  // Increment reports (does NOT affect activeDays directly)
  const incrementReports = () => {
    setActivity((prev) => {
      const updated = {
        simulationsRun: prev.simulationsRun,
        reportsGenerated: prev.reportsGenerated + 1,
        activeDays: prev.activeDays,
      };
      saveActivity(updated);
      return updated;
    });
  };

  // Record today's date as an active day for the current authenticated user
  const recordLoginDay = () => {
    if (!user?.uid) return;
    const today = getTodayDate();
    setActivity((prev) => {
      if (prev.activeDays.includes(today)) return prev;
      const updated = { ...prev, activeDays: [...prev.activeDays, today] };
      saveActivity(updated);
      return updated;
    });
  };

  const getActiveDaysCount = (): number => activity.activeDays.length;

  // Calculate impact score
  // Formula: (simulationsRun * 5) + (reportsGenerated * 10)
  const getImpactScore = (): number => activity.simulationsRun * 5 + activity.reportsGenerated * 10;

  const isNewUser = (): boolean => activity.simulationsRun === 0 && activity.reportsGenerated === 0;

  return (
    <ActivityContext.Provider
      value={{
        activity,
        incrementSimulations,
        incrementReports,
        getActiveDaysCount,
        getImpactScore,
        isNewUser,
        loadActivity,
        recordLoginDay,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within ActivityProvider");
  }
  return context;
};
