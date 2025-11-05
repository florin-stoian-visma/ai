export enum BusinessType {
  CARPENTRY = 'CARPENTRY',
  SOFTWARE_CONSULTING = 'SOFTWARE_CONSULTING',
  UNKNOWN = 'UNKNOWN'
}

export interface BusinessProfile {
  organisationsnummer: string;
  businessType: BusinessType;
  businessName: string;
  sniCode?: string;
  confirmed: boolean;
}
