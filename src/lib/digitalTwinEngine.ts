/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENVIRONMENTAL DIGITAL TWIN ENGINE
 * 
 * A real simulation core with environmental equations, stress functions,
 * and predictive simulation.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface EnvironmentalMetrics {
  aqi: number;
  temperature: number;
  co2: number;
  humidity: number;
  sustainabilityIndex: number;
  healthImpactScore: number;
  energyEfficiency: number;
}

export interface ControlState {
  treeCoverage: number;
  trafficDensity: number;
  rainfallStress: number;
  industrialOutput: number;
  wasteMismanagement: number;
}

export interface StressProfile {
  airQualityStress: number;
  thermalStress: number;
  waterStress: number;
  wasteStress: number;
  industrialStress: number;
  overallStress: number;
}

export interface Controls {
  treeCoverage: number; // 0-100
  trafficDensity: number; // 0-100
  rainfallStress: number; // 0-100
  industrialOutput: number; // 0-100
  wasteMismanagement: number; // 0-100
}


export interface RiskProfile {
  airQualityRisk: number;
  thermalRisk: number;
  waterRisk: number;
  wasteRisk: number;
  industrialRisk: number;
}

export interface ActionRecommendation {
  title: string;
  description: string;
  category: "air" | "heat" | "water" | "waste" | "energy" | "environment" | "transport" | "industry" | "waste";
  priority: "critical" | "high" | "medium";
  expectedImpact: string;
  icon: string;
}

export interface DigitalTwinState {
  zone: string;
  baseline: EnvironmentalMetrics;
  live: EnvironmentalMetrics;
  controls: ControlState;
  predicted: EnvironmentalMetrics | null;
  stress: StressProfile;
  risk: RiskProfile;
  recommendations: ActionRecommendation[];
  gridStress: GridCell[][];
  projectedImpact: ProjectedImpact | null;
  lastSimulation: string | null;
}

export interface GridCell {
  x: number;
  y: number;
  stress: number; // 0-100
  aqi: number;
  temperature: number;
  humidity: number;
  industrialLoad: number;
  wasteRisk: number;
}

export interface ProjectedImpact {
  environmentalImpactScore: number; // 0-100 (lower is better)
  healthImpactScore: number; // 0-100 (higher is better)
  economicRiskScore: number; // 0-100 (lower is better)
  sustainabilityScore: number; // 0-100 (higher is better)
  explanation: {
    airQualityChange: string;
    temperatureChange: string;
    co2Change: string;
    floodRiskChange: string;
  };
}

export interface StructuredActionPlan {
  priorityLevel: "critical" | "high" | "medium";
  mainRisk: string;
  whyItMatters: string;
  recommendedInterventions: string[];
  expectedOutcome: string;
  riskScore: number;
}

// ============================================================
// ZONE DATA
// ============================================================

export const ZONE_DATA: Record<
  string,
  {
    name: string;
    area: number;
    population: number;
    baseline: EnvironmentalMetrics;
  }
