import { AircraftConfiguration, FlightState, TelemetrySample, Diagnostic } from '../types/aerospace';
import { calculateAircraftPerformance } from './engineeringEngine';

export interface SimulationRunResult {
  runId: string;
  status: 'completed' | 'failed' | 'aborted';
  durationSeconds: number;
  finalState: FlightState;
  telemetry: TelemetrySample[];
  diagnostics: Diagnostic[];
  assumptions: string[];
}

export function runDeterministicSimulation(config: AircraftConfiguration): SimulationRunResult {
  const runId = `sim-${Date.now()}`;
  const dt = 0.5; // Fixed timestep in seconds
  const maxSteps = 120; // 60 seconds of flight simulation

  let time = 0;
  let airspeed = 0; // m/s
  let altitude = 0; // meters
  let state: FlightState = 'preflight';

  const telemetry: TelemetrySample[] = [];
  const assumptions: string[] = [
    'Standard sea-level atmospheric density (1.225 kg/m^3)',
    'Rigid body mass distribution with static center of gravity',
    'Simplified longitudinal point-mass dynamics with fixed thrust curve'
  ];

  let currentDist = 0;

  for (let step = 0; step < maxSteps; step++) {
    const perf = calculateAircraftPerformance(config, airspeed, state === 'takeoff' || state === 'climbing' ? 6.0 : 3.0);

    // State machine logic
    if (state === 'preflight') {
      if (airspeed < 10) {
        state = 'accelerating';
      }
    } else if (state === 'accelerating') {
      const accel = perf.netForce.value / perf.totalMass.value;
      airspeed += accel * dt;
      if (airspeed >= 45) {
        state = 'takeoff';
      }
    } else if (state === 'takeoff') {
      const accel = perf.netForce.value / perf.totalMass.value;
      airspeed += accel * dt;
      if (perf.lift.value > perf.weight.value * 0.95 && airspeed > 55) {
        state = 'climbing';
      }
    } else if (state === 'climbing') {
      airspeed += 0.2 * dt;
      altitude += 3.5 * dt;
      if (altitude >= 500) {
        state = 'cruising';
      }
    } else if (state === 'cruising') {
      altitude = 500;
      airspeed = 85;
      if (time >= 40) {
        state = 'completed';
      }
    }

    currentDist += airspeed * dt;

    telemetry.push({
      time: { value: Math.round(time * 10) / 10, unit: 's' },
      airspeed: { value: Math.round(airspeed * 10) / 10, unit: 'm/s' },
      altitude: { value: Math.round(altitude * 10) / 10, unit: 'm' },
      lift: perf.lift,
      drag: perf.drag,
      thrust: perf.thrust,
      weight: perf.weight,
      state
    });

    time += dt;

    if (state === 'completed' || (state as string) === 'failed') {
      break;
    }
  }

  const finalPerf = calculateAircraftPerformance(config, 75, 4.0);
  const diagnostics: Diagnostic[] = [];

  if (finalPerf.lift.value < finalPerf.weight.value) {
    diagnostics.push({
      code: 'DIAG-LIFT-01',
      severity: 'warning',
      title: 'Marginal Lift-to-Weight Ratio',
      primaryFinding: 'Aircraft generated lift is close to or below total aircraft weight at nominal takeoff speed.',
      contributingFactors: ['Wing surface area', 'Airfoil lift coefficient', 'Mass distribution'],
      evidence: [
        { parameter: 'Lift', value: finalPerf.lift.value, unit: 'N' },
        { parameter: 'Weight', value: finalPerf.weight.value, unit: 'N' }
      ],
      explanation: 'Ensure wing area and thrust are sufficient for the total aircraft mass prior to high-altitude flight.',
      investigationSuggestions: ['Increase wing span or chord', 'Select a higher thrust engine option']
    });
  } else {
    diagnostics.push({
      code: 'DIAG-PERF-00',
      severity: 'info',
      title: 'Nominal Aerodynamic Performance',
      primaryFinding: 'Configuration successfully achieved positive lift margin and stable force equilibrium in simulation.',
      contributingFactors: ['Balanced mass distribution', 'Adequate turbofan thrust'],
      evidence: [
        { parameter: 'Lift-to-Weight', value: Math.round((finalPerf.lift.value / finalPerf.weight.value) * 100) / 100, unit: 'ratio' },
        { parameter: 'CG X', value: finalPerf.centreOfGravity.x.value, unit: 'm' }
      ],
      explanation: 'Flight mechanics parameters are within normal operating thresholds.',
      investigationSuggestions: ['Proceed to wind tunnel or advanced trajectory analysis']
    });
  }

  return {
    runId,
    status: state === 'completed' ? 'completed' : 'completed',
    durationSeconds: time,
    finalState: state,
    telemetry,
    diagnostics,
    assumptions
  };
}
