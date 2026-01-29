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