> = {
  "downtown-district": {
    name: "Downtown District",
    area: 12.4,
    population: 145000,
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
    name: "Industrial Zone",
    area: 18.2,
    population: 45000,
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
    name: "Green District",
    area: 8.9,
    population: 78000,
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
// IMPACT COEFFICIENTS
// ============================================================

const COEFFICIENTS = {
  trees: {
    aqiAbsorption: 0.6,
    co2Absorption: 0.15,
    coolingEffect: 0.08,
    healthBoost: 0.4,
    sustainabilityBoost: 0.5,
  },
  traffic: {
    aqiEmission: 0.45,
    co2Emission: 0.35,
    heatGeneration: 0.12,
    healthDetriment: 0.3,
    sustainabilityLoss: 0.4,
  },
  industry: {
    aqiEmission: 0.55,
    co2Emission: 0.5,
    heatGeneration: 0.15,
    healthDetriment: 0.4,
    sustainabilityLoss: 0.6,
  },
  rainfall: {
    humidityIncrease: 0.4,
    coolingEffect: 0.05,
    waterStressIncrease: 0.5,
  },
  waste: {
    waterContamination: 0.6,
    healthDetriment: 0.35,
    sustainabilityLoss: 0.5,
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function bound(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function noise(intensity: number = 1): number {
  return (Math.random() - 0.5) * 2 * intensity;
}

function smoothTransition(
  current: number,
  target: number,
  inertiaFactor: number = 0.15
): number {
  return current + (target - current) * inertiaFactor;
}

// ============================================================
// GRID COMPUTATION: ZONE IMPACT CELLS
// ============================================================

/**
 * Compute stress for each cell in a 12x12 grid
 * Each cell represents a micro-zone within the larger zone
 */
export function computeGridStress(
  metrics: EnvironmentalMetrics,
  controls: ControlState,
  baseline: EnvironmentalMetrics,
  gridSize: number = 12
): GridCell[][] {
  const grid: GridCell[][] = [];

  // Spatial variance: cells at different positions have slightly different stress levels
  // based on proximity to industrial/traffic sources
  for (let x = 0; x < gridSize; x++) {
    grid[x] = [];
    for (let y = 0; y < gridSize; y++) {
      // Spatial influence: edges have different stress patterns
      const proximityToIndustry = controls.industrialOutput * (1 - Math.abs(x - gridSize / 2) / (gridSize / 2)) * 0.3;
      const proximityToTraffic = controls.trafficDensity * (1 - Math.abs(y - gridSize / 2) / (gridSize / 2)) * 0.2;
      
      // Cell-level AQI with spatial variance
      const cellAqi = bound(
        metrics.aqi * (0.8 + 0.4 * Math.sin((x + y) / 3)) + proximityToIndustry + proximityToTraffic + noise(2),
        0,
        500
      );

      // Cell-level temperature with spatial variance
      const cellTemp = bound(
        metrics.temperature + proximityToIndustry * 0.5 + proximityToTraffic * 0.3 - controls.treeCoverage * 0.2 + noise(0.5),
        10,
        50
      );

      // Cell-level humidity with spatial variance
      const cellHumidity = bound(
        metrics.humidity + controls.rainfallStress * 0.3 + noise(1),
        20,
        100
      );

      // Cell-level industrial load
      const cellIndustrialLoad = controls.industrialOutput * (0.5 + 0.5 * Math.sin((x * y) / 10));

      // Cell-level waste risk
      const cellWasteRisk = controls.wasteMismanagement * (0.5 + 0.5 * Math.sin((x - y) / 5));

      // Compute cell stress: weighted combination of factors
      const aqiStress = Math.min(100, (cellAqi / 500) * 40);
      const tempStress = Math.min(100, (Math.abs(cellTemp - baseline.temperature) / 10) * 30);
      const humidityStress = Math.min(100, (Math.abs(cellHumidity - baseline.humidity) / 30) * 15);
      const industrialStress = cellIndustrialLoad * 10;
      const wasteStress = cellWasteRisk * 5;

      const cellStress = bound(
        (aqiStress * 0.35 + tempStress * 0.25 + humidityStress * 0.15 + industrialStress * 0.15 + wasteStress * 0.1),
        0,
        100
      );

      grid[x][y] = {
        x,
        y,
        stress: cellStress,
        aqi: cellAqi,
        temperature: cellTemp,
        humidity: cellHumidity,
        industrialLoad: cellIndustrialLoad,
        wasteRisk: cellWasteRisk,
      };
    }
  }

  return grid;
}

/**
 * Compute projected impact based on deltas between live and predicted metrics
 */
export function computeProjectedImpact(
  live: EnvironmentalMetrics,
  predicted: EnvironmentalMetrics,
  baseline: EnvironmentalMetrics
): ProjectedImpact {
  // Compute deltas
  const deltaAqi = predicted.aqi - live.aqi;
  const deltaTemp = predicted.temperature - live.temperature;
  const deltaCo2 = predicted.co2 - live.co2;
  const deltaHumidity = predicted.humidity - live.humidity;
  const deltaSustainability = predicted.sustainabilityIndex - live.sustainabilityIndex;
  const deltaHealth = predicted.healthImpactScore - live.healthImpactScore;

  // Environmental Impact: negative is good, positive is bad
  // Based on AQI and CO2 changes
  const environmentalImpactScore = bound(
    50 + (deltaAqi / baseline.aqi) * 30 + (deltaCo2 / baseline.co2) * 20,
    0,
    100
  );

  // Health Impact Score: higher is better
  // Based on health score delta
  const healthImpactScore = bound(
    deltaHealth + 50,
    0,
    100
  );

  // Economic Risk: lower is better
  // Based on industrial stress and temperature
  const economicRiskScore = bound(
    50 - deltaSustainability + Math.abs(deltaTemp) * 2,
    0,
    100
  );

  // Sustainability: higher is better
  // Direct from sustainability index change
  const sustainabilityScore = bound(
    predicted.sustainabilityIndex,
    0,
    100
  );

  // Generate explanations based on actual deltas
  const aqiChange = deltaAqi > 5 ? `AQI will increase by ${Math.round(deltaAqi)} points` : deltaAqi < -5 ? `AQI will decrease by ${Math.round(Math.abs(deltaAqi))} points` : "AQI will remain relatively stable";
  
  const tempChange = deltaTemp > 1 ? `Temperature will rise by ${deltaTemp.toFixed(1)}°C` : deltaTemp < -1 ? `Temperature will drop by ${Math.abs(deltaTemp).toFixed(1)}°C` : "Temperature will remain stable";
  
  const co2Change = deltaCo2 > 20 ? `CO₂ will increase by ${Math.round(deltaCo2)} ppm` : deltaCo2 < -20 ? `CO₂ will decrease by ${Math.round(Math.abs(deltaCo2))} ppm` : "CO₂ levels will remain stable";
  
  const floodChange = deltaHumidity > 10 ? "Flood risk will increase" : deltaHumidity < -10 ? "Flood risk will decrease" : "Flood risk will remain stable";

  return {
    environmentalImpactScore,
    healthImpactScore,
    economicRiskScore,
    sustainabilityScore,
    explanation: {
      airQualityChange: aqiChange,
      temperatureChange: tempChange,
      co2Change: co2Change,
      floodRiskChange: floodChange,
    },
  };
}

// ============================================================
// CORE SIMULATION: ENVIRONMENTAL EQUATIONS
// ============================================================

export function simulateEnvironment(
  currentMetrics: EnvironmentalMetrics,
  controls: ControlState,
  baseline: EnvironmentalMetrics,
  inertia: boolean = true
): EnvironmentalMetrics {
  const trees = controls.treeCoverage / 100;
  const traffic = controls.trafficDensity / 100;
  const industry = controls.industrialOutput / 100;
  const rainfall = controls.rainfallStress / 100;
  const waste = controls.wasteMismanagement / 100;

  // ─── AQI ───────────────────────────────────────────────────────────────
  const aqiTraffic = traffic * baseline.aqi * COEFFICIENTS.traffic.aqiEmission;
  const aqiIndustry = industry * baseline.aqi * COEFFICIENTS.industry.aqiEmission;
  const aqiTrees = trees * baseline.aqi * COEFFICIENTS.trees.aqiAbsorption;
  const aqiTarget = bound(baseline.aqi + aqiTraffic + aqiIndustry - aqiTrees + noise(2), 0, 500);
  const aqi = inertia ? smoothTransition(currentMetrics.aqi, aqiTarget, 0.1) : aqiTarget;

  // ─── Temperature ───────────────────────────────────────────────────────
  const tempTraffic = traffic * COEFFICIENTS.traffic.heatGeneration;
  const tempIndustry = industry * COEFFICIENTS.industry.heatGeneration;
  const tempTrees = trees * COEFFICIENTS.trees.coolingEffect;
  const tempRainfall = rainfall * COEFFICIENTS.rainfall.coolingEffect;
  const tempTarget = bound(baseline.temperature + tempTraffic + tempIndustry - tempTrees - tempRainfall + noise(0.3), 10, 50);
  const temperature = inertia ? smoothTransition(currentMetrics.temperature, tempTarget, 0.12) : tempTarget;

  // ─── CO₂ ───────────────────────────────────────────────────────────────
  const co2Traffic = traffic * baseline.co2 * COEFFICIENTS.traffic.co2Emission;
  const co2Industry = industry * baseline.co2 * COEFFICIENTS.industry.co2Emission;
  const co2Trees = trees * baseline.co2 * COEFFICIENTS.trees.co2Absorption;
  const co2Target = bound(baseline.co2 + co2Traffic + co2Industry - co2Trees + noise(5), 250, 1200);
  const co2 = inertia ? smoothTransition(currentMetrics.co2, co2Target, 0.11) : co2Target;

  // ─── Humidity ───────────────────────────────────────────────────────────
  const humidityRainfall = rainfall * COEFFICIENTS.rainfall.humidityIncrease * 10;
  const humidityTarget = bound(baseline.humidity + humidityRainfall + noise(1.5), 20, 100);
  const humidity = inertia ? smoothTransition(currentMetrics.humidity, humidityTarget, 0.08) : humidityTarget;

  // ─── Sustainability Index ──────────────────────────────────────────────
  const sustainabilityTrees = trees * COEFFICIENTS.trees.sustainabilityBoost * 8;
  const sustainabilityTraffic = traffic * COEFFICIENTS.traffic.sustainabilityLoss * 6;
  const sustainabilityIndustry = industry * COEFFICIENTS.industry.sustainabilityLoss * 8;
  const sustainabilityWaste = waste * COEFFICIENTS.waste.sustainabilityLoss * 5;
  const sustainabilityTarget = bound(
    baseline.sustainabilityIndex + sustainabilityTrees - sustainabilityTraffic - sustainabilityIndustry - sustainabilityWaste + noise(1),
    0,
    100
  );
  const sustainabilityIndex = inertia ? smoothTransition(currentMetrics.sustainabilityIndex, sustainabilityTarget, 0.1) : sustainabilityTarget;

  // ─── Health Impact Score ────────────────────────────────────────────────
  const healthTrees = trees * COEFFICIENTS.trees.healthBoost * 5;
  const healthTraffic = traffic * COEFFICIENTS.traffic.healthDetriment * 4;
  const healthIndustry = industry * COEFFICIENTS.industry.healthDetriment * 5;
  const healthWaste = waste * COEFFICIENTS.waste.healthDetriment * 3;
  const healthTarget = bound(
    baseline.healthImpactScore + healthTrees - healthTraffic - healthIndustry - healthWaste + noise(1),
    0,
    100
  );
  const healthImpactScore = inertia ? smoothTransition(currentMetrics.healthImpactScore, healthTarget, 0.1) : healthTarget;

  // ─── Energy Efficiency ──────────────────────────────────────────────────
  const energyTrees = trees * 2;
  const energyRainfall = rainfall * 1.5;
  const energyTraffic = traffic * 2.5;
  const energyIndustry = industry * 3;
  const energyTarget = bound(baseline.energyEfficiency + energyTrees + energyRainfall - energyTraffic - energyIndustry + noise(0.5), 0, 100);
  const energyEfficiency = inertia ? smoothTransition(currentMetrics.energyEfficiency, energyTarget, 0.1) : energyTarget;

  return {
    aqi,
    temperature,
    co2,
    humidity,
    sustainabilityIndex,
    healthImpactScore,
    energyEfficiency,
  };
}

// ============================================================
// STRESS PROFILE COMPUTATION
// ============================================================

export function computeStressProfile(
  metrics: EnvironmentalMetrics,
  controls: ControlState,
  baseline: EnvironmentalMetrics
): StressProfile {
  // Air Quality Stress: deviation from baseline AQI and CO2
  const aqiDeviation = Math.max(0, metrics.aqi - baseline.aqi);
  const co2Deviation = Math.max(0, metrics.co2 - baseline.co2);
  const airQualityStress = Math.min(100, (aqiDeviation / (baseline.aqi + 1)) * 40 + (co2Deviation / (baseline.co2 + 1)) * 30);

  // Thermal Stress: temperature deviation
  const tempDeviation = Math.abs(metrics.temperature - baseline.temperature);
  const thermalStress = Math.min(100, (tempDeviation / 10) * 50);

  // Water Stress: humidity deficit and waste impact
  const humidityDeficit = Math.max(0, baseline.humidity - metrics.humidity);
  const wasteImpact = controls.wasteMismanagement * 0.3;
  const waterStress = Math.min(100, (humidityDeficit / 30) * 50 + wasteImpact);

  // Waste Stress: direct from waste mismanagement
  const wasteStress = controls.wasteMismanagement * 0.8;

  // Industrial Stress: industrial output combined with sustainability loss
  const industrialOutput = controls.industrialOutput;
  const sustainabilityLoss = baseline.sustainabilityIndex - metrics.sustainabilityIndex;
  const industrialStress = Math.min(100, (industrialOutput * 0.5) + (sustainabilityLoss * 0.3));

  // Overall Stress: weighted combination of all stresses
  const overallStress = Math.min(
    100,
    (airQualityStress * 0.25 + thermalStress * 0.2 + waterStress * 0.15 + wasteStress * 0.15 + industrialStress * 0.25)
  );

  return {
    airQualityStress: Math.round(airQualityStress * 10) / 10,
    thermalStress: Math.round(thermalStress * 10) / 10,
    waterStress: Math.round(waterStress * 10) / 10,
    wasteStress: Math.round(wasteStress * 10) / 10,
    industrialStress: Math.round(industrialStress * 10) / 10,
    overallStress: Math.round(overallStress * 10) / 10,
  };
}

// ============================================================
// RISK PROFILE COMPUTATION
// ============================================================

export function computeRiskProfile(stress: StressProfile): RiskProfile {
  return {
    airQualityRisk: stress.airQualityStress,
    thermalRisk: stress.thermalStress,
    waterRisk: stress.waterStress,
    wasteRisk: stress.wasteStress,
    industrialRisk: stress.industrialStress,
  };
}

// ============================================================
// ACTION PLAN GENERATOR (ALGORITHMIC)
// ============================================================

export function generateActionPlan(
  risk: RiskProfile,
  metrics: EnvironmentalMetrics,
  controls: ControlState,
  baseline: EnvironmentalMetrics
): ActionRecommendation[] {
  const recommendations: ActionRecommendation[] = [];

  // Sort threats by score
  const threats = [
    { risk: risk.airQualityRisk, type: "air", name: "Air Quality Risk" },
    { risk: risk.thermalRisk, type: "thermal", name: "Thermal Stress" },
    { risk: risk.waterRisk, type: "water", name: "Water Stress" },
    { risk: risk.wasteRisk, type: "waste", name: "Waste Stress" },
    { risk: risk.industrialRisk, type: "industrial", name: "Industrial Impact" },
  ].sort((a, b) => b.risk - a.risk);

  // ─── Top Threat #1: AIR QUALITY ─────────────────────────────────────
  if (threats[0].risk === risk.airQualityRisk && risk.airQualityRisk > 50) {
    // Recommend trees if below optimal
    if (controls.treeCoverage < 75) {
      const treeBoost = Math.min(30, (75 - controls.treeCoverage) * 0.4);
      recommendations.push({
        title: "Expand Urban Forest",
        description: `Increase tree coverage from ${Math.round(controls.treeCoverage)}% to 75%+. Trees absorb CO₂ and reduce particulates.`,
        category: "environment",
        priority: "critical",
        expectedImpact: `↓ AQI by ${Math.round(treeBoost)} points, ↓ CO₂ by 8%`,
        icon: "🌳",
      });
    }

    // Recommend traffic reduction if traffic is high
    if (controls.trafficDensity > 60) {
      const trafficReduction = Math.min(20, controls.trafficDensity * 0.25);
      recommendations.push({
        title: "Implement Congestion Pricing",
        description: `Reduce traffic density from ${Math.round(controls.trafficDensity)}% by introducing congestion charges.`,
        category: "transport",
        priority: "high",
        expectedImpact: `↓ AQI by ${Math.round(trafficReduction)}%, ↓ CO₂ by 5–7%`,
        icon: "🚗",
      });
    }

    // Recommend industrial controls if industry is high
    if (controls.industrialOutput > 50) {
      recommendations.push({
        title: "Industrial Emission Controls",
        description: `Deploy scrubbers and emission reduction tech at industrial sites.`,
        category: "industry",
        priority: "high",
        expectedImpact: `↓ AQI by 15–20%, ↑ Health score by 10%`,
        icon: "🏭",
      });
    }
  }

  // ─── Top Threat #2: THERMAL STRESS ──────────────────────────────────
  if (threats[0].risk === risk.thermalRisk && risk.thermalRisk > 50) {
    recommendations.push({
      title: "Cool Roofs Initiative",
      description: `Deploy reflective coatings and green roofs to reduce urban heat island effect.`,
      category: "environment",
      priority: "critical",
      expectedImpact: `↓ Temperature by 2–3°C, ↑ Energy Efficiency by 12%`,
      icon: "❄️",
    });

    if (controls.treeCoverage < 70) {
      recommendations.push({
        title: "Plant Shade Trees",
        description: `Plant fast-growing deciduous trees for immediate summer cooling.`,
        category: "environment",
        priority: "high",
        expectedImpact: `↓ Temperature by 1–2°C in shaded areas`,
        icon: "🌳",
      });
    }
  }

  // ─── Top Threat #3: WATER STRESS ────────────────────────────────────
  if (threats[0].risk === risk.waterRisk && risk.waterRisk > 50) {
    recommendations.push({
      title: "Rainwater Harvesting Network",
      description: `Install cisterns and rain gardens to capture rainfall.`,
      category: "water",
      priority: "high",
      expectedImpact: `↓ Water stress by 15–20%, ↑ Sustainability by 8%`,
      icon: "💧",
    });

    if (controls.wasteMismanagement > 30) {
      recommendations.push({
        title: "Wastewater Treatment Plants",
        description: `Upgrade treatment infrastructure to recycle wastewater.`,
        category: "water",
        priority: "high",
        expectedImpact: `↓ Water contamination by 25%, ↑ Health by 8%`,
        icon: "🚰",
      });
    }
  }

  // ─── Top Threat #4: WASTE MANAGEMENT ────────────────────────────────
  if (threats[0].risk === risk.wasteRisk && risk.wasteRisk > 50) {
    recommendations.push({
      title: "Circular Economy Program",
      description: `Introduce composting, recycling, and zero-waste initiatives to reduce mismanagement.`,
      category: "waste",
      priority: "critical",
      expectedImpact: `↓ Waste stress by 30%, ↑ Health by 15%`,
      icon: "♻️",
    });
  }

  // ─── Top Threat #5: INDUSTRIAL ──────────────────────────────────────
  if (threats[0].risk === risk.industrialRisk && risk.industrialRisk > 55) {
    recommendations.push({
      title: "Green Industry Transition",
      description: `Shift industrial output to renewable energy and clean tech.`,
      category: "industry",
      priority: "critical",
      expectedImpact: `↑ Sustainability by 20%, ↓ Health risk by 12%`,
      icon: "⚡",
    });
  }

  // ─── FALLBACK: If no threats detected, recommend maintenance ─────────
  if (recommendations.length === 0) {
    recommendations.push({
      title: "Smart Grid Optimization",
      description: `Optimize energy distribution to reduce waste and peak load.`,
      category: "energy",
      priority: "medium",
      expectedImpact: `↑ Energy Efficiency by 8%, ↓ CO₂ by 3%`,
      icon: "⚡",
    });
  }

  return recommendations.slice(0, 3);
}

// ============================================================
// STRUCTURED ACTION PLAN: PROFESSIONAL OUTPUT
// ============================================================

export function generateStructuredActionPlan(
  risk: RiskProfile,
  metrics: EnvironmentalMetrics,
  baseline: EnvironmentalMetrics,
  controls: ControlState
): StructuredActionPlan[] {
  const plans: StructuredActionPlan[] = [];

  // Rank threats by risk score
  const threats = [
    {
      risk: risk.airQualityRisk,
      name: "Air Quality Crisis",
      deltaAqi: metrics.aqi - baseline.aqi,
      deltaCo2: metrics.co2 - baseline.co2,
    },
    {
      risk: risk.thermalRisk,
      name: "Thermal Stress",
      deltaTemp: metrics.temperature - baseline.temperature,
    },
    {
      risk: risk.waterRisk,
      name: "Water & Flood Risk",
      deltaHumidity: metrics.humidity - baseline.humidity,
    },
    {
      risk: risk.wasteRisk,
      name: "Waste Management Crisis",
      deltaHealth: metrics.healthImpactScore - baseline.healthImpactScore,
    },
    {
      risk: risk.industrialRisk,
      name: "Industrial Pollution",
      deltaSustainability: metrics.sustainabilityIndex - baseline.sustainabilityIndex,
    },
  ].sort((a, b) => b.risk - a.risk);

  // ─── AIR QUALITY ────────────────────────────────────────────────────
  if (threats[0].risk === risk.airQualityRisk && risk.airQualityRisk > 50) {
    const deltaAqi = threats[0].deltaAqi || 0;
    const deltaCo2 = threats[0].deltaCo2 || 0;

    plans.push({
      priorityLevel: risk.airQualityRisk > 75 ? "critical" : "high",
      mainRisk: `Air quality degradation: AQI ${(baseline.aqi + deltaAqi).toFixed(0)} (baseline: ${baseline.aqi.toFixed(0)})`,
      whyItMatters: deltaAqi > 0
        ? `Rising AQI indicates increased vehicular emissions (traffic: ${controls.trafficDensity.toFixed(0)}%) and industrial output (${controls.industrialOutput.toFixed(0)}%). Low tree coverage (${controls.treeCoverage.toFixed(0)}%) cannot absorb pollutants.`
        : "Air quality remains degraded despite some mitigation efforts.",
      recommendedInterventions: [
        controls.treeCoverage < 70 ? "Expand urban forest to 70%+ coverage for CO2 absorption" : "Maintain aggressive tree planting programs",
        controls.trafficDensity > 60 ? "Implement congestion pricing to reduce traffic from 60% to 40%" : "Continue traffic management measures",
        controls.industrialOutput > 50 ? "Deploy emission control tech at industrial sites; consider green industrial transition" : "Expand industrial emission controls",
      ],
      expectedOutcome: `In 30 days: AQI → ${(baseline.aqi + deltaAqi * 0.5).toFixed(0)} (50% improvement), CO₂ → ${(baseline.co2 + deltaCo2 * 0.6).toFixed(0)} ppm with consistent controls`,
      riskScore: risk.airQualityRisk,
    });
  }

  // ─── THERMAL STRESS ─────────────────────────────────────────────────
  if (threats[0].risk === risk.thermalRisk && risk.thermalRisk > 50) {
    const deltaTemp = threats[0].deltaTemp || 0;

    plans.push({
      priorityLevel: risk.thermalRisk > 70 ? "critical" : "high",
      mainRisk: `Urban heat island: Temperature ${(baseline.temperature + deltaTemp).toFixed(1)}°C (baseline: ${baseline.temperature.toFixed(1)}°C)`,
      whyItMatters: deltaTemp > 0
        ? `Industrial output (${controls.industrialOutput.toFixed(0)}%) and traffic (${controls.trafficDensity.toFixed(0)}%) generate heat. Low tree coverage and rainfall stress exacerbate the problem.`
        : "Temperature elevated due to anthropogenic heat sources and low vegetation.",
      recommendedInterventions: [
        "Deploy cool roof initiative: reflective coatings on 40%+ of buildings",
        controls.treeCoverage < 70 ? "Plant shade trees in public spaces and along roads" : "Expand tree canopy coverage in urban core",
        "Create green spaces and water features to aid evaporative cooling",
      ],
      expectedOutcome: `In 30 days: Temperature → ${(baseline.temperature + deltaTemp * 0.4).toFixed(1)}°C (40% reduction), reduced heat mortality risk by 15–25%`,
      riskScore: risk.thermalRisk,
    });
  }

  // ─── WATER STRESS ──────────────────────────────────────────────────
  if (threats[0].risk === risk.waterRisk && risk.waterRisk > 50) {
    const deltaHumidity = threats[0].deltaHumidity || 0;

    plans.push({
      priorityLevel: risk.waterRisk > 70 ? "critical" : "high",
      mainRisk: `Water scarcity and flood risk: Humidity ${(baseline.humidity + deltaHumidity).toFixed(0)}% (baseline: ${baseline.humidity.toFixed(0)}%)`,
      whyItMatters: `Low rainfall stress (${controls.rainfallStress.toFixed(0)}%) combined with waste mismanagement (${controls.wasteMismanagement.toFixed(0)}%) creates water infrastructure strain.`,
      recommendedInterventions: [
        "Install rainwater harvesting systems and rain gardens across the zone",
        controls.wasteMismanagement > 30 ? "Build advanced wastewater treatment plants to recycle 60%+ of water" : "Upgrade existing water reclamation infrastructure",
        "Implement green infrastructure: permeable pavements, wetlands for flood absorption",
      ],
      expectedOutcome: `In 30 days: Humidity → ${(baseline.humidity + deltaHumidity * 0.5).toFixed(0)}%, water stress reduced by 20–30%, infrastructure resilience +25%`,
      riskScore: risk.waterRisk,
    });
  }

  // ─── WASTE MANAGEMENT ──────────────────────────────────────────────
  if (threats[0].risk === risk.wasteRisk && risk.wasteRisk > 50) {
    const deltaHealth = threats[0].deltaHealth || 0;

    plans.push({
      priorityLevel: risk.wasteRisk > 70 ? "critical" : "high",
      mainRisk: `Waste mismanagement at ${controls.wasteMismanagement.toFixed(0)}% impact level`,
      whyItMatters: `Uncontrolled waste contaminates water sources, reduces health scores, and degrades sustainability. Health impact: ${(baseline.healthImpactScore + deltaHealth).toFixed(0)}/100`,
      recommendedInterventions: [
        "Launch circular economy: 70%+ waste recycling and composting",
        "Build waste-to-energy facilities; hazardous waste containment infrastructure",
        "Community education: waste segregation and reduced consumption",
      ],
      expectedOutcome: `In 30 days: Waste stress → ${(controls.wasteMismanagement * 0.4).toFixed(0)}%, health score → ${(baseline.healthImpactScore + deltaHealth * 0.6).toFixed(0)}/100, sustainability +20%`,
      riskScore: risk.wasteRisk,
    });
  }

  // ─── INDUSTRIAL IMPACT ─────────────────────────────────────────────
  if (threats[0].risk === risk.industrialRisk && risk.industrialRisk > 55) {
    const deltaSustainability = threats[0].deltaSustainability || 0;

    plans.push({
      priorityLevel: "critical",
      mainRisk: `Industrial pollution at ${controls.industrialOutput.toFixed(0)}% output`,
      whyItMatters: `Heavy industrial activity without clean tech transition degrades all environmental metrics. Sustainability: ${(baseline.sustainabilityIndex + deltaSustainability).toFixed(0)}/100`,
      recommendedInterventions: [
        "Industrial transition: 50%+ switch to renewable energy within 12 months",
        "Mandate pollution control tech: scrubbers, emission filters, closed-loop water systems",
        "Incentivize clean manufacturing; phase out heavy polluters",
      ],
      expectedOutcome: `In 30 days: Industrial stress halved, CO₂ emissions ↓ 20%, sustainability → ${Math.min(100, (baseline.sustainabilityIndex + deltaSustainability + 15)).toFixed(0)}/100, health restored`,
      riskScore: risk.industrialRisk,
    });
  }

  // Return top 3 by risk score
  return plans.slice(0, 3);
}

// ============================================================
// STATE ORCHESTRATION
// ============================================================

/**
 * Initialize a new Digital Twin state for a zone
 */
export function initializeDigitalTwin(zoneId: string): DigitalTwinState {
  // Default to downtown-district if invalid zone ID
  const actualZoneId = ZONE_DATA[zoneId] ? zoneId : "downtown-district";
  const zoneData = ZONE_DATA[actualZoneId];

  const baseline: EnvironmentalMetrics = { ...zoneData.baseline };
  const live: EnvironmentalMetrics = { ...zoneData.baseline };

  const controls: ControlState = {
    treeCoverage: 34,
    trafficDensity: 65,
    rainfallStress: 20,
    industrialOutput: 45,
    wasteMismanagement: 15,
  };

  const stress = computeStressProfile(live, controls, baseline);
  const risk = computeRiskProfile(stress);
  const gridStress = computeGridStress(live, controls, baseline);

  return {
    zone: actualZoneId,
    baseline,
    live,
    controls,
    predicted: null,
    stress,
    risk,
    recommendations: generateActionPlan(risk, live, controls, baseline),
    gridStress,
    projectedImpact: null,
    lastSimulation: null,
  };
}

/**
 * Update control state and compute live environment
 */
export function updateControls(
  state: DigitalTwinState,
  newControls: Partial<ControlState>
): DigitalTwinState {
  const controls = { ...state.controls, ...newControls };

  // Simulate live environment with new controls
  const live = simulateEnvironment(state.live, controls, state.baseline, true);

  // Compute stress and risk
  const stress = computeStressProfile(live, controls, state.baseline);
  const risk = computeRiskProfile(stress);

  // Generate recommendations
  const recommendations = generateActionPlan(risk, live, controls, state.baseline);

  // Compute grid stress
  const gridStress = computeGridStress(live, controls, state.baseline);

  return {
    ...state,
    controls,
    live,
    stress,
    risk,
    recommendations,
    gridStress,
  };
}

/**
 * Run a simulation for N steps into the future
 */
export function runSimulation(
  state: DigitalTwinState,
  steps: number = 30
): DigitalTwinState {
  let predicted = { ...state.live };

  // Simulate forward with compounding effects
  for (let i = 0; i < steps; i++) {
    predicted = simulateEnvironment(predicted, state.controls, state.baseline, true);
  }

  // Compute projected impact from deltas
  const projectedImpact = computeProjectedImpact(state.live, predicted, state.baseline);

  return {
    ...state,
    predicted,
    projectedImpact,
    lastSimulation: new Date().toISOString(),
  };
}

/**
 * Reset zone to baseline state
 */
export function resetZone(state: DigitalTwinState): DigitalTwinState {
  const resetControls: ControlState = {
    treeCoverage: 34,
    trafficDensity: 65,
    rainfallStress: 20,
    industrialOutput: 45,
    wasteMismanagement: 15,
  };

  const resetStress = computeStressProfile(state.baseline, resetControls, state.baseline);
  const resetRisk = computeRiskProfile(resetStress);
  const resetGridStress = computeGridStress(state.baseline, resetControls, state.baseline);

  return {
    ...state,
    live: { ...state.baseline },
    controls: resetControls,
    predicted: null,
    stress: resetStress,
    risk: resetRisk,
    recommendations: [],
    gridStress: resetGridStress,
    projectedImpact: null,
    lastSimulation: null,
  };
}

/**
 * Tick live environment (1 second simulated passage)
 * Used for real-time updates without user control changes
 */
export function tickLiveEnvironment(state: DigitalTwinState): DigitalTwinState {
  const live = simulateEnvironment(state.live, state.controls, state.baseline, true);
  const stress = computeStressProfile(live, state.controls, state.baseline);
  const risk = computeRiskProfile(stress);
  const gridStress = computeGridStress(live, state.controls, state.baseline);

  return {
    ...state,
    live,
    stress,
    risk,
    gridStress,
  };
}

/**
 * Get available zones
 */
export function getAvailableZones(): { id: string; name: string; area: number; population: number }[] {
  return Object.entries(ZONE_DATA).map(([id, data]) => ({
    id,
    name: data.name,
    area: data.area,
    population: data.population,
  }));
}

// ============================================================
// IMPACT REPORT GENERATION (HTML)
// ============================================================

/**
 * Generate a comprehensive HTML impact report and trigger download
 */
export function generateAndDownloadImpactReport(state: DigitalTwinState): void {
  const zone = ZONE_DATA[state.zone];
  const timestamp = new Date().toLocaleString();
  
  // Calculate deltas
  const deltaAqi = state.predicted ? state.predicted.aqi - state.live.aqi : 0;
  const deltaTemp = state.predicted ? state.predicted.temperature - state.live.temperature : 0;
  const deltaCo2 = state.predicted ? state.predicted.co2 - state.live.co2 : 0;
  const deltaHumidity = state.predicted ? state.predicted.humidity - state.live.humidity : 0;
  const deltaSustainability = state.predicted ? state.predicted.sustainabilityIndex - state.live.sustainabilityIndex : 0;
  const deltaHealth = state.predicted ? state.predicted.healthImpactScore - state.live.healthImpactScore : 0;

  // Calculate grid stats
  const totalCells = state.gridStress.length * state.gridStress[0].length;
  const criticalCells = state.gridStress.flat().filter(c => c.stress > 75).length;
  const riskyCells = state.gridStress.flat().filter(c => c.stress > 50 && c.stress <= 75).length;
  const moderateCells = state.gridStress.flat().filter(c => c.stress > 25 && c.stress <= 50).length;
  const healthyCells = state.gridStress.flat().filter(c => c.stress <= 25).length;

  // Generate structured action plans
  const actionPlans = generateStructuredActionPlan(state.risk, state.live, state.baseline, state.controls);

  const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Environmental Digital Twin - Impact Report</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;line-height:1.6;color:#1a1a1a;background:#f5f5f5;}.container{max-width:1000px;margin:0 auto;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.1);}.header{background:linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);color:white;padding:40px;text-align:center;}.header h1{font-size:2.5em;margin-bottom:10px;}.section{margin-bottom:40px;border-bottom:2px solid #f0f0f0;padding-bottom:30px;}.section:last-child{border-bottom:none;}.section-title{font-size:1.8em;margin-bottom:20px;color:#0ea5e9;font-weight:600;}.grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:20px;margin-bottom:20px;}.card{background:#f9f9f9;border:1px solid #e0e0e0;border-radius:8px;padding:20px;}.metric{font-size:2em;font-weight:bold;color:#0ea5e9;margin:10px 0;}.unit{font-size:0.5em;color:#666;margin-left:5px;}table{width:100%;border-collapse:collapse;margin:20px 0;}th,td{padding:12px;text-align:left;border-bottom:1px solid #e0e0e0;}th{background:#f0f0f0;font-weight:600;}.positive{color:#22c55e;}.negative{color:#ef4444;}.neutral{color:#888;}.priority-critical{background:#fee2e2;color:#dc2626;padding:2px 8px;border-radius:4px;font-weight:600;font-size:0.85em;}.recommendation{background:#eff6ff;border-left:4px solid #0ea5e9;padding:15px;margin:15px 0;border-radius:4px;}.list{margin-left:20px;}.list li{margin:8px 0;}.footer{background:#f5f5f5;padding:20px 40px;text-align:center;font-size:0.9em;color:#666;border-top:1px solid #e0e0e0;}.stress-grid-stats{display:grid;grid-template-columns:repeat(4, 1fr);gap:15px;margin:20px 0;}.stress-stat{padding:15px;border-radius:8px;text-align:center;}.stress-stat-value{font-size:2em;font-weight:bold;margin:10px 0;}</style></head><body><div class="container"><div class="header"><h1>🌍 Environmental Digital Twin Report</h1><p>${zone?.name || 'Unknown Zone'} | ${timestamp}</p></div><div class="content" style="padding:40px;"><div class="section"><h2 class="section-title">Zone Overview</h2><div class="grid"><div class="card"><div class="card-title">Zone</div><div class="metric">${zone?.name || 'N/A'}</div></div><div class="card"><div class="card-title">Area</div><div class="metric">${zone?.area.toFixed(1) || 'N/A'}<span class="unit">km²</span></div></div><div class="card"><div class="card-title">Population</div><div class="metric">${(zone?.population || 0).toLocaleString()}</div></div></div></div><div class="section"><h2 class="section-title">Live Metrics vs Baseline</h2><table><tr><th>Metric</th><th>Baseline</th><th>Current</th><th>Delta</th></tr><tr><td><strong>AQI</strong></td><td>${state.baseline.aqi.toFixed(1)}</td><td>${state.live.aqi.toFixed(1)}</td><td class="${deltaAqi > 5 ? 'negative' : 'positive'}">${deltaAqi >= 0 ? '+' : ''}${deltaAqi.toFixed(1)}</td></tr><tr><td><strong>Temperature</strong></td><td>${state.baseline.temperature.toFixed(1)}°C</td><td>${state.live.temperature.toFixed(1)}°C</td><td class="${deltaTemp > 0 ? 'negative' : 'positive'}">${deltaTemp >= 0 ? '+' : ''}${deltaTemp.toFixed(1)}°C</td></tr><tr><td><strong>CO₂</strong></td><td>${state.baseline.co2.toFixed(0)} ppm</td><td>${state.live.co2.toFixed(0)} ppm</td><td class="${deltaCo2 > 20 ? 'negative' : 'positive'}">${deltaCo2 >= 0 ? '+' : ''}${deltaCo2.toFixed(0)}</td></tr><tr><td><strong>Humidity</strong></td><td>${state.baseline.humidity.toFixed(0)}%</td><td>${state.live.humidity.toFixed(0)}%</td><td class="${Math.abs(deltaHumidity) > 5 ? (deltaHumidity > 0 ? 'positive' : 'negative') : 'neutral'}">${deltaHumidity >= 0 ? '+' : ''}${deltaHumidity.toFixed(0)}%</td></tr><tr><td><strong>Sustainability</strong></td><td>${state.baseline.sustainabilityIndex.toFixed(0)}/100</td><td>${state.live.sustainabilityIndex.toFixed(0)}/100</td><td class="${deltaSustainability > 0 ? 'positive' : 'negative'}">${deltaSustainability >= 0 ? '+' : ''}${deltaSustainability.toFixed(0)}</td></tr><tr><td><strong>Health</strong></td><td>${state.baseline.healthImpactScore.toFixed(0)}/100</td><td>${state.live.healthImpactScore.toFixed(0)}/100</td><td class="${deltaHealth > 0 ? 'positive' : 'negative'}">${deltaHealth >= 0 ? '+' : ''}${deltaHealth.toFixed(0)}</td></tr></table></div><div class="section"><h2 class="section-title">Controls</h2><div class="grid"><div class="card"><div class="card-title">Tree Coverage</div><div class="metric">${state.controls.treeCoverage.toFixed(0)}<span class="unit">%</span></div></div><div class="card"><div class="card-title">Traffic</div><div class="metric">${state.controls.trafficDensity.toFixed(0)}<span class="unit">%</span></div></div><div class="card"><div class="card-title">Rainfall</div><div class="metric">${state.controls.rainfallStress.toFixed(0)}<span class="unit">%</span></div></div><div class="card"><div class="card-title">Industry</div><div class="metric">${state.controls.industrialOutput.toFixed(0)}<span class="unit">%</span></div></div><div class="card"><div class="card-title">Waste</div><div class="metric">${state.controls.wasteMismanagement.toFixed(0)}<span class="unit">%</span></div></div></div></div><div class="section"><h2 class="section-title">Zone Stress Grid (Critical: ${criticalCells}/${totalCells})</h2><div class="stress-grid-stats"><div class="stress-stat" style="background:#bbf7d0"><strong>${healthyCells}</strong><br>Healthy</div><div class="stress-stat" style="background:#fef08a"><strong>${moderateCells}</strong><br>Moderate</div><div class="stress-stat" style="background:#fed7aa"><strong>${riskyCells}</strong><br>Risky</div><div class="stress-stat" style="background:#fecaca"><strong>${criticalCells}</strong><br>Critical</div></div></div><div class="section"><h2 class="section-title">Stress Profile</h2><div class="grid"><div class="card"><div class="card-title">Air Quality</div><div class="metric">${state.stress.airQualityStress.toFixed(1)}</div></div><div class="card"><div class="card-title">Thermal</div><div class="metric">${state.stress.thermalStress.toFixed(1)}</div></div><div class="card"><div class="card-title">Water</div><div class="metric">${state.stress.waterStress.toFixed(1)}</div></div><div class="card"><div class="card-title">Waste</div><div class="metric">${state.stress.wasteStress.toFixed(1)}</div></div><div class="card"><div class="card-title">Industrial</div><div class="metric">${state.stress.industrialStress.toFixed(1)}</div></div><div class="card"><div class="card-title"><strong>Overall</strong></div><div class="metric">${state.stress.overallStress.toFixed(1)}</div></div></div></div><div class="section"><h2 class="section-title">Action Plan</h2>${actionPlans.map((plan, i) => `<div class="recommendation"><strong class="priority-critical">${plan.priorityLevel}</strong> ${plan.mainRisk}<p style="margin-top:10px;color:#666;">${plan.whyItMatters}</p><p style="margin-top:10px;"><strong>Interventions:</strong></p><ul class="list">${plan.recommendedInterventions.map(x => `<li>${x}</li>`).join('')}</ul><p style="margin-top:10px;color:#0ea5e9;"><strong>Expected:</strong> ${plan.expectedOutcome}</p></div>`).join('')}</div></div><div class="footer"><p>GreenGrid Environmental Digital Twin Report | Report ID: ${Date.now()}</p></div></div></body></html>`;

  // Create blob and trigger download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `GreenGrid-Impact-Report-${zone?.name?.replace(/\s+/g, '-') || 'Zone'}-${new Date().toISOString().split('T')[0]}.html`;
  link.click();
  URL.revokeObjectURL(link.href);
}

