import { VerificationStatus } from './status';

export interface DataProvenance {
  sourceId: string;
  sourceTitle: string;
  organization?: string;
  url?: string;
  publicationDate?: string;
  retrievedAt?: string;
  verificationStatus: VerificationStatus;
  notes?: string;
}
