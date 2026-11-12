export function validateUnitCompatibility(sourceUnit: string, targetUnit: string): boolean {
  return sourceUnit.toLowerCase() === targetUnit.toLowerCase();
}
