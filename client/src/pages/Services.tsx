import { useEffect } from "react";
import {
  BookOpen,
  LineChart,
  BarChart3,
  Check,
  ArrowRight,
} from "lucide-react";
import AnimatedSection from "../components/ui/AnimatedSection";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  useEffect(() => {
    document.title = "Our Services - SBM Forex Academy";
  }, []);

  const services = [
    {
      id: "mentorship",
      title: "SBM Forex Mentorship",
      subtitle: "Exclusive & General Mentorship Programs",
      description:
        "Choose between our exclusive one-on-one mentorship with SBM Fx or our general in-class mentorship. Both programs are designed to take you from beginner to advanced, with hands-on training, live trading, and access to our trading community.",
      icon: BookOpen,
      color: "gold",
      features: [
        "Beginner to Advanced course",
        "Live trading and analysis",
        "Learn SBM Fx’s strategy",
        "Earn masterclass certificate",
        "Access to trading floor and community groups",
        "Physical or online options",
        "Accommodation for physical training (Lagos, Nigeria)",
      ],
      pricing: [
        {
          name: "EXCLUSIVE MENTORSHIP",
          price: "$600",
          period: "2 weeks (one-time payment)",
          features: [
            "One-on-one with SBM Fx (physical or online)",
            "2 weeks intensive training",
            "Live trading and analysis",
            "Access to all trading floor",
            "Learn SBM’s strategy directly",
            "Earn masterclass certificate",
          ],
        },
        {
          name: "MENTORSHIP (Physical)",
          price: "$210",
          period: "per month (one-time payment)",
          features: [
            "General in-class mentorship",
            "Physical training in Lagos, Nigeria",
            "Accommodation included",
            "Intensive one month training",
            "4 times a week (Mon, Tue, Thu, Fri)",
            "Live trading with SBM Fx",
            "Access to students group",
            "Access to community group",
            "Earn masterclass certificate",
          ],
        },
        {
          name: "MENTORSHIP (Online)",
          price: "$300",
          period: "per month (one-time payment)",
          features: [
            "General in-class mentorship (online)",
            "Intensive one month training",
            "4 times a week (Mon, Tue, Thu, Fri)",
            "Live trading with SBM Fx",
            "Access to students group",
            "Access to community group",
            "Earn masterclass certificate",
          ],
        },
      ],
    },
    {
      id: "signals",
      title: "SBM Forex Signals",
      subtitle: "High-Accuracy Trading Signals",
      description:
        "Get access to our powerful user panel and receive high-accuracy trading signals with premium support and advanced options. Choose the plan that fits your trading style and schedule.",
      icon: LineChart,
      color: "emerald",
      features: [
        "Powerful User Panel",
        "98% signal accuracy",
        "Premium support",
        "Advance options",
        "Flexible packages",
      ],
      pricing: [
        {
          name: "BRONZE",
          price: "$55",
          period: "2 weeks",
          features: [
            "Powerful User Panel",
            "2 WEEKS 98% signal",
            "Support",
            "1 Day Added to Package",
            "Advance Options",
          ],
        },
        {
          name: "GOLD",
          price: "$90",
          period: "per month",
          features: [
            "Powerful User Panel",
            "1 MONTH 98% signal",
            "Support",
            "2 Days Added to Package",
            "Advance Options",
          ],
        },
        {
          name: "PLATINUM",
          price: "$700",
          period: "per year",
          features: [
            "Powerful User Panel",
            "1 YEAR 98% signal",
            "Support",
            "4 Days Added to Package",
            "Advance Options",
          ],
        },
      ],
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
            <h1 className="heading-xl mb-6 text-gray-900">
              Premium Forex <span className="gradient-text">Solutions</span>
            </h1>
            <p className="text-gray-400 text-lg">
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
            <h2 className="heading-lg mb-6 text-gray-900">
              Choose The Right{" "}
              <span className="emerald-gradient-text">Service For You</span>
            </h2>
            <p className="text-gray-400">
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
                      <p className="text-gray-400 mb-8">
                        {service.description}
                      </p>

                      <div className="space-y-4 mb-8">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className={`mt-1 text-${service.color}`}>
                              <Check className="h-5 w-5" />
                            </div>
                            <p className="text-gray-400">{feature}</p>
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
                              <h4 className="font-bold mb-2 text-gray-700">
                                {plan.name}
                              </h4>
                              <div className="flex items-end gap-1 mb-4">
                                <span
                                  className={`text-2xl font-bold text-${service.color}`}
                                >
                                  {plan.price}
                                </span>
                                <span className="text-gray-500 text-sm">
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
                                    <span className="text-gray-400">
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
            <h2 className="heading-lg mb-6 text-gray-900">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-gray-400">
              Find answers to common questions about our services.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="card-neumorphic p-6">
                <h3 className="text-xl font-bold mb-3">
                  How do I choose the right service for me?
                </h3>
                <p className="text-gray-400">
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
                <p className="text-gray-400">
                  Yes, many of our clients combine services. For example, you
                  might enroll in our Mentorship program while also subscribing
                  to our Signals service to supplement your learning.
                </p>
              </div>

              <div className="card-neumorphic p-6">
                <h3 className="text-xl font-bold mb-3">
                  What is the refund policy?
                </h3>
                <p className="text-gray-400">
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
                <p className="text-gray-400">
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
                <p className="text-gray-400">
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
              <h2 className="heading-lg mb-6 text-gray-900">
                Ready To <span className="gradient-text">Transform</span> Your
                Trading?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
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
