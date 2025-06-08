export interface Organization {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description?: string;
  address: PostalAddress;
  contactPoint: ContactPoint;
  sameAs: string[];
  foundingDate?: string;
  founder?: Person[];
}

export interface PostalAddress {
  "@type": string;
  streetAddress: string;
  addressLocality: string;
  addressCountry: string;
}

export interface ContactPoint {
  "@type": string;
  telephone: string;
  contactType: string;
  email: string;
  availableLanguage?: string;
}

export interface Person {
  "@type": string;
  name: string;
  jobTitle?: string;
}

export interface WebSite {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  description: string;
  publisher: Organization;
}

export interface Course {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  provider: Organization;
  offers: Offer;
  courseMode?: string;
  educationalLevel?: string;
}

export interface Offer {
  "@type": string;
  price: string;
  priceCurrency: string;
  availability: string;
  validFrom?: string;
}

export interface FAQPage {
  "@context": string;
  "@type": string;
  mainEntity: Question[];
}

export interface Question {
  "@type": string;
  name: string;
  acceptedAnswer: Answer;
}

export interface Answer {
  "@type": string;
  text: string;
}