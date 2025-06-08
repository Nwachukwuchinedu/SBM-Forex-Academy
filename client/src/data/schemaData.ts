import { Organization, PostalAddress, ContactPoint } from '../types/schema';

export const ORGANIZATION_DATA: Organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SBM Forex Academy",
  url: "https://sbmforexacademy.com/",
  logo: "https://sbmforexacademy.com/logo.png",
  description: "Premier forex education academy offering comprehensive trading courses, signals, and account management services.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Royal pine estate orchid road Lekki-Epe expressway",
    addressLocality: "Lagos",
    addressCountry: "Nigeria"
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+234 706 423 7847",
    contactType: "customer support",
    email: "support@sbmforexacademy.com",
    availableLanguage: "English"
  },
  sameAs: [
    "https://www.facebook.com/share/15vCsaBidZ/?mibextid=wwXIfr",
    "https://www.instagram.com/sbm.forex_?igsh=bWNrd2llZXkycTJ5&utm_source=qr",
    "https://www.youtube.com/@sbm.forexacademy",
    "https://www.tiktok.com/@sbmforex?_t=ZM-8wjOKs51pFG&_r=1",
    "https://t.me/+sFnsZA82yvpmN2M0"
  ],
  foundingDate: "2018"
};