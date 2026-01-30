import { useState, useEffect, useRef, useCallback } from "react";

interface SimulationSession {
  startTime: number;
  activeTimeMs: number;
}

/**
 * Hook to track active time spent in a simulation session
 * Measures continuous interaction time, not just wall-clock time
 */
export const useSimulationSession = () => {
  const [session, setSession] = useState<SimulationSession | null>(null);
  const [activeTimeMs, setActiveTimeMs] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start a new session
  const startSession = useCallback(() => {
    const startTime = Date.now();
    setSession({ startTime, activeTimeMs: 0 });
    setActiveTimeMs(0);
    setIsTracking(true);

    // Update active time every second
    timerRef.current = setInterval(() => {
      setActiveTimeMs((prev) => prev + 1000);
    }, 1000);
  }, []);

  // End the current session and return active time
  const endSession = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsTracking(false);
    const finalTime = activeTimeMs;
    return finalTime;
  }, [activeTimeMs]);

  // Reset session
  const resetSession = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setSession(null);
    setActiveTimeMs(0);
    setIsTracking(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    session,
    activeTimeMs,
    isTracking,
    startSession,
    endSession,
    resetSession,
  };
};

/**
 * Format milliseconds as human-readable duration
 */
export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
};

/**
 * Get progress percentage toward credit eligibility (30 second minimum)
 */
export const getCredibilityProgress = (activeTimeMs: number): number => {
  const MINIMUM_TIME = 30000; // 30 seconds
  return Math.min(100, (activeTimeMs / MINIMUM_TIME) * 100);
};
