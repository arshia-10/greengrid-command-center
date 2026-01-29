/**
 * DIGITAL TWIN STATE MODEL & SIMULATION ENGINE
 * 
 * Maintains live environmental state of a zone and generates predictions.
 * All calculations are deterministic + bounded randomness for realism.
 */

export interface ZoneInfo {
  name: string;
  area: number; 
  population: number;
}

export interface LiveMetrics {
  aqi: number;
  temperature: number; // °C
  co2: number; // ppm
  humidity: number; // %
  sustainabilityIndex: number; // 0-100
  healthImpactScore: number; // 0-100
  energyEfficiency: number; // 0-100
}

export interface Controls {
  treeCoverage: number; // 0-100
  trafficDensity: number; // 0-100
  rainfallStress: number; // 0-100
  industrialOutput: number; // 0-100
  wasteMismanagement: number; // 0-100
}

export interface PredictedMetrics extends LiveMetrics {
  timestamp: string;
}

export interface RiskProfile {
  overallStress: number; // 0-100
  airQualityRisk: number; // 0-100
  heatStress: number; // 0-100
  waterStress: number; // 0-100
  industryImpact: number; // 0-100
}

export interface ActionRecommendation {
  title: string;
  description: string;
  category: "air" | "heat" | "water" | "waste" | "energy";
  priority: "critical" | "high" | "medium";
  expectedImpact: string;
  icon: string;
}

export interface DigitalTwinState {
  zoneInfo: ZoneInfo;
  live: LiveMetrics;
  controls: Controls;
  predicted: PredictedMetrics | null;
  riskProfile: RiskProfile;
  recommendations: ActionRecommendation[];
  lastSimulation: string | null;
  baseline: LiveMetrics; // for reset
}

// ============================================================
// BASELINE DATA (zones can be extended)
// ============================================================

const ZONES: Record<string, { info: ZoneInfo; baseline: LiveMetrics }> = {
  "downtown-district": {
    info: {
      name: "Downtown District",
      area: 12.4,
      population: 145000,
    },
    baseline: {
      aqi: 72,
      temperature: 32,
      co2: 420,
      humidity: 65,
      sustainabilityIndex: 72,
      healthImpactScore: 85,
      energyEfficiency: 68,
    },
  },
  "industrial-zone": {
    info: {
      name: "Industrial Zone",
      area: 18.2,
      population: 45000,
    },
    baseline: {
      aqi: 95,
      temperature: 35,
      co2: 520,
      humidity: 55,
      sustainabilityIndex: 45,
      healthImpactScore: 62,
      energyEfficiency: 52,
    },
  },
  "green-district": {
    info: {
      name: "Green District",
      area: 8.9,
      population: 78000,
    },
    baseline: {
      aqi: 45,
      temperature: 28,
      co2: 380,
      humidity: 70,
      sustainabilityIndex: 88,
      healthImpactScore: 92,
      energyEfficiency: 82,
    },
  },
};

// ============================================================
// REALISM & RANDOMNESS HELPERS
// ============================================================

