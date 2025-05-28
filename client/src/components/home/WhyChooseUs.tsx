import { Award, TrendingUp, DollarSign, Target } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <Award className="h-8 w-8 text-gold" />,
      title: 'Proven Accuracy',
      description: 'Our signals boast a 92.5% accuracy rate, thoroughly analyzed by expert traders with years of market experience.'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-gold" />,
      title: 'Winning Strategies',
      description: 'Learn our proprietary trading strategies that have consistently outperformed the market for over 5 years.'
    },
    {
      icon: <DollarSign className="h-8 w-8 text-gold" />,
      title: 'Flexible Payments',
      description: 'We offer various subscription options to fit your budget, with payment plans that make premium education accessible.'
    },
    {
      icon: <Target className="h-8 w-8 text-gold" />,
      title: 'Consistent Profits',
      description: 'Our focus is on sustainable, long-term profitability rather than risky, short-term gains that can wipe out your account.'
    },
  ];

  return (
    <section className="section-padding bg-dark-darker relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-gold/5 to-gray-900/0"></div>
      <div className="container-custom relative">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-gold/10 text-gold px-4 py-1 rounded-full text-sm font-medium mb-4">
            Why Choose SBM Forex Academy
          </span>
          <h2 className="heading-lg mb-6 text-gray-900">
            What Makes Us <span className="gradient-text">Different</span>
          </h2>
          <p className="text-gray-900">
            We don't just teach trading—we create successful traders through our
            comprehensive approach to the forex market.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <AnimatedSection
              key={index}
              delay={index * 0.1}
              className="card-neumorphic p-6"
            >
              <div className="mb-5">{reason.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {reason.title}
              </h3>
              <p className="text-gray-400">{reason.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;