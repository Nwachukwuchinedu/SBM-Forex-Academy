import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

const NotFoundPage = () => {
  useEffect(() => {
    document.title = '404 - Page Not Found | SBM Forex Academy';
  }, []);

  const popularLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Our Services', path: '/services', icon: <Search className="h-4 w-4" /> },
    { name: 'About Us', path: '/about', icon: <HelpCircle className="h-4 w-4" /> },
    { name: 'FAQ', path: '/faq', icon: <HelpCircle className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden">
      <Helmet>
        <title>404 - Page Not Found | SBM Forex Academy</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to SBM Forex Academy homepage or explore our forex education services." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-darker to-dark opacity-90"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-gold/5 rounded-full blur-2xl animate-bounce"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-gold via-amber-400 to-emerald bg-clip-text text-transparent leading-none">
                404
              </h1>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-emerald/20 blur-3xl"></div>
                <p className="text-2xl md:text-3xl font-semibold text-gray-300 relative">
                  Page Not Found
                </p>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-12">
              <h2 className="text-xl md:text-2xl font-medium text-gray-400 mb-4">
                Oops! The page you're looking for doesn't exist.
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                It seems like the page you're trying to reach has been moved, deleted, or never existed. 
                Don't worry though - let's get you back on track to mastering forex trading!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/" 
                className="btn btn-primary inline-flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
              <Link 
                to="/services" 
                className="btn btn-outline inline-flex items-center justify-center"
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Services
              </Link>
            </div>

            {/* Popular Links */}
            <div className="card-glass p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-300 mb-6">
                Popular Pages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="flex flex-col items-center p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors group"
                  >
                    <div className="text-gold group-hover:text-amber-400 transition-colors mb-2">
                      {link.icon}
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {link.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 mb-4">
                Still can't find what you're looking for?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/faq" 
                  className="text-gold hover:text-amber-400 transition-colors"
                >
                  Check our FAQ
                </Link>
                <span className="hidden sm:inline text-gray-600">•</span>
                <a 
                  href="mailto:support@sbmforexacademy.com" 
                  className="text-emerald hover:text-emerald-400 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Animated Trading Chart Background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M0,150 Q200,100 400,120 T800,80"
            stroke="url(#chartGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M0,180 Q200,130 400,150 T800,110"
            stroke="url(#chartGradient)"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </svg>
      </div>
    </div>
  );
};

export default NotFoundPage;