import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/home/HeroSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ServicesSection from '../components/home/ServicesSection';
import StatsSection from '../components/home/StatsSection';
import GetStartedSection from '../components/home/GetStartedSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CallToAction from '../components/home/CallToAction';
import AboutPreview from '../components/home/AboutPreview';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import { ORGANIZATION_DATA } from '../data/schemaData';
import { WebSite } from '../types/schema';

const HomePage = () => {
  useEffect(() => {
    document.title = 'SBM Forex Academy - Premier Forex Education & Trading';
  }, []);

  const websiteSchema: WebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SBM Forex Academy",
    url: "https://sbmforexacademy.com/",
    description: "Premier forex education, trading signals, and account management services. Join 5,000+ traders achieving consistent profits.",
    publisher: ORGANIZATION_DATA
  };

  return (
    <div>
      <Helmet>
        <title>SBM Forex Academy - Premier Forex Education & Trading</title>
        <meta name="description" content="Join SBM Forex Academy for expert forex education, high-accuracy trading signals, and professional account management. Transform your trading journey today!" />
      </Helmet>
      
      <SchemaMarkup schema={websiteSchema} />
      
      <HeroSection />
      <AboutPreview />
      <WhyChooseUs />
      <ServicesSection />
      <StatsSection />
      <GetStartedSection />
      <TestimonialsSection />
      <CallToAction />
    </div>
  );
};

export default HomePage;