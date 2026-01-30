/**
 * Scenario Service
 * 
 * Manages user simulation scenarios, tracks duplicates,
 * enforces rate limits, and determines credit eligibility.
 */

import { generateScenarioHash, checkScenarioDuplicate, checkDailyRateLimit, type ScenarioInput } from "./scenarioHashing";

export interface UserScenario {
  hash: string;
  timestamp: number;
  creditEligible: boolean;
  zone: string;
  controls: {
    trees: number;
    traffic: number;
    waste: number;
    cooling: number;
  };
  activeTimeMs?: number; // Time spent on this scenario (milliseconds)
  parametersChanged?: boolean; // Whether parameters were changed from original
}

const SCENARIO_STORAGE_KEY = "greengrid_user_scenarios";

/**
 * Load user's scenario history from localStorage
 */
export const loadUserScenarios = (): UserScenario[] => {
  try {
    const stored = localStorage.getItem(SCENARIO_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load scenarios:", error);
    return [];
  }
};

/**
 * Save user's scenario history to localStorage
 */
export const saveUserScenarios = (scenarios: UserScenario[]): void => {
  try {
    localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(scenarios));
  } catch (error) {
    console.error("Failed to save scenarios:", error);
  }
};

/**
 * Register a new simulation scenario
 * Returns: { isDuplicate, creditEligible, remainingToday, message }
 */
export const registerScenario = (
  input: ScenarioInput,
  willGenerateActionPlan: boolean = false
): {
  isDuplicate: boolean;
  creditEligible: boolean;
  remainingToday: number;
  message: string;
  hash: string;
} => {
  const hash = generateScenarioHash(input);
  const scenarios = loadUserScenarios();
  
  // Check for duplicate
  const { isDuplicate } = checkScenarioDuplicate(hash, scenarios.map((s) => ({ hash: s.hash, timestamp: s.timestamp })));
  
  // Check daily rate limit
  const today = new Date();
  const { canAwardCredit, remainingToday } = checkDailyRateLimit(scenarios, today);
  
  // Determine credit eligibility
  const creditEligible = !isDuplicate && canAwardCredit;
  
  // Generate message
  let message = "";
  if (isDuplicate) {
    message = "No new impact detected. Try a different intervention.";
  } else if (!canAwardCredit) {
    message = "You've reached the daily limit for impact credits. You can still simulate, but credits won't be awarded.";
  } else {
    message = "New scenario detected — potential impact credit available.";
  }
  
  // Register the scenario
  const newScenario: UserScenario = {
    hash,
    timestamp: Date.now(),
    creditEligible,
    zone: input.zone,
    controls: {
      trees: input.trees,
      traffic: input.traffic,
      waste: input.waste,
      cooling: input.cooling,
    },
  };
  
  scenarios.push(newScenario);
  saveUserScenarios(scenarios);
  
  return {
    isDuplicate,
    creditEligible,
    remainingToday,
    message,
    hash,
  };
};

/**
 * Check if a scenario is credit-eligible without registering it
 */
export const checkScenarioCreditEligibility = (input: ScenarioInput): {
  creditEligible: boolean;
  isDuplicate: boolean;
  remainingToday: number;
} => {
  const hash = generateScenarioHash(input);
  const scenarios = loadUserScenarios();
  
  const { isDuplicate } = checkScenarioDuplicate(hash, scenarios.map((s) => ({ hash: s.hash, timestamp: s.timestamp })));
  const today = new Date();
  const { canAwardCredit, remainingToday } = checkDailyRateLimit(scenarios, today);
  
  return {
    creditEligible: !isDuplicate && canAwardCredit,
    isDuplicate,
    remainingToday,
  };
};

/**
 * Clear scenario history (for testing/reset purposes)
 */
