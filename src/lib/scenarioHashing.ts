/**
 * Scenario Hashing & Deduplication
 * 
 * Creates consistent hashes for simulation scenarios to detect duplicates
 * and prevent credit farming through repeated simulations.
 */

export interface ScenarioInput {
  zone: string;
  trees: number;
  traffic: number;
  waste: number;
  cooling: number;
}

/**
 * Generate a deterministic hash for a scenario based on its parameters
 * This ensures the same inputs always produce the same hash
 */
export const generateScenarioHash = (input: ScenarioInput): string => {
  const params = `${input.zone}|${Math.round(input.trees)}|${Math.round(input.traffic)}|${Math.round(input.waste)}|${Math.round(input.cooling)}`;
  
  // Simple but effective hash for demo purposes
  let hash = 0;
  for (let i = 0; i < params.length; i++) {
    const char = params.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `h_${Math.abs(hash).toString(16)}`;
};

/**
 * Check if this is a duplicate scenario for the user
 * Returns { isDuplicate, previousTimestamp }
 */
export const checkScenarioDuplicate = (
  scenarioHash: string,
  userScenarios: { hash: string; timestamp: number }[]
): { isDuplicate: boolean; previousTimestamp?: number } => {
  const existing = userScenarios.find((s) => s.hash === scenarioHash);
  if (existing) {
    return { isDuplicate: true, previousTimestamp: existing.timestamp };
  }
  return { isDuplicate: false };
};

/**
 * Check daily rate limit for credit-eligible simulations
 * Max 3 credit-eligible simulations per day
 */
export const checkDailyRateLimit = (
  userSimulations: { hash: string; timestamp: number; creditEligible: boolean }[],
  today: Date
): {
  canAwardCredit: boolean;
  remainingToday: number;
  totalToday: number;
} => {
  const MAX_PER_DAY = 3;
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const todaySimulations = userSimulations.filter(
    (s) => s.timestamp >= startOfDay.getTime() && s.timestamp <= endOfDay.getTime()
  );

  const creditEligibleToday = todaySimulations.filter((s) => s.creditEligible).length;
  const remaining = MAX_PER_DAY - creditEligibleToday;

  return {
    canAwardCredit: remaining > 0,
    remainingToday: Math.max(0, remaining),
    totalToday: creditEligibleToday,
  };
};

/**
 * Simulate outcome-based credit eligibility
 * Credits awarded for: unique scenarios, action plans, reports, community submissions
 */
export const isSimulationCreditEligible = (
  isDuplicate: boolean,
  willGenerateActionPlan: boolean
): boolean => {
  // Credit if it's a new scenario OR if user will generate action plan
  return !isDuplicate || willGenerateActionPlan;
};
