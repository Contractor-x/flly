import { PhysicalQuantity } from './units';

export interface ParameterOverride {
  parameter: string;
  originalValue: PhysicalQuantity | number | string;
  overrideValue: PhysicalQuantity | number | string;
  reason: string;
  createdAt: string;
  createdBy?: string;
}
