import HeroSection from '../components/home/HeroSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ServicesSection from '../components/home/ServicesSection';
import StatsSection from '../components/home/StatsSection';
import GetStartedSection from '../components/home/GetStartedSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CallToAction from '../components/home/CallToAction';
import AboutPreview from '../components/home/AboutPreview';

import { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    document.title = 'SBM Forex Academy - Premier Forex Education & Trading';
  }, []);

  return (
    <div>
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