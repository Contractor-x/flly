export type PressureUnit = 'Pa' | 'kPa' | 'psi' | 'atm';
export interface PressureQuantity {
  value: number;
  unit: PressureUnit;
}
