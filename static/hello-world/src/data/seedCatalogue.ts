import { ComponentRecord, AircraftConfiguration } from '../types/aerospace';

export const SEED_COMPONENTS: ComponentRecord[] = [
  {
    id: 'wing-naca-0012',
    category: 'wings',
    name: 'NACA 0012 Rectangular Main Wing',
    manufacturer: 'AeroStandard',
    model: 'NS-0012',
    description: 'Standard symmetric airfoil with high lift-to-drag ratio characteristics at subsonic speeds.',
    mass: { value: 350, unit: 'kg' },
    dimensions: { length: { value: 2.1, unit: 'm' }, width: { value: 11.5, unit: 'm' } },
    engineeringProperties: {
      aspectRatio: 7.2,
      surfaceArea: 24.1,
      maxLiftCoefficient: 1.6,
      zeroLiftDragCoefficient: 0.021
    },
    provenance: [
      {
        sourceId: 'src-naca-rep-460',
        sourceTitle: 'NACA Report No. 460 - Characteristics of Standard Airfoils',
        organization: 'National Advisory Committee for Aeronautics',
        verificationStatus: 'verified'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'fuselage-standard-tub',
    category: 'fuselage',
    name: 'Single-Aisle Composite Fuselage',
    manufacturer: 'FLLY Structures',
    model: 'FSF-100',
    description: 'Lightweight carbon-composite fuselage tube with integrated cockpit and cabin reinforcement.',
    mass: { value: 1200, unit: 'kg' },
    dimensions: { length: { value: 14.5, unit: 'm' }, diameter: { value: 1.8, unit: 'm' } },
    engineeringProperties: {
      maxPayload: 2500,
      dragCoefficientBody: 0.04
    },
    provenance: [
      {
        sourceId: 'src-manuf-fsf100',
        sourceTitle: 'FLLY Structural Specifications Manual v3.2',
        organization: 'FLLY Aerospace Engineering',
        verificationStatus: 'manufacturer-published'
      }
    ],
    verificationStatus: 'manufacturer-published'
  },
  {
    id: 'engine-turbofan-tf50',
    category: 'engines',
    name: 'TF-50 High-Bypass Turbofan',
    manufacturer: 'AeroPropulsion Corp',
    model: 'TF-50',
    description: 'Reliable twin-spool turbofan engine delivering high thrust for medium-range aircraft.',
    mass: { value: 850, unit: 'kg' },
    dimensions: { diameter: { value: 1.4, unit: 'm' }, length: { value: 2.8, unit: 'm' } },
    engineeringProperties: {
      maxThrust: 45000,
      bypassRatio: 5.1,
      specificFuelConsumption: 0.62
    },
    provenance: [
      {
        sourceId: 'src-prop-tf50',
        sourceTitle: 'Commercial Turbofan Performance Databook 2024',
        organization: 'AeroPropulsion Corp',
        verificationStatus: 'verified'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'landing-gear-tricycle',
    category: 'landing-gear',
    name: 'Retractable Tricycle Landing Gear',
    manufacturer: 'GlideGear',
    model: 'TR-300',
    description: 'Hydraulically actuated retractable tricycle gear with shock absorbers.',
    mass: { value: 220, unit: 'kg' },
    engineeringProperties: {
      maxLoadCapacity: 6000,
      dragIncrement: 0.015
    },
    provenance: [
      {
        sourceId: 'src-gear-tr300',
        sourceTitle: 'GlideGear Technical Datasheet TR-300',
        organization: 'GlideGear Systems',
        verificationStatus: 'manufacturer-published'
      }
    ],
    verificationStatus: 'manufacturer-published'
  },
  {
    id: 'control-surface-tail',
    category: 'control-surfaces',
    name: 'T-Tail Empennage Assembly',
    manufacturer: 'AeroStandard',
    model: 'TT-20',
    description: 'Pitch and yaw control surfaces mounted in T-tail configuration.',
    mass: { value: 180, unit: 'kg' },
    dimensions: { width: { value: 4.2, unit: 'm' } },
    engineeringProperties: {
      pitchAuthority: 0.85,
      yawAuthority: 0.75
    },
    provenance: [
      {
        sourceId: 'src-tt20',
        sourceTitle: 'Empennage Design Principles & Standards',
        organization: 'AeroStandard',
        verificationStatus: 'verified'
      }
    ],
    verificationStatus: 'verified'
  }
];

export const INITIAL_AIRCRAFT: AircraftConfiguration = {
  id: 'flly-alpha-1',
  name: 'FLLY Alpha Research Aircraft',
  description: 'Standard baseline single-engine configuration for educational flight mechanics and simulation.',
  components: [
    { instanceId: 'inst-1', componentId: 'fuselage-standard-tub', name: 'Single-Aisle Composite Fuselage', category: 'fuselage', mass: { value: 1200, unit: 'kg' }, position: { x: 0, y: 0, z: 0 }, overrides: [] },
    { instanceId: 'inst-2', componentId: 'wing-naca-0012', name: 'NACA 0012 Rectangular Main Wing', category: 'wings', mass: { value: 350, unit: 'kg' }, position: { x: 0.5, y: 0.2, z: 0 }, overrides: [] },
    { instanceId: 'inst-3', componentId: 'engine-turbofan-tf50', name: 'TF-50 High-Bypass Turbofan', category: 'engines', mass: { value: 850, unit: 'kg' }, position: { x: -3.0, y: -0.1, z: 0 }, overrides: [] },
    { instanceId: 'inst-4', componentId: 'landing-gear-tricycle', name: 'Retractable Tricycle Landing Gear', category: 'landing-gear', mass: { value: 220, unit: 'kg' }, position: { x: 0, y: -1.2, z: 0 }, overrides: [] },
    { instanceId: 'inst-5', componentId: 'control-surface-tail', name: 'T-Tail Empennage Assembly', category: 'control-surfaces', mass: { value: 180, unit: 'kg' }, position: { x: -6.5, y: 1.0, z: 0 }, overrides: [] }
  ],
  totalMass: { value: 2800, unit: 'kg' },
  centreOfGravity: {
    x: { value: -0.42, unit: 'm' },
    y: { value: 0.05, unit: 'm' },
    z: { value: 0.0, unit: 'm' }
  },
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
