import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const STORAGE_KEY = "greengrid_activity";

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [activity, setActivity] = useState<ActivityData>({
    simulationsRun: 0,
    reportsGenerated: 0,
    activeDays: [],
  });

  // Load activity from localStorage on mount
  const loadActivity = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setActivity({
          simulationsRun: parsed.simulationsRun ?? 0,
          reportsGenerated: parsed.reportsGenerated ?? 0,
          activeDays: parsed.activeDays ?? [],
        });
      }
    } catch (error) {
      console.error("Failed to load activity data:", error);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  // Save activity to localStorage
  const saveActivity = (newActivity: ActivityData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivity));
    } catch (error) {
      console.error("Failed to save activity data:", error);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    return new Date().toISOString().split("T")[0];
  };

  // Increment simulations and mark active day
  const incrementSimulations = () => {
    setActivity((prev) => {
      const today = getTodayDate();
      const newActiveDays = prev.activeDays.includes(today)
        ? prev.activeDays
        : [...prev.activeDays, today];

      const updated = {
        simulationsRun: prev.simulationsRun + 1,
        reportsGenerated: prev.reportsGenerated,
        activeDays: newActiveDays,
      };

      saveActivity(updated);
      return updated;
    });
  };

  // Increment reports and mark active day
  const incrementReports = () => {
    setActivity((prev) => {
      const today = getTodayDate();
      const newActiveDays = prev.activeDays.includes(today)
        ? prev.activeDays
        : [...prev.activeDays, today];

      const updated = {
        simulationsRun: prev.simulationsRun,
        reportsGenerated: prev.reportsGenerated + 1,
        activeDays: newActiveDays,
      };

      saveActivity(updated);
      return updated;
    });
  };

  // Get count of active days
  const getActiveDaysCount = (): number => {
    return activity.activeDays.length;
  };

  // Calculate impact score
  // Formula: (simulationsRun * 5) + (reportsGenerated * 10)
  const getImpactScore = (): number => {
    return activity.simulationsRun * 5 + activity.reportsGenerated * 10;
  };

  // Check if user is new (no activity yet)
  const isNewUser = (): boolean => {
    return activity.simulationsRun === 0 && activity.reportsGenerated === 0;
  };

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
