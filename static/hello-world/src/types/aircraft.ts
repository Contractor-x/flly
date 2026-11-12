import { ComponentInstance } from './instance';
import { PhysicalQuantity } from './units';

export interface AircraftConfiguration {
  id: string;
  name: string;
  description: string;
  components: ComponentInstance[];
  totalMass: PhysicalQuantity<'kg'>;
  centreOfGravity: {
    x: PhysicalQuantity<'m'>;
    y: PhysicalQuantity<'m'>;
    z: PhysicalQuantity<'m'>;
  };
  version: number;
  createdAt: string;
  updatedAt: string;
}