function bounded(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randomVariation(value: number, variability: number = 0.03): number {
  const factor = 1 + (Math.random() * 2 - 1) * variability;
  return value * factor;
}

function smoothTransition(current: number, target: number, rate: number = 0.1): number {
  return current + (target - current) * rate;
}

// ============================================================
// IMPACT COEFFICIENTS
// ============================================================

const IMPACT_COEFFICIENTS = {
  trees: {
    aqiReduction: 0.008,
    temperatureReduction: 0.04,
    co2Reduction: 0.12,
    healthImprovement: 0.5,
    sustainabilityImprovement: 0.6,
  },
  traffic: {
    aqiIncrease: 0.015,
    temperatureIncrease: 0.05,
    co2Increase: 0.18,
    healthDecrease: 0.4,
    sustainabilityDecrease: 0.5,
    energyDecay: 0.3,
  },
  industry: {
    aqiIncrease: 0.012,
    temperatureIncrease: 0.03,
    co2Increase: 0.15,
    co2Heat: 0.02,
    healthDecrease: 0.35,
    sustainabilityDecrease: 0.7,
    energyIncrease: 0.4,
  },
  rainfall: {
    humidityIncrease: 0.5,
    temperatureReduction: 0.02,
    waterStressIncrease: 0.25,
  },
  waste: {
    waterStressIncrease: 0.35,
    healthDecrease: 0.25,
    sustainabilityDecrease: 0.4,
  },
};

// ============================================================
// CORE SIMULATION ENGINE
// ============================================================

export function simulateEnvironment(
  current: LiveMetrics,
  controls: Controls,
  baseline: LiveMetrics
): LiveMetrics {
  let simulated = { ...current };

  // Normalize controls (0-100 to influence factors)
  const treeInfluence = controls.treeCoverage / 100;
  const trafficInfluence = controls.trafficDensity / 100;
  const industrialInfluence = controls.industrialOutput / 100;
  const rainfallInfluence = controls.rainfallStress / 100;
  const wasteInfluence = controls.wasteMismanagement / 100;

  // ---- AQI ----
  const aqiBaseline = baseline.aqi;
  const aqiShift =
    -treeInfluence * aqiBaseline * IMPACT_COEFFICIENTS.trees.aqiReduction +
    trafficInfluence * aqiBaseline * IMPACT_COEFFICIENTS.traffic.aqiIncrease +
    industrialInfluence * aqiBaseline * IMPACT_COEFFICIENTS.industry.aqiIncrease;
  simulated.aqi = bounded(aqiBaseline + aqiShift + randomVariation(0, 3), 0, 500);

  // ---- Temperature ----
  const tempBaseline = baseline.temperature;
  const tempShift =
    -treeInfluence * IMPACT_COEFFICIENTS.trees.temperatureReduction * 5 +
    trafficInfluence * IMPACT_COEFFICIENTS.traffic.temperatureIncrease * 5 +
    industrialInfluence * IMPACT_COEFFICIENTS.industry.temperatureIncrease * 5 -
    rainfallInfluence * IMPACT_COEFFICIENTS.rainfall.temperatureReduction * 3;
  simulated.temperature = bounded(tempBaseline + tempShift + randomVariation(0, 0.5), 10, 50);

  // ---- CO2 ----
  const co2Baseline = baseline.co2;
  const co2Shift =
    -treeInfluence * co2Baseline * IMPACT_COEFFICIENTS.trees.co2Reduction +
    trafficInfluence * co2Baseline * IMPACT_COEFFICIENTS.traffic.co2Increase +
    industrialInfluence * co2Baseline * IMPACT_COEFFICIENTS.industry.co2Increase;
  simulated.co2 = bounded(co2Baseline + co2Shift + randomVariation(0, 5), 250, 1200);

  // ---- Humidity ----
  const humidityBaseline = baseline.humidity;
  const humidityShift = rainfallInfluence * IMPACT_COEFFICIENTS.rainfall.humidityIncrease * 10;
  simulated.humidity = bounded(humidityBaseline + humidityShift + randomVariation(0, 2), 20, 100);

  // ---- Sustainability Index ----
  const sustainBaseline = baseline.sustainabilityIndex;
  const sustainShift =
    treeInfluence * IMPACT_COEFFICIENTS.trees.sustainabilityImprovement * 3 -
    trafficInfluence * IMPACT_COEFFICIENTS.traffic.sustainabilityDecrease * 3 -
    industrialInfluence * IMPACT_COEFFICIENTS.industry.sustainabilityDecrease * 4 -
    wasteInfluence * IMPACT_COEFFICIENTS.waste.sustainabilityDecrease * 2;
  simulated.sustainabilityIndex = bounded(sustainBaseline + sustainShift + randomVariation(0, 1), 0, 100);

  // ---- Health Impact Score ----
  const healthBaseline = baseline.healthImpactScore;
  const healthShift =
    treeInfluence * IMPACT_COEFFICIENTS.trees.healthImprovement * 2 -
    trafficInfluence * IMPACT_COEFFICIENTS.traffic.healthDecrease * 2 -
    industrialInfluence * IMPACT_COEFFICIENTS.industry.healthDecrease * 2 -
    wasteInfluence * IMPACT_COEFFICIENTS.waste.healthDecrease * 1.5;
  simulated.healthImpactScore = bounded(healthBaseline + healthShift + randomVariation(0, 1), 0, 100);

  // ---- Energy Efficiency ----
  const energyBaseline = baseline.energyEfficiency;
  const energyShift =
    -trafficInfluence * IMPACT_COEFFICIENTS.traffic.energyDecay * 2 +
    industrialInfluence * IMPACT_COEFFICIENTS.industry.energyIncrease * 1.5 +
    treeInfluence * 1; // trees help cooling efficiency
  simulated.energyEfficiency = bounded(energyBaseline + energyShift + randomVariation(0, 1), 0, 100);

  return simulated;
}

// ============================================================
// RISK PROFILE CALCULATOR
// ============================================================

export function calculateRiskProfile(current: LiveMetrics, baseline: LiveMetrics): RiskProfile {
  // Normalize deviations from baseline
  const aqiDeviation = Math.max(0, (current.aqi - baseline.aqi) / Math.max(1, baseline.aqi)) * 100;
  const tempDeviation = Math.max(0, (current.temperature - baseline.temperature) / Math.max(1, baseline.temperature)) * 100;
  const co2Deviation = Math.max(0, (current.co2 - baseline.co2) / Math.max(1, baseline.co2)) * 100;

  const airQualityRisk = bounded(aqiDeviation + co2Deviation / 2, 0, 100);
  const heatStress = bounded(tempDeviation * 1.5, 0, 100);
  const waterStress = bounded((100 - current.humidity) * 0.5, 0, 100);
  const industryImpact = bounded(100 - current.sustainabilityIndex, 0, 100);

  const overallStress = (airQualityRisk * 0.3 + heatStress * 0.25 + waterStress * 0.2 + industryImpact * 0.25) * 0.75;

  return {
    overallStress: bounded(overallStress, 0, 100),
    airQualityRisk: bounded(airQualityRisk, 0, 100),
    heatStress: bounded(heatStress, 0, 100),
    waterStress: bounded(waterStress, 0, 100),
    industryImpact: bounded(industryImpact, 0, 100),
  };
}

// ============================================================
// ACTION PLAN GENERATOR
// ============================================================

export function generateActionPlan(risk: RiskProfile, controls: Controls, live: LiveMetrics): ActionRecommendation[] {
  const actions: ActionRecommendation[] = [];

  // Priority detection: which risks are highest?
  const risks = [
    { score: risk.airQualityRisk, type: "air" as const },
    { score: risk.heatStress, type: "heat" as const },
    { score: risk.waterStress, type: "water" as const },
    { score: risk.industryImpact, type: "industry" as const },
  ].sort((a, b) => b.score - a.score);

  // ---- Top Priority: Air Quality ----
  if (risks[0].type === "air" && risk.airQualityRisk > 50) {
    actions.push({
      title: "Expand Urban Forest",
      description: `Increase tree coverage from ${controls.treeCoverage}% to 75%+ to absorb CO2 and particulates.`,
      category: "air",
      priority: "critical",
      expectedImpact: "↓ AQI by 15–25 points, ↓ CO2 by 8%",
      icon: "🌳",
    });

    if (controls.trafficDensity > 60) {
      actions.push({
        title: "Implement Congestion Pricing",
        description: `Reduce traffic density from ${controls.trafficDensity}% through congestion charges to encourage transit.`,
        category: "air",
        priority: "high",
        expectedImpact: "↓ AQI by 12–18%, ↓ CO2 by 5–7%",
        icon: "🚗",
      });
    }
  }

  // ---- Top Priority: Heat Stress ----
  if (risks[0].type === "heat" && risk.heatStress > 50) {
    actions.push({
      title: "Cool Roofs Initiative",
      description: `Deploy reflective roof coatings and green roofs to reduce urban heat island effect.`,
      category: "heat",
      priority: "critical",
      expectedImpact: "↓ Temperature by 2–3°C, ↑ Energy Efficiency by 12%",
      icon: "❄️",
    });
  }

  // ---- Top Priority: Water Stress ----
  if (risks[0].type === "water" && risk.waterStress > 50) {
    actions.push({
      title: "Rainwater Harvesting Network",
      description: `Install cisterns and rain gardens to capture ${controls.rainfallStress}mm+ rainfall stress.`,
      category: "water",
      priority: "high",
      expectedImpact: "↓ Water stress by 15–20%, ↑ Sustainability by 8%",
      icon: "💧",
    });
  }

  // ---- Industry/Waste ----
  if (risk.industryImpact > 55 && controls.industrialOutput > 50) {
    actions.push({
      title: "Shift to Clean Industry",
      description: `Transition industrial output to renewable energy; reduce waste mismanagement from ${controls.wasteMismanagement}%.`,
      category: "waste",
      priority: "high",
      expectedImpact: "↑ Sustainability by 20%, ↓ Health risk by 12%",
      icon: "🏭",
    });
  }

  // Ensure we have at least 3 actionable recommendations
  while (actions.length < 3 && actions.length < 4) {
    if (!actions.find((a) => a.category === "energy")) {
      actions.push({
        title: "Smart Grid Optimization",
        description: `Deploy AI-managed smart grids to reduce peak load and waste by 5–8%.`,
        category: "air",
        priority: "medium",
        expectedImpact: "↑ Energy Efficiency by 8%, ↓ CO2 by 3%",
        icon: "⚡",
      });
    } else {
      break;
    }
  }

  return actions.slice(0, 3);
}

// ============================================================
// ZONE STATE FACTORY
// ============================================================

export function createInitialState(zoneId: string): DigitalTwinState {
  const zoneData = ZONES[zoneId] || ZONES["downtown-district"];

  return {
    zoneInfo: zoneData.info,
    live: { ...zoneData.baseline },
    baseline: { ...zoneData.baseline },
    controls: {
      treeCoverage: 34,
      trafficDensity: 65,
      rainfallStress: 20,
      industrialOutput: 45,
      wasteMismanagement: 15,
    },
    predicted: null,
    riskProfile: calculateRiskProfile(zoneData.baseline, zoneData.baseline),
    recommendations: [],
    lastSimulation: null,
  };
}

// ============================================================
// PRIMARY INTEGRATION FUNCTION
// ============================================================

export function updateDigitalTwinState(
  current: DigitalTwinState,
  newControls: Controls,
  shouldSimulate: boolean = false
): DigitalTwinState {
  // Always update controls
  const updated = { ...current, controls: newControls };

  // Simulate live metrics gradually based on control changes
  updated.live = simulateEnvironment(current.live, newControls, current.baseline);

  // Calculate risk for current state
  updated.riskProfile = calculateRiskProfile(updated.live, current.baseline);

  // If simulation requested, generate predicted future state
  if (shouldSimulate) {
    // Run simulation several steps into future for prediction
    let predicted = { ...updated.live };
    for (let i = 0; i < 5; i++) {
      predicted = simulateEnvironment(predicted, newControls, current.baseline);
    }
    updated.predicted = {
      ...predicted,
      timestamp: new Date().toISOString(),
    };
    updated.recommendations = generateActionPlan(updated.riskProfile, newControls, updated.live);
    updated.lastSimulation = new Date().toISOString();
  }

  return updated;
}

// ============================================================
// ZONE DATA LOADER
// ============================================================

export function getAvailableZones(): { id: string; info: ZoneInfo }[] {
  return Object.entries(ZONES).map(([id, data]) => ({
    id,
    info: data.info,
  }));
}

export function resetToBaseline(state: DigitalTwinState): DigitalTwinState {
  return {
    ...state,
    live: { ...state.baseline },
    predicted: null,
    riskProfile: calculateRiskProfile(state.baseline, state.baseline),
    recommendations: [],
    controls: {
      treeCoverage: 34,
      trafficDensity: 65,
      rainfallStress: 20,
      industrialOutput: 45,
      wasteMismanagement: 15,
    },
    lastSimulation: null,
  };
}
