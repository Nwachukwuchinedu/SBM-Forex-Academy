import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center bg-hero-pattern bg-cover bg-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-gold/20 text-gold px-4 py-1 rounded-full text-sm font-medium mb-6">
              Premier Forex Education & Trading
            </span>

            <h1 className="heading-xl mb-6 text-gray-900">
              Master the <span className="gradient-text">Forex Market</span>{" "}
              With Expert Guidance
            </h1>

            <p className="text-gray-900 text-lg mb-8 max-w-lg">
              Join thousands of successful traders who have transformed their
              trading journey with SBM Forex Academy's proven strategies and
              expert mentorship.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn btn-primary">
                Join Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link to="/services" className="btn btn-outline">
                Our Services
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-gray-800 overflow-hidden bg-gray-700 flex items-center justify-center text-xs font-bold"
                  >
                    SBM
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="text-gray-900">
                  Joined by{" "}
                  <span className="text-gold font-semibold">5,000+</span>{" "}
                  traders
                </p>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-gold">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Graphic/Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="card-glass p-8 relative z-10">
                <div className="bg-dark-lighter p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gold mb-2">
                    Latest Signal Success
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">EUR/USD</span>
                      <span className="text-emerald font-medium">
                        +125 pips
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">GBP/JPY</span>
                      <span className="text-emerald font-medium">
                        +213 pips
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">USD/CAD</span>
                      <span className="text-emerald font-medium">+87 pips</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gold/20 to-gold/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">
                    Ready to transform your trading?
                  </h3>
                  <p className="text-sm text-gray-900 mb-4">
                    Get started today with our premium forex education and
                    signals.
                  </p>
                  <Link
                    to="/register"
                    className="text-gold flex items-center text-sm font-medium"
                  >
                    Get Started <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                {/* Floating badges */}
                <div className="absolute -bottom-4 -right-4 bg-dark-lighter py-2 px-4 rounded-lg shadow-lg border border-gold/30 animate-float">
                  <div className="text-xs">Weekly Win Rate</div>
                  <div className="text-lg font-bold text-gold">92.5%</div>
                </div>

                <div
                  className="absolute -top-4 -left-4 bg-dark-lighter py-2 px-4 rounded-lg shadow-lg border border-emerald/30 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="text-xs">Total Signals</div>
                  <div className="text-lg font-bold text-emerald">17,400+</div>
                </div>
              </div>

              {/* Background glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 to-emerald/20 rounded-xl blur-3xl opacity-30 -z-10"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;