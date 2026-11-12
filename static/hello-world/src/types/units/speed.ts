export type SpeedUnit = 'm/s' | 'km/h' | 'kts';
export interface SpeedQuantity {
  value: number;
  unit: SpeedUnit;
}
