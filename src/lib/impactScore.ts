/**
 * Impact Score Calculation
 * 
 * Leaderboard ranking is based on Impact Score, not raw credits.
 * Impact Score reflects the actual environmental improvement achieved.
 */

export interface ImpactMetrics {
  aqiImprovement: number; // Percentage (0-100)
  heatReduction: number; // Degrees Celsius (0-10)
  waterStressRelief: number; // Percentage (0-100)
  wasteReduction: number; // Percentage (0-100)
}

/**
 * Calculate Impact Score from environmental metrics
 * Weighted formula:
 * - AQI Improvement: 30% weight (most important for air quality)
 * - Heat Reduction: 25% weight
 * - Water Stress Relief: 25% weight
 * - Waste Reduction: 20% weight
 * 
 * Result is normalized to 0-100 scale
 */
export const calculateImpactScore = (metrics: ImpactMetrics): number => {
  // Weights for each metric
  const weights = {
    aqi: 0.3,
    heat: 0.25,
    water: 0.25,
    waste: 0.2,
  };

  // Normalize each metric to 0-100 scale
  const normalizedAqi = Math.min(metrics.aqiImprovement, 100); // 0-100%
  const normalizedHeat = Math.min((metrics.heatReduction / 10) * 100, 100); // 0-10°C → 0-100%
  const normalizedWater = Math.min(metrics.waterStressRelief, 100); // 0-100%
  const normalizedWaste = Math.min(metrics.wasteReduction, 100); // 0-100%

  // Apply weights
  const weightedScore =
    normalizedAqi * weights.aqi +
    normalizedHeat * weights.heat +
    normalizedWater * weights.water +
    normalizedWaste * weights.waste;

  // Round to nearest integer
  return Math.round(weightedScore);
};

/**
 * Calculate cumulative Impact Score for a user across multiple simulations
 * Takes average of all simulation impacts
 */
export const calculateCumulativeImpactScore = (simulationImpacts: number[]): number => {
  if (simulationImpacts.length === 0) return 0;
  const sum = simulationImpacts.reduce((a, b) => a + b, 0);
  return Math.round(sum / simulationImpacts.length);
};

/**
 * Get Impact Score breakdown for display
 */
export const getImpactBreakdown = (metrics: ImpactMetrics): {
  score: number;
  breakdown: { label: string; value: number; weight: number }[];
} => {
  const score = calculateImpactScore(metrics);
  const breakdown = [
    { label: "AQI Improvement", value: metrics.aqiImprovement, weight: 30 },
    { label: "Heat Reduction", value: metrics.heatReduction, weight: 25 },
    { label: "Water Stress Relief", value: metrics.waterStressRelief, weight: 25 },
    { label: "Waste Reduction", value: metrics.wasteReduction, weight: 20 },
  ];
  return { score, breakdown };
};
