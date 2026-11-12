import { PhysicalQuantity } from './units';
import { ParameterOverride } from './override';

export interface ComponentInstance {
  instanceId: string;
  componentId: string;
  name: string;
  category: string;
  mass: PhysicalQuantity<'kg'>;
  position: { x: number; y: number; z: number };
  overrides?: ParameterOverride[];
}
