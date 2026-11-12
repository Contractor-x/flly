import { DataProvenance, VerificationStatus } from './record';

export function createProvenanceRecord(
  sourceId: string,
  sourceTitle: string,
  organization: string,
  status: VerificationStatus
): DataProvenance {
  return {
    sourceId,
    sourceTitle,
    organization,
    verificationStatus: status,
    retrievedAt: new Date().toISOString()
  };
}
