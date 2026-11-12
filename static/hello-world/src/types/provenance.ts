export type VerificationStatus =
  | 'verified'
  | 'manufacturer-published'
  | 'secondary-source'
  | 'estimated'
  | 'experimental'
  | 'unverified';

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
