export type LengthUnit = 'm' | 'cm' | 'in' | 'ft';
export interface LengthQuantity {
  value: number;
  unit: LengthUnit;
}
