/**
 * useDigitalTwin Hook
 * 
 * Manages digital twin state with real environmental simulation.
 * Provides control methods for reactive UI integration.
 */

import { useState, useCallback, useEffect } from "react";
import {
  DigitalTwinState,
  ControlState,
  initializeDigitalTwin,
  updateControls,
  runSimulation,
  resetZone,
  tickLiveEnvironment,
} from "@/lib/digitalTwinEngine";

interface UseDigitalTwinReturn {
  state: DigitalTwinState;
  updateControl: (id: keyof ControlState, value: number) => void;
  runSimulation: () => void;
  reset: () => void;
  switchZone: (zoneId: string) => void;
  isSimulating: boolean;
}

export function useDigitalTwin(initialZoneId: string = "downtown-district"): UseDigitalTwinReturn {
  const [state, setState] = useState<DigitalTwinState>(() => initializeDigitalTwin(initialZoneId));
  const [isSimulating, setIsSimulating] = useState(false);

  // Live environment ticks every 2 seconds for continuous updates
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => tickLiveEnvironment(prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Update individual control value
  const updateControl = useCallback((id: keyof ControlState, value: number) => {
    setState((prev) => updateControls(prev, { [id]: value }));
  }, []);

  // Run simulation (30-day prediction)
  const runSimulation_action = useCallback(() => {
    setIsSimulating(true);
    setTimeout(() => {
      setState((prev) => runSimulation(prev, 30));
      setIsSimulating(false);
    }, 800);
  }, []);

  // Reset zone to baseline
  const reset = useCallback(() => {
    setState((prev) => resetZone(prev));
  }, []);

  // Switch to a different zone
  const switchZone = useCallback((zoneId: string) => {
    setState(initializeDigitalTwin(zoneId));
  }, []);

  return {
    state,
    updateControl,
    runSimulation: runSimulation_action,
    reset,
    switchZone,
    isSimulating,
  };
}
