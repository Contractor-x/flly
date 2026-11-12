import { PhysicalQuantity } from './units';

export type FlightState =
  | 'idle'
  | 'preflight'
  | 'accelerating'
  | 'takeoff'
  | 'climbing'
  | 'cruising'
  | 'descending'
  | 'stalled'
  | 'failed'
  | 'completed';

export interface TelemetrySample {
  time: PhysicalQuantity<'s'>;
  airspeed: PhysicalQuantity<'m/s'>;
  altitude: PhysicalQuantity<'m'>;
  lift: PhysicalQuantity<'N'>;
  drag: PhysicalQuantity<'N'>;
  thrust: PhysicalQuantity<'N'>;
  weight: PhysicalQuantity<'N'>;
  state: FlightState;
}

export interface SimulationResult {
  runId: string;
  status: 'completed' | 'failed' | 'aborted';
  durationSeconds: number;
  finalState: FlightState;
  telemetry: TelemetrySample[];
  assumptions: string[];
}
