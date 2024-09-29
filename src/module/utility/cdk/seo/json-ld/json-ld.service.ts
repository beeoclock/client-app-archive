import {inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

export interface JsonLd {
  [param: string]: string | Object;
}

export interface Address {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressCountry: string;
}

export interface OpeningHoursSpecification {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

/**
 *
 *     {
 *       "@type": "Offer",
 *       "name": "Artistic Haircut",
 *       "itemOffered": {
 *         "@type": "CreativeWork",
 *         "name": "Men's Artistic Haircut",
 *         "description": "A men's haircut that transcends the ordinary with artistic flair.",
 *         "timeRequired": "PT30M"
 *       },
 *       "price": "350",
 *       "priceCurrency": "DKK"
 *     },
 */
export interface Offer {
  '@type': 'Offer';
  name: string;
  price: string;
  priceCurrency: string;
  itemOffered?: {
    '@type': 'CreativeWork';
    name: string;
    description: string;
    timeRequired: string;
  };
}

export enum JsonLdObjectTypeEnum {
  Organization = 'Organization',
  LocalBusiness = 'LocalBusiness',
  WebSite = 'WebSite',
  Person = 'Person',
  Product = 'Product',
}

@Injectable({
  providedIn: 'root',
})
export class JsonLdService {
  private readonly document = inject(DOCUMENT);

  public getObject(
    type: JsonLdObjectTypeEnum,
    rawData?: JsonLd,
    context = 'https://schema.org',
  ): JsonLd {
    let object: JsonLd = {
      '@type': type,
    };
    if (context) {
      object = {
        '@context': context,
        ...object,
      };
    }
    if (rawData) {
      object = {
        ...object,
        ...rawData,
      };
    }
    return object;
  }

  public addAddress(jsonLd: JsonLd, address: Address): JsonLd {
    return {
      ...jsonLd,
      address,
    };
  }

  public addOpeningHours(
    jsonLd: JsonLd,
    openingHours: OpeningHoursSpecification[],
  ): JsonLd {
    return {
      ...jsonLd,
      openingHoursSpecification: openingHours,
    };
  }

  public addMakesOffer(jsonLd: JsonLd, offers: Offer[]): JsonLd {
    return {
      ...jsonLd,
      makesOffer: offers,
    };
  }

  public addTelephone(jsonLd: JsonLd, telephone: string): JsonLd {
    return {
      ...jsonLd,
      telephone,
    };
  }

  public addUrl(jsonLd: JsonLd, url: string): JsonLd {
    return {
      ...jsonLd,
      url,
    };
  }

  public addImage(jsonLd: JsonLd, image: string): JsonLd {
    return {
      ...jsonLd,
      image,
    };
  }

  public addSameAs(jsonLd: JsonLd, sameAs: string[]): JsonLd {
    return {
      ...jsonLd,
      sameAs,
    };
  }

  public addType(jsonLd: JsonLd, type: string): JsonLd {
    return {
      ...jsonLd,
      '@type': type,
    };
  }

  public inject(jsonLd: JsonLd | JsonLd[]): void {
    let ldJsonScriptTag = this.document.head.querySelector(
      `script[type='application/ld+json']`,
    );
    if (ldJsonScriptTag) {
      ldJsonScriptTag.textContent = JSON.stringify(jsonLd);
    } else {
      ldJsonScriptTag = this.document.createElement('script');
      ldJsonScriptTag.setAttribute('type', 'application/ld+json');
      ldJsonScriptTag.textContent = JSON.stringify(jsonLd);
      this.document.head.appendChild(ldJsonScriptTag);
    }
  }
}
