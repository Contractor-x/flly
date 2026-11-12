export type ForceUnit = 'N' | 'kN' | 'lbf';
export interface ForceQuantity {
  value: number;
  unit: ForceUnit;
}
