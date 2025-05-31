import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menu when route changes
    setIsOpen(false);
  }, [pathname]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <header className="relative bg-dark-darker">
      {/* Alert Banner */}
      <div className="bg-gold text-gray-900 py-2 px-4 text-center font-medium">
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>
            Our official website is sbmforexacademy.com – Beware of fake!
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={`${
          scrolled
            ? "bg-dark-darker shadow-lg backdrop-blur-lg bg-opacity-90"
            : "bg-transparent"
        } fixed w-full z-50 transition-all duration-300`}
      >
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <Logo className="h-10 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-900">SBM Forex</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium hover:text-gold transition-colors ${
                    pathname === link.path ? "text-gold" : "text-gray-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* <div className="ml-4 flex items-center gap-4">
                <Link to="/login" className="btn btn-outline py-2 px-5">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary py-2 px-5">
                  Register
                </Link>
              </div> */}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                aria-label={isOpen ? "Close Menu" : "Open Menu"}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-900 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white overflow-hidden"
            >
              <div className="container-custom py-4 space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 font-medium transition-colors ${
                      pathname === link.path ? "text-gold" : "text-gray-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {/* <div className="pt-4 flex flex-col gap-3 border-t border-gray-700">
                  <Link to="/login" className="btn btn-outline py-2 w-full">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary py-2 w-full">
                    Register
                  </Link>
                </div> */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed header */}
      <div className="h-[72px]"></div>
    </header>
  );
};

export default Header;