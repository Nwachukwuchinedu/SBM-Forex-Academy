import { useEffect } from 'react';
import { BookOpen, LineChart, BarChart3, Check, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  useEffect(() => {
    document.title = 'Our Services - SBM Forex Academy';
  }, []);

  const services = [
    {
      id: 'mentorship',
      title: 'SBM Forex Mentorship',
      subtitle: 'Comprehensive Forex Education',
      description: 'Our flagship mentorship program provides you with all the knowledge, strategies, and support you need to trade confidently and profitably in the forex market.',
      icon: BookOpen,
      color: 'gold',
      features: [
        'Live trading sessions with expert traders',
        'Comprehensive trading strategy guide',
        'Technical and fundamental analysis training',
        '24/7 mentor support via private group',
        'Trading psychology mastery module',
        'Risk management techniques',
        'Lifetime access to course materials',
        'Weekly strategy refinement calls'
      ],
      pricing: [
        {
          name: 'Basic',
          price: '$299',
          period: 'one-time',
          features: [
            'Core trading strategy',
            'Basic technical analysis',
            'Entry-level support',
            '3-month access to community'
          ]
        },
        {
          name: 'Premium',
          price: '$599',
          period: 'one-time',
          features: [
            'Advanced trading strategies',
            'Technical & fundamental analysis',
            'Priority mentor support',
            'Lifetime access to community',
            'Weekly live trading sessions'
          ]
        },
        {
          name: 'VIP',
          price: '$999',
          period: 'one-time',
          features: [
            'All Premium features',
            'One-on-one coaching sessions',
            'Custom strategy development',
            'Direct access to lead traders',
            'Account management consultation'
          ]
        }
      ]
    },
    {
      id: 'signals',
      title: 'SBM Forex Signals',
      subtitle: 'High-Accuracy Trading Signals',
      description: 'Receive precise trading signals with clear entry, stop-loss, and take-profit levels, allowing you to capitalize on market opportunities even with a busy schedule.',
      icon: LineChart,
      color: 'emerald',
      features: [
        'Average of 5-10 signals per week',
        '92.5% historical accuracy rate',
        'Clear entry, stop-loss, and take-profit levels',
        'Real-time delivery via mobile app',
        'Multiple currency pairs coverage',
        'Detailed analysis for each signal',
        'Market updates and news alerts',
        'Performance tracking and reporting'
      ],
      pricing: [
        {
          name: 'Monthly',
          price: '$99',
          period: 'per month',
          features: [
            'All trading signals',
            'Standard delivery speed',
            'Basic market analysis',
            'Community access'
          ]
        },
        {
          name: 'Quarterly',
          price: '$249',
          period: 'per quarter',
          features: [
            'All trading signals',
            'Priority delivery',
            'Detailed market analysis',
            'Community access',
            'Weekly market outlook'
          ]
        },
        {
          name: 'Annual',
          price: '$799',
          period: 'per year',
          features: [
            'All trading signals',
            'Priority delivery',
            'Comprehensive market analysis',
            'VIP community access',
            'Weekly market outlook',
            'Quarterly strategy session'
          ]
        }
      ]
    },
    {
      id: 'management',
      title: 'SBM Account Management',
      subtitle: 'Professional Account Management',
      description: 'Let our team of experienced traders manage your account and generate consistent profits while you focus on other priorities.',
      icon: BarChart3,
      color: 'gold',
      features: [
        'Minimum equity: $900',
        'Synthetic indices focus',
        'Professional risk management',
        'Regular performance reporting',
        'Transparent profit sharing',
        'No hidden fees or charges',
        'Flexible withdrawal options',
        'Customizable risk profiles'
      ],
      pricing: [
        {
          name: 'Conservative',
          price: '30%',
          period: 'of profits',
          features: [
            'Lower risk approach',
            'Focus on capital preservation',
            '5-15% monthly target',
            'Weekly performance reports',
            '$900 minimum investment'
          ]
        },
        {
          name: 'Balanced',
          price: '35%',
          period: 'of profits',
          features: [
            'Moderate risk approach',
            'Balance of growth and safety',
            '15-25% monthly target',
            'Weekly performance reports',
            '$1,500 minimum investment'
          ]
        },
        {
          name: 'Aggressive',
          price: '40%',
          period: 'of profits',
          features: [
            'Higher risk approach',
            'Focus on maximum growth',
            '25-40% monthly target',
            'Daily performance reports',
            '$3,000 minimum investment'
          ]
        }
      ]
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-hero-pattern bg-cover bg-center py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="container-custom relative z-10">
          <AnimatedSection className="max-w-3xl">
            <span className="inline-block bg-gold/20 text-gold px-4 py-1 rounded-full text-sm font-medium mb-6">
              Our Services
            </span>
            <h1 className="heading-xl mb-6">
              Premium Forex <span className="gradient-text">Solutions</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Whether you're looking to learn, receive signals, or have your
              account professionally managed, we offer tailored services to meet
              your trading needs.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg mb-6">
              Choose The Right{" "}
              <span className="emerald-gradient-text">Service For You</span>
            </h2>
            <p className="text-gray-300">
              We offer three core services designed to help you succeed in the
              forex market, regardless of your experience level or time
              commitment.
            </p>
          </AnimatedSection>

          <div className="space-y-24">
            {services.map((service, index) => (
              <div key={service.id} id={service.id} className="scroll-mt-24">
                <AnimatedSection>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                      <div
                        className={`inline-block p-3 rounded-xl bg-${service.color}/10 mb-6`}
                      >
                        <service.icon
                          className={`h-8 w-8 text-${service.color}`}
                        />
                      </div>
                      <h2 className="heading-lg mb-3">{service.title}</h2>
                      <p className={`text-${service.color} text-lg mb-6`}>
                        {service.subtitle}
                      </p>
                      <p className="text-gray-300 mb-8">
                        {service.description}
                      </p>

                      <div className="space-y-4 mb-8">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className={`mt-1 text-${service.color}`}>
                              <Check className="h-5 w-5" />
                            </div>
                            <p className="text-gray-300">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="card-glass p-8">
                        <h3 className="text-xl font-bold mb-6">
                          Pricing Options
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {service.pricing.map((plan, i) => (
                            <div
                              key={i}
                              className={
                                `bg-dark-lighter rounded-lg p-8 border mb-0 ` +
                                (i === 1
                                  ? `border-${service.color} shadow-lg shadow-${service.color}/10`
                                  : "border-gray-700") +
                                // Make the third card (index 2) span two columns on md+ screens
                                (service.pricing.length === 3 && i === 2
                                  ? " md:col-span-2"
                                  : "")
                              }
                            >
                              <h4 className="font-bold mb-2">{plan.name}</h4>
                              <div className="flex items-end gap-1 mb-4">
                                <span
                                  className={`text-2xl font-bold text-${service.color}`}
                                >
                                  {plan.price}
                                </span>
                                <span className="text-gray-400 text-sm">
                                  {plan.period}
                                </span>
                              </div>
                              <ul className="space-y-2 mb-6">
                                {plan.features.map((feature, j) => (
                                  <li
                                    key={j}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <span
                                      className={`inline-block text-${service.color} text-lg`}
                                    >
                                      •
                                    </span>
                                    <span className="text-gray-300">
                                      {feature}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <Link
                                to="/register"
                                className={`w-full py-2 px-4 rounded text-center inline-block ${
                                  i === 1
                                    ? `bg-${service.color} text-dark font-medium hover:opacity-90`
                                    : "bg-gray-800 text-white hover:bg-gray-700"
                                } transition-colors`}
                              >
                                Get Started
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-dark-darker">
        <div className="container-custom">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-gold/10 text-gold px-4 py-1 rounded-full text-sm font-medium mb-4">
              Common Questions
            </span>
            <h2 className="heading-lg mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-gray-300">
              Find answers to common questions about our services.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="card-neumorphic p-6">
                <h3 className="text-xl font-bold mb-3">
                  How do I choose the right service for me?
                </h3>
                <p className="text-gray-300">
                  If you want to learn how to trade and develop your own
                  strategies, choose our Mentorship program. If you prefer to
                  follow expert signals while you learn, the Signals service is
                  ideal. For hands-off investing, our Account Management service
                  is the best choice.
                </p>
              </div>

              <div className="card-neumorphic p-6">
                <h3 className="text-xl font-bold mb-3">
                  Can I combine multiple services?
                </h3>
                <p className="text-gray-300">
                  Yes, many of our clients combine services. For example, you
                  might enroll in our Mentorship program while also subscribing
                  to our Signals service to supplement your learning.
                </p>
              </div>

              <div className="card-neumorphic p-6">
                <h3 className="text-xl font-bold mb-3">
                  What is the refund policy?
                </h3>
                <p className="text-gray-300">
                  We offer a 7-day money-back guarantee for our Mentorship
                  programs. Signal subscriptions and Account Management services
                  can be canceled at any time, but are non-refundable for the
                  current billing period.
                </p>
              </div>

              <div className="card-neumorphic p-6">
                <h3 className="text-xl font-bold mb-3">
                  How are profits calculated in Account Management?
                </h3>
                <p className="text-gray-300">
                  Profits are calculated on a monthly basis. Our fee is a
                  percentage of the net profits generated in your account. If
                  there are no profits in a given month, no management fee is
                  charged.
                </p>
              </div>

              <div className="card-neumorphic p-6">
                <h3 className="text-xl font-bold mb-3">
                  How do I receive trading signals?
                </h3>
                <p className="text-gray-300">
                  Signals are delivered through our mobile app, Telegram group,
                  and email. You'll receive notifications with detailed entry,
                  stop-loss, and take-profit levels for each trade.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-emerald/10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

        <div className="container-custom relative z-10">
          <div className="card-glass border border-gray-700/30 p-8 md:p-12 text-center max-w-4xl mx-auto">
            <AnimatedSection>
              <h2 className="heading-lg mb-6">
                Ready To <span className="gradient-text">Transform</span> Your
                Trading?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Choose the service that best fits your needs and start your
                journey to consistent profitability with SBM Forex Academy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn btn-primary">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/faq" className="btn btn-outline">
                  More Questions?
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;