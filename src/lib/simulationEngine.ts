export type SimulationInput = {
  treesAdded: number; // 0-100
  trafficReduced: number; // 0-100
  wasteManaged: number; // 0-100
  coolRoofs: number; // 0-100
};

export type SimulationResult = {
  days: string[];
  baseline: number[];
  scenario: number[];
  outcomes: {
    aqiImprovementPct: number;
    heatReductionC: number;
    waterStressReliefPct: number;
  };
};

// Small helper for seeded-ish random variations
function rand(base = 1, variability = 0.05) {
  return base * (1 + (Math.random() * 2 - 1) * variability);
}

// Core simulation engine — pure functions, easy to extend.
export function runSimulation(input: SimulationInput, days = 30): SimulationResult {
  // Basic baseline metric (e.g. combined stress index) — keep baseline roughly constant
  const baselineLevel = 100; // arbitrary unified index where higher => worse

  // Contributions (simple linear models with diminishing returns)
  const treesEffect = (input.treesAdded / 100) * 0.45; // up to 45% improvement contribution
  const trafficEffect = (input.trafficReduced / 100) * 0.4; // up to 40%
  const wasteEffect = (input.wasteManaged / 100) * 0.25; // up to 25%
  const coolRoofEffect = (input.coolRoofs / 100) * 0.5; // up to 50% on temperature-related metric

  // Outcomes (interpret these in domain units)
  const aqiImprovementPct = Math.max(0, Math.min(85, (treesEffect * 0.6 + trafficEffect * 0.9) * 100 * rand(1, 0.08)));
  const heatReductionC = Math.max(0, (coolRoofEffect * 4.5 + treesEffect * 1.2) * rand(1, 0.12)); // up to ~5°C
  const waterStressReliefPct = Math.max(0, Math.min(95, (wasteEffect * 1.0 + treesEffect * 0.3) * 100 * rand(1, 0.1)));

  const daysArr: string[] = [];
  const baseline: number[] = [];
  const scenario: number[] = [];

  for (let d = 0; d < days; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d + 1);
    daysArr.push(date.toISOString().slice(0, 10));

    // baseline jitter small
    const b = baselineLevel * rand(1, 0.02);
    baseline.push(Number(b.toFixed(2)));

    // scenario is baseline reduced by combined interventions — vary a little over time
    const seasonalFactor = 1 - 0.02 * Math.sin((d / days) * Math.PI * 2); // small seasonal pattern

    // combine effects onto the baseline index
    const combinedReductionFactor = 1 - (treesEffect * 0.5 + trafficEffect * 0.7 + wasteEffect * 0.15) * rand(1, 0.06);

    // cooling reduces heat-related contributions and therefore reduces the unified index a bit more
    const coolingFactor = 1 - coolRoofEffect * 0.12 * rand(1, 0.08);

    const s = b * seasonalFactor * combinedReductionFactor * coolingFactor;

    // Add small day-to-day noise
    scenario.push(Number((s * (1 + (Math.random() - 0.5) * 0.03)).toFixed(2)));
  }

  return {
    days: daysArr,
    baseline,
    scenario,
    outcomes: {
      aqiImprovementPct: Number(aqiImprovementPct.toFixed(1)),
      heatReductionC: Number(heatReductionC.toFixed(2)),
      waterStressReliefPct: Number(waterStressReliefPct.toFixed(1)),
    },
  };
}

// LocalStorage helpers for saved scenarios
export type SavedScenario = {
  id: string;
  name: string;
  input: SimulationInput;
  result: SimulationResult;
  createdAt: string;
};
// Per-user storage keys to ensure user-isolated saved scenarios
const STORAGE_KEY_PREFIX = "greengrid_saved_scenarios_v1_"; // append userId

export type SavedScenarioV2 = SavedScenario & { userId: string };

export function loadSavedScenarios(userId?: string): SavedScenarioV2[] {
  try {
    if (!userId) return [];
    const key = `${STORAGE_KEY_PREFIX}${userId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as SavedScenarioV2[];
  } catch (e) {
    return [];
  }
}

export function saveScenarioToStorage(
  s: Omit<SavedScenarioV2, "id" | "createdAt"> & { name?: string },
  userId?: string
) {
  if (!userId) throw new Error("userId required to save scenario");
  const list = loadSavedScenarios(userId);
  const entry: SavedScenarioV2 = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: s.name || `Scenario ${new Date().toLocaleString()}`,
    input: s.input,
    result: s.result,
    createdAt: new Date().toISOString(),
    userId,
  };
  list.unshift(entry);
  const key = `${STORAGE_KEY_PREFIX}${userId}`;
  localStorage.setItem(key, JSON.stringify(list.slice(0, 20)));
  return entry;
}
