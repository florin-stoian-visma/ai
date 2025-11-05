import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, delay } from 'rxjs';
import { BusinessType, BusinessProfile } from '../models/business-type.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessDetectionService {
  private readonly BUSINESS_PROFILE_KEY = 'business_profile';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Mock Swedish organisationsnummer to business type mapping
  private mockBusinessRegistry: { [key: string]: { type: BusinessType; name: string; sniCode: string } } = {
    '556789-1234': { type: BusinessType.CARPENTRY, name: 'Snickeriet AB', sniCode: '43.32' },
    '559876-5432': { type: BusinessType.SOFTWARE_CONSULTING, name: 'Tech Solutions AB', sniCode: '62.02' },
    '551234-5678': { type: BusinessType.CARPENTRY, name: 'Byggmästaren i Stockholm AB', sniCode: '43.32' },
    '558765-4321': { type: BusinessType.SOFTWARE_CONSULTING, name: 'Digital Konsult AB', sniCode: '62.01' }
  };

  detectBusinessType(organisationsnummer: string): Observable<BusinessProfile> {
    // Simulate API call to Bolagsverket
    return of(this.mockDetection(organisationsnummer)).pipe(delay(500));
  }

  private mockDetection(organisationsnummer: string): BusinessProfile {
    const business = this.mockBusinessRegistry[organisationsnummer];
    
    if (business) {
      return {
        organisationsnummer,
        businessType: business.type,
        businessName: business.name,
        sniCode: business.sniCode,
        confirmed: false
      };
    }

    // Default to unknown if not found
    return {
      organisationsnummer,
      businessType: BusinessType.UNKNOWN,
      businessName: 'Unknown Business',
      confirmed: false
    };
  }

  saveBusinessProfile(profile: BusinessProfile): void {
    if (this.isBrowser) {
      localStorage.setItem(this.BUSINESS_PROFILE_KEY, JSON.stringify(profile));
    }
  }

  getBusinessProfile(): BusinessProfile | null {
    if (!this.isBrowser) {
      return null;
    }
    const stored = localStorage.getItem(this.BUSINESS_PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  clearBusinessProfile(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.BUSINESS_PROFILE_KEY);
    }
  }
}
