import { BookOpen, LineChart, BarChart3 } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import ServiceCard from '../ui/ServiceCard';

const ServicesSection = () => {
  return (
    <section className="section-padding bg-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

      <div className="container-custom relative z-10">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-emerald/10 text-emerald px-4 py-1 rounded-full text-sm font-medium mb-4">
            Our Premium Services
          </span>
          <h2 className="heading-lg mb-6 text-gray-900">
            Comprehensive{" "}
            <span className="emerald-gradient-text">Forex Solutions</span>
          </h2>
          <p className="text-gray-900">
            Whether you're looking to learn, receive signals, or have your
            account professionally managed, we offer tailored services to meet
            your trading needs.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatedSection delay={0.1}>
            <ServiceCard
              title="SBM Forex Mentorship"
              description="Learn from the best with our comprehensive forex education program designed for traders at all levels."
              icon={BookOpen}
              features={[
                "Live trading sessions",
                "Step-by-step trading guide",
                "Trading psychology mastery",
                "24/7 mentor support",
              ]}
              ctaText="Start Learning"
              ctaLink="/services"
              color="gold"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <ServiceCard
              title="SBM Forex Signals"
              description="Receive high-accuracy trading signals delivered directly to your device in real-time."
              icon={LineChart}
              features={[
                "92.5% accuracy rate",
                "Entry, TP and SL levels",
                "24/7 signal delivery",
                "Multiple currency pairs",
              ]}
              ctaText="Get Signals"
              ctaLink="/services"
              color="emerald"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <ServiceCard
              title="SBM Account Management"
              description="Let our professional traders manage your account and generate consistent profits."
              icon={BarChart3}
              features={[
                "Minimum equity: $900",
                "Synthetic indices only",
                "Professional management",
                "Transparent profit sharing",
              ]}
              ctaText="Get Started"
              ctaLink="/services"
              color="gold"
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;