import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="section-padding relative overflow-hidden bg-dark-darker">
      {/* Background gradient */}
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
              Join thousands of traders who have elevated their forex trading
              with SBM Forex Academy's expert mentorship, accurate signals, and
              professional account management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <Link to="/register" className="btn btn-primary">
                Join Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link> */}
              <Link to="/services" className="btn btn-outline">
                Explore Services
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-400">
              Start your trading journey today – No credit card required for
              basic membership
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;