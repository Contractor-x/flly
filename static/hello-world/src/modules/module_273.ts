// Module 273 - FLLY Subsystem Component
export interface ModuleSpec_273 {
  id: string;
  index: number;
  name: string;
  active: boolean;
}

export function processModule_273(id: string): ModuleSpec_273 {
  return {
    id,
    index: 273,
    name: "FLLY Aerospace Subsystem 273",
    active: true
  };
}
