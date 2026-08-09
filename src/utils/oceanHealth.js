import { coralReefData, pollutionData, phLevelData, temperatureData } from "../data/mockData";

/**
 * Calculates dynamic Ocean Health Score based on weighted metrics:
 * - 40% Biodiversity (Coral Reef Health average)
 * - 30% Pollution (Inverted plastic pollution average)
 * - 20% pH Level (Normalized against 8.1 safe baseline)
 * - 10% Temperature (Inverted sea surface temperature anomaly)
 */
export function calculateOceanHealth(
  reefs = coralReefData,
  pollution = pollutionData,
  ph = phLevelData,
  temp = temperatureData
) {
  // 1. Biodiversity score (40% weight) - average reef health score (0-100)
  const avgReefHealth = reefs.length > 0
    ? reefs.reduce((acc, r) => acc + r.health, 0) / reefs.length
    : 70;

  // 2. Pollution score (30% weight) - 100 minus average plastic pollution score
  const avgPlasticPollution = pollution.length > 0
    ? pollution.reduce((acc, p) => acc + p.plastic, 0) / pollution.length
    : 50;
  const pollutionScore = Math.max(0, 100 - avgPlasticPollution);

  // 3. pH score (20% weight) - pH 8.1 is 100 score, lower drops score
  const latestPh = ph.length > 0 ? ph[ph.length - 1].ph : 8.04;
  const phScore = Math.min(100, Math.max(0, (latestPh / 8.1) * 100));

  // 4. Temperature score (10% weight) - 100 minus (avg anomaly * 20)
  const avgAnomaly = temp.length > 0
    ? temp.reduce((acc, t) => acc + Math.max(0, t.temp - t.baseline), 0) / temp.length
    : 1.5;
  const tempScore = Math.max(0, 100 - (avgAnomaly * 15));

  // Weighted average: 40% biodiversity, 30% pollution, 20% pH, 10% temp
  const totalScore = (avgReefHealth * 0.40) + (pollutionScore * 0.30) + (phScore * 0.20) + (tempScore * 0.10);

  return Math.round(totalScore);
}
