export interface DiagnosticEvidence {
  parameter: string;
  value: number;
  unit: string;
}

export interface Diagnostic {
  code: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  primaryFinding: string;
  contributingFactors: string[];
  evidence: DiagnosticEvidence[];
  explanation: string;
  investigationSuggestions: string[];
}
