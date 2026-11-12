export interface PhysicalQuantity<U extends string = string> {
  value: number;
  unit: U;
}
