// src/data/mockAlerts.js

export const alertsMockData = [
  { id: 1, severity: "critical", title: "Coral Bleaching Detected", description: "Heat stress index critical in the Great Barrier Reef.", location: "Great Barrier Reef, Australia", time: "10 min ago" },
  { id: 2, severity: "warning", title: "pH Drop Below Threshold", description: "pH levels dropped below safe limits in the North Atlantic.", location: "North Atlantic", time: "30 min ago" },
  { id: 3, severity: "info", title: "Marine Species Migration", description: "Observed increased migration of tuna near Hawaii.", location: "Hawaii EEZ", time: "1 hour ago" },
  { id: 4, severity: "critical", title: "Oil Spill Alert", description: "Potential oil spill detected near Gulf of Mexico.", location: "Gulf of Mexico", time: "2 hrs ago" },
  { id: 5, severity: "warning", title: "Plastic Accumulation Spike", description: "Micro‑plastic concentrations rose 15% off the coast of Philippines.", location: "Philippines", time: "3 hrs ago" },
  { id: 6, severity: "info", title: "Temperature Anomaly", description: "Sea surface temperature 0.2°C above average in the Caribbean.", location: "Caribbean", time: "4 hrs ago" },
  { id: 7, severity: "critical", title: "Storm Surge Warning", description: "Storm surge predicted to affect coastal stations in Japan.", location: "Japan", time: "5 hrs ago" },
  { id: 8, severity: "warning", title: "Oxygen Depletion", description: "Low dissolved oxygen detected in the Baltic Sea.", location: "Baltic Sea", time: "6 hrs ago" },
  { id: 9, severity: "info", title: "Algae Bloom Detected", description: "Algae bloom observed near the coast of Chile.", location: "Chile", time: "7 hrs ago" },
  { id: 10, severity: "critical", title: "Ship Collision Risk", description: "High traffic area increasing collision risk near Singapore.", location: "Singapore Strait", time: "8 hrs ago" },
];

export const mockAlerts = alertsMockData.slice(0, 3);
