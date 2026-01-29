/**
 * useDigitalTwin Hook
 * 
 * Manages digital twin state and provides all control methods
 * for reactive UI integration.
 */

import { useState, useCallback, useEffect } from "react";
import {
  DigitalTwinState,
  Controls,
  updateDigitalTwinState,
  createInitialState,
  resetToBaseline,
} from "@/lib/digitalTwinEngine";

interface UseDigitalTwinReturn {
  state: DigitalTwinState;
  updateControl: (id: keyof Controls, value: number) => void;
  runSimulation: () => void;
  reset: () => void;
  switchZone: (zoneId: string) => void;
  isSimulating: boolean;
}

export function useDigitalTwin(initialZoneId: string = "downtown-district"): UseDigitalTwinReturn {
  const [state, setState] = useState<DigitalTwinState>(() => createInitialState(initialZoneId));
  const [isSimulating, setIsSimulating] = useState(false);

  // Update individual control and propagate live metrics
  const updateControl = useCallback((id: keyof Controls, value: number) => {
    setState((prev) => {
      const newControls = { ...prev.controls, [id]: value };
      return updateDigitalTwinState(prev, newControls, false);
    });
  }, []);

  // Run full simulation (computes prediction and action plan)
  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    // Simulate async operation for better UX
    setTimeout(() => {
      setState((prev) => {
        const updated = updateDigitalTwinState(prev, prev.controls, true);
        return updated;
      });
      setIsSimulating(false);
    }, 800);
  }, []);

  // Reset all controls and metrics to baseline
  const reset = useCallback(() => {
    setState((prev) => resetToBaseline(prev));
  }, []);

  // Switch to a different zone
  const switchZone = useCallback((zoneId: string) => {
    setState(createInitialState(zoneId));
  }, []);

  return {
    state,
    updateControl,
    runSimulation,
    reset,
    switchZone,
    isSimulating,
  };
}
