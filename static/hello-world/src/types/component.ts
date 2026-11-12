import { PhysicalQuantity } from './units';
import { DataProvenance, VerificationStatus } from './provenance';

export type ComponentCategory =
  | 'wings'
  | 'fuselage'
  | 'engines'
  | 'landing-gear'
  | 'propellers'
  | 'control-surfaces'
  | 'fuel-systems'
  | 'avionics';

export interface ComponentRecord {
  id: string;
  category: ComponentCategory;
  name: string;
  manufacturer?: string;
  model?: string;
  description?: string;
  mass: PhysicalQuantity<'kg'>;
  dimensions?: {
    length?: PhysicalQuantity<'m'>;
    width?: PhysicalQuantity<'m'>;
    height?: PhysicalQuantity<'m'>;
    diameter?: PhysicalQuantity<'m'>;
  };
  engineeringProperties: Record<string, PhysicalQuantity | string | number | boolean>;
  provenance?: DataProvenance[];
  verificationStatus: VerificationStatus;
}
