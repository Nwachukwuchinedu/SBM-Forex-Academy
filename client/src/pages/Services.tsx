import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from "lucide-react";
import AnimatedSection from "../components/ui/AnimatedSection";
import { Link } from "react-router-dom";
import SchemaMarkup from '../components/seo/SchemaMarkup';
import { ORGANIZATION_DATA } from '../data/schemaData';
import { Course } from '../types/schema';

const ServicesPage = () => {
  useEffect(() => {
    document.title = "Our Services - SBM Forex Academy";
  }, []);

  const courseSchemas: Course[] = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Standard Forex Mentorship Program",
      description: "Monthly access to expert trading insights, personalized support, and exclusive trading community access.",
      provider: ORGANIZATION_DATA,
      courseMode: "online",
      educationalLevel: "beginner to advanced",
      offers: {
        "@type": "Offer",
        price: "210",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "VIP Forex Mentorship Program",
      description: "Comprehensive mentorship with physical training, accommodation, one-on-one coaching, and priority access to trading signals.",
      provider: ORGANIZATION_DATA,
      courseMode: "blended",
      educationalLevel: "intermediate to advanced",
      offers: {
        "@type": "Offer",
        price: "1000",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Forex Trading Signals Service",
      description: "Professional forex trading signals with expert analysis, market insights, and trade strategies.",
      provider: ORGANIZATION_DATA,
      courseMode: "online",
      offers: {
        "@type": "Offer",
        price: "80",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock"
      }
    }
  ];

  return (
    <div>
      <Helmet>
        <title>Our Services - SBM Forex Academy</title>
        <meta name="description" content="Explore our comprehensive forex services: mentorship programs, trading signals, and professional account management. Choose the perfect package for your trading journey." />
      </Helmet>

      <SchemaMarkup schema={courseSchemas} />

      {/* Mentorship Packages */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-6 text-gray-900">
              Mentorship <span className="gradient-text">Package</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Elevate your trading skills with our expert guidance. Choose from
              two packages:
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Mentorship */}
            <div className="card-glass p-8 border border-gold/30">
              <h3 className="text-xl font-bold mb-4 text-gold">
                Standard Mentorship
              </h3>
              <div className="text-2xl font-bold mb-2 text-gold">
                $210
                <span className="text-base font-normal text-gray-400">
                  /month
                </span>
              </div>
              <ul className="text-gray-400 mb-6 space-y-2 text-left">
                <li>
                  • Monthly access to expert trading insights and strategies
                </li>
                <li>• Personalized support and feedback</li>
                <li>• Exclusive trading community access</li>
                <li>• Regular market analysis and updates</li>
              </ul>
              <Link to="/register" className="btn btn-primary w-full">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            {/* VIP Mentorship */}
            <div className="card-glass p-8 border border-gold/30">
              <h3 className="text-xl font-bold mb-4 text-gold">
                VIP Mentorship Package
              </h3>
              <div className="text-2xl font-bold mb-2 text-gold">
                $1000
                <span className="text-base font-normal text-gray-400">
                  /month
                </span>
              </div>
              <ul className="text-gray-400 mb-6 space-y-2 text-left">
                <li>• All Standard Mentorship benefits</li>
                <li>
                  • Physical teaching and training at our apartment facility
                </li>
                <li>
                  • Daily meals and accommodation (for out-of-town participants)
                </li>
                <li>• One-on-one personalized coaching and mentorship</li>
                <li>
                  • Priority access to expert analysis and trading signals
                </li>
              </ul>
              <Link to="/register" className="btn btn-primary w-full">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="text-center mt-12 text-gray-400 text-lg">
            Our mentorship packages are designed to help you achieve your
            trading goals.
          </div>
        </div>
      </section>

      {/* Account Management Services */}
      <section className="section-padding bg-dark-darker">
        <div className="container-custom">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-6 text-gray-900">
              Account Management <span className="gradient-text">Services</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Let us help you manage your trading account with expertise and
              precision. Choose from our tiered packages:
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Account Management */}
            <div className="card-glass p-8 border border-emerald/30">
              <h3 className="text-xl font-bold mb-4 text-emerald-400">
                Basic Account Management
              </h3>
              <div className="text-2xl font-bold mb-2 text-gold">
                $500
                <span className="text-base font-normal text-gray-400">
                  /month
                </span>
              </div>
              <ul className="text-gray-400 mb-6 space-y-2 text-left">
                <li>• Professional account setup and configuration</li>
                <li>• Regular market analysis and trading signals</li>
                <li>• Basic risk management and position sizing</li>
              </ul>
              <Link to="/register" className="btn btn-primary w-full">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            {/* Advanced Account Management */}
            <div className="card-glass p-8 border border-emerald/30">
              <h3 className="text-xl font-bold mb-4 text-emerald-400">
                Advanced Account Management
              </h3>
              <div className="text-2xl font-bold mb-2 text-gold">
                $1000 - $5000
                <span className="text-base font-normal text-gray-400">
                  /month
                </span>
              </div>
              <ul className="text-gray-400 mb-6 space-y-2 text-left">
                <li>• All Basic package benefits</li>
                <li>• Customized trading strategies and plans</li>
                <li>• Advanced risk management and portfolio optimization</li>
                <li>• Regular performance analysis and reporting</li>
              </ul>
              <Link to="/register" className="btn btn-primary w-full">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            {/* Premium Account Management */}
            <div className="card-glass p-8 border border-emerald/30">
              <h3 className="text-xl font-bold mb-4 text-emerald-400">
                Premium Account Management
              </h3>
              <div className="text-2xl font-bold mb-2 text-gold">
                $5000 - $10000
                <span className="text-base font-normal text-gray-400">
                  /month
                </span>
              </div>
              <ul className="text-gray-400 mb-6 space-y-2 text-left">
                <li>• All Advanced package benefits</li>
                <li>
                  • Personalized trading coach and dedicated account manager
                </li>
                <li>• Advanced technical analysis and market research</li>
                <li>• High-net-worth account management and optimization</li>
              </ul>
              <Link to="/register" className="btn btn-primary w-full">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="text-center mt-12 text-gray-400 text-lg">
            Our account management services are designed to help you achieve
            your trading goals. Select the package that best suits your needs
            and budget.
          </div>
        </div>
      </section>

      {/* Signal Provision Service */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="heading-lg mb-6 text-gray-900">
              Signal Provision <span className="gradient-text">Service</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Get access to expert trading signals and boost your trading
              performance! Our signal provision service provides:
            </p>
          </AnimatedSection>
          <div className="max-w-xl mx-auto">
            <div className="card-glass p-8 border border-gold-400/30">
              <div className="text-2xl font-bold mb-2 text-gold">
                $80
                <span className="text-base font-normal text-gray-400">
                  /month
                </span>
              </div>
              <ul className="text-gray-400 mb-6 space-y-2 text-left">
                <li>• Accurate and timely trading signals</li>
                <li>• Expert analysis and market insights</li>
                <li>• Trade entry and exit strategies</li>
              </ul>
              <Link to="/register" className="btn btn-primary w-full">
                Subscribe Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="text-center mt-12 text-gray-400 text-lg">
            Stay ahead of the market with our signal provision service.
            Subscribe now and start trading with confidence!
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
