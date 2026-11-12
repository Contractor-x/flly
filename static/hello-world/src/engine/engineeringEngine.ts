import { AircraftConfiguration, Quantity } from '../types/aerospace';

export const STANDARD_GRAVITY = 9.80665; // m/s^2
export const AIR_DENSITY_SEA_LEVEL = 1.225; // kg/m^3

export interface CalculationResult {
  totalMass: Quantity;
  weight: Quantity;
  lift: Quantity;
  drag: Quantity;
  thrust: Quantity;
  netForce: Quantity;
  centreOfGravity: { x: Quantity; y: Quantity; z: Quantity };
  isValid: boolean;
  warnings: string[];
}

export function calculateAircraftPerformance(
  config: AircraftConfiguration,
  airspeedMs: number = 75, // m/s (~145 knots)
  angleOFAttackDeg: number = 4.0
): CalculationResult {
  const warnings: string[] = [];

  // Total mass sum
  let totalMassKg = 0;
  config.components.forEach((comp) => {
    totalMassKg += comp.mass.value;
  });

  const weightN = totalMassKg * STANDARD_GRAVITY;

  // Approximate wing area S = 24.1 m^2 (from seed wing)
  const wingArea = 24.1;
  const cL0 = 0.2;
  const cLSlope = 0.09; // per degree
  const cL = Math.min(1.6, Math.max(-0.5, cL0 + cLSlope * angleOFAttackDiff(angleOFAttackDeg)));

  // Lift: L = 0.5 * rho * V^2 * S * Cl
  const dynamicPressure = 0.5 * AIR_DENSITY_SEA_LEVEL * Math.pow(airspeedMs, 2);
  const liftN = dynamicPressure * wingArea * cL;

  // Drag: D = 0.5 * rho * V^2 * S * (Cd0 + K * Cl^2)
  const cd0 = 0.021;
  const aspectRatio = 7.2;
  const oswaldEfficiency = 0.85;
  const k = 1 / (Math.PI * aspectRatio * oswaldEfficiency);
  const cD = cd0 + k * Math.pow(cL, 2);
  const dragN = dynamicPressure * wingArea * cD;

  // Max thrust from TF-50 engine (~45,000 N max, modelled at 60% cruise throttle here)
  const thrustN = 27000;

  const netForceN = thrustN - dragN;

  // Center of Gravity calculation (3D weighted average)
  let sumMomentsX = 0;
  let sumMomentsY = 0;
  let sumMomentsZ = 0;

  config.components.forEach((comp) => {
    sumMomentsX += comp.mass.value * comp.position.x;
    sumMomentsY += comp.mass.value * comp.position.y;
    sumMomentsZ += comp.mass.value * comp.position.z;
  });

  const cgX = totalMassKg > 0 ? sumMomentsX / totalMassKg : 0;
  const cgY = totalMassKg > 0 ? sumMomentsY / totalMassKg : 0;
  const cgZ = totalMassKg > 0 ? sumMomentsZ / totalMassKg : 0;

  // Validation checks
  if (totalMassKg <= 0) {
    warnings.push('Total aircraft mass is zero or negative.');
  }
  if (cgX > 0.5 || cgX < -1.5) {
    warnings.push('Center of gravity (X) is outside recommended stability limits.');
  }

  return {
    totalMass: { value: Math.round(totalMassKg * 10) / 10, unit: 'kg' },
    weight: { value: Math.round(weightN * 10) / 10, unit: 'N' },
    lift: { value: Math.round(liftN * 10) / 10, unit: 'N' },
    drag: { value: Math.round(dragN * 10) / 10, unit: 'N' },
    thrust: { value: Math.round(thrustN * 10) / 10, unit: 'N' },
    netForce: { value: Math.round(netForceN * 10) / 10, unit: 'N' },
    centreOfGravity: {
      x: { value: Math.round(cgX * 100) / 100, unit: 'm' },
      y: { value: Math.round(cgY * 100) / 100, unit: 'm' },
      z: { value: Math.round(cgZ * 100) / 100, unit: 'm' }
    },
    isValid: warnings.length === 0,
    warnings
  };
}

function angleOFAttackDiff(deg: number): number {
  return deg;
}
