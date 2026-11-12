export type MassUnit = 'kg' | 'g' | 'lb';
export type LengthUnit = 'm' | 'cm' | 'in' | 'ft';
export type ForceUnit = 'N' | 'kN' | 'lbf';
export type SpeedUnit = 'm/s' | 'km/h' | 'kts';
export type PressureUnit = 'Pa' | 'kPa' | 'psi' | 'atm';

export interface PhysicalQuantity<U extends string = string> {
  value: number;
  unit: U;
}
