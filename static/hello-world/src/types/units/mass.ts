export type MassUnit = 'kg' | 'g' | 'lb';
export interface MassQuantity {
  value: number;
  unit: MassUnit;
}