export const clearScenarioHistory = (): void => {
  try {
    localStorage.removeItem(SCENARIO_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear scenarios:", error);
  }
};

/**
 * Get today's credit-eligible simulation count
 */
export const getTodaysCreditCount = (): number => {
  const scenarios = loadUserScenarios();
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  return scenarios.filter(
    (s) => s.creditEligible && s.timestamp >= startOfDay.getTime() && s.timestamp <= endOfDay.getTime()
  ).length;
};
/**
 * ACTIVE TIME VALIDATION
 * Minimum 30 seconds of active interaction before credit eligibility
 * This prevents "submit and forget" gaming
 */
const MINIMUM_ACTIVE_TIME_MS = 30000; // 30 seconds

export const validateActiveTime = (activeTimeMs: number): boolean => {
  return activeTimeMs >= MINIMUM_ACTIVE_TIME_MS;
};

export const getActiveTimeStatus = (activeTimeMs: number): {
  isValid: boolean;
  remainingMs: number;
  percentComplete: number;
} => {
  const remainingMs = Math.max(0, MINIMUM_ACTIVE_TIME_MS - activeTimeMs);
  const percentComplete = Math.min(100, (activeTimeMs / MINIMUM_ACTIVE_TIME_MS) * 100);

  return {
    isValid: remainingMs === 0,
    remainingMs,
    percentComplete,
  };
};

/**
 * PARAMETER CHANGE DETECTION
 * Ensures users actually change parameters, not just save without modification
 * Compares against previous scenario parameters
 */
export const validateParameterChange = (
  currentControls: ScenarioInput,
  previousScenarios: UserScenario[] = []
): {
  isValid: boolean;
  changedParameters: string[];
  reason?: string;
} => {
  if (previousScenarios.length === 0) {
    // First scenario is always valid
    return { isValid: true, changedParameters: ["all"] };
  }

  // Compare against the most recent scenario
  const lastScenario = previousScenarios[previousScenarios.length - 1];

  const changedParameters: string[] = [];

  if (currentControls.trees !== lastScenario.controls.trees) {
    changedParameters.push("trees");
  }
  if (currentControls.traffic !== lastScenario.controls.traffic) {
    changedParameters.push("traffic");
  }
  if (currentControls.waste !== lastScenario.controls.waste) {
    changedParameters.push("waste");
  }
  if (currentControls.cooling !== lastScenario.controls.cooling) {
    changedParameters.push("cooling");
  }

  // At least 2 parameters must change to be considered meaningful
  const isValid = changedParameters.length >= 1; // At least one parameter changed

  return {
    isValid,
    changedParameters,
    reason: isValid ? undefined : "Parameters must be changed to earn credits",
  };
};

/**
 * COMPREHENSIVE CREDIT ELIGIBILITY CHECK
 * Validates: uniqueness, rate limit, active time, AND parameter changes
 */
export const isSimulationCreditEligible = (
  input: ScenarioInput,
  activeTimeMs: number,
  scenarios: UserScenario[] = []
): {
  eligible: boolean;
  reasons: string[];
  activeTimeValid: boolean;
  parameterChangeValid: boolean;
  duplicateValid: boolean;
  rateLimitValid: boolean;
} => {
  const reasons: string[] = [];
  let eligible = true;

  // Check 1: Active time
  const { isValid: activeTimeValid } = getActiveTimeStatus(activeTimeMs);
  if (!activeTimeValid) {
    reasons.push(`Minimum 30 seconds of active interaction required`);
    eligible = false;
  }

  // Check 2: Parameter changes
  const { isValid: parameterChangeValid } = validateParameterChange(input, scenarios);
  if (!parameterChangeValid) {
    reasons.push("At least one parameter must be changed");
    eligible = false;
  }

  // Check 3: Duplicate scenario
  const hash = generateScenarioHash(input);
  const { isDuplicate: duplicateValid } = checkScenarioDuplicate(
    hash,
    scenarios.map((s) => ({ hash: s.hash, timestamp: s.timestamp }))
  );
  if (duplicateValid) {
    reasons.push("This scenario has already been simulated");
    eligible = false;
  }

  // Check 4: Daily rate limit
  const { canAwardCredit: rateLimitValid } = checkDailyRateLimit(scenarios, new Date());
  if (!rateLimitValid) {
    reasons.push("Daily credit limit reached (max 3 per day)");
    eligible = false;
  }

  return {
    eligible,
    reasons,
    activeTimeValid,
    parameterChangeValid,
    duplicateValid: !duplicateValid, // Note: inverted logic
    rateLimitValid,
  };
};