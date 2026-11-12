export type VerificationStatus =
  | "verified"
  | "manufacturer-published"
  | "secondary-source"
  | "estimated"
  | "experimental"
  | "unverified";

export interface Quantity {
  value: number;
  unit: string;
}

export interface DataProvenance {
  sourceId: string;
  sourceTitle: string;
  organization?: string;
  verificationStatus: VerificationStatus;
}

export interface ComponentRecord {
  id: string;
  category: 'wings' | 'fuselage' | 'engines' | 'landing-gear' | 'propellers' | 'control-surfaces' | 'fuel-systems' | 'avionics';
  name: string;
  manufacturer?: string;
  model?: string;
  description?: string;
  mass: Quantity;
  dimensions?: {
    length?: Quantity;
    width?: Quantity;
    height?: Quantity;
    diameter?: Quantity;
  };
  engineeringProperties: Record<string, Quantity | string | number | boolean>;
  provenance?: DataProvenance[];
  verificationStatus: VerificationStatus;
}

export interface ParameterOverride {
  parameter: string;
  originalValue: Quantity | number | string;
  overrideValue: Quantity | number | string;
  reason: string;
  createdAt: string;
}

export interface ComponentInstance {
  instanceId: string;
  componentId: string;
  name: string;
  category: string;
  mass: Quantity;
  position: { x: number; y: number; z: number };
  overrides?: ParameterOverride[];
}

export interface AircraftConfiguration {
  id: string;
  name: string;
  description: string;
  components: ComponentInstance[];
  totalMass: Quantity;
  centreOfGravity: { x: Quantity; y: Quantity; z: Quantity };
  version: number;
  createdAt: string;
  updatedAt: string;
}

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
  time: Quantity;
  airspeed: Quantity;
  altitude: Quantity;
  lift: Quantity;
  drag: Quantity;
  thrust: Quantity;
  weight: Quantity;
  state: FlightState;
}

export interface Diagnostic {
  code: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  primaryFinding: string;
  contributingFactors: string[];
  evidence: {
    parameter: string;
    value: number;
    unit: string;
  }[];
  explanation: string;
  investigationSuggestions: string[];
}
