import { Users, LineChart, TrendingUp, Award } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import StatsCard from '../ui/StatsCard';

const StatsSection = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-dark to-dark-darker">
      <div className="container-custom">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-gold/10 text-gold px-4 py-1 rounded-full text-sm font-medium mb-4">
            Our Track Record
          </span>
          <h2 className="heading-lg mb-6 text-gray-900">
            The Numbers <span className="gradient-text">Speak For Themselves</span>
          </h2>
          <p className="text-gray-900">
            With thousands of satisfied traders and a proven track record of success, 
            SBM Forex Academy continues to be the leading choice for forex education.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedSection delay={0.1}>
            <StatsCard
              value={300}
              suffix="k+"
              label="Community Members"
              icon={<Users className="h-6 w-6 text-gold" />}
              color="gold"
            />
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <StatsCard
              value={17}
              suffix="k+"
              label="Trading Signals Sent"
              icon={<LineChart className="h-6 w-6 text-emerald" />}
              color="emerald"
            />
          </AnimatedSection>
          
          <AnimatedSection delay={0.3}>
            <StatsCard
              value={15.5}
              suffix="k+"
              label="Successful Trades"
              icon={<TrendingUp className="h-6 w-6 text-gold" />}
              color="gold"
            />
          </AnimatedSection>
          
          <AnimatedSection delay={0.4}>
            <StatsCard
              value={92.5}
              suffix="%"
              label="Signal Accuracy"
              icon={<Award className="h-6 w-6 text-emerald" />}
              color="emerald"
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;