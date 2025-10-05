import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
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
    // Close menus when route changes
    setIsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Close mobile drawer on outside click
    function handleClickOutside(e: MouseEvent) {
      if (!mobileOpen) return;
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
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
        className={`${scrolled
            ? "bg-dark-darker/95 shadow-lg backdrop-blur-xl border-b border-gray-800"
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
                  className={`relative font-medium transition-colors ${pathname === link.path ? "text-gold" : "text-gray-400 hover:text-gold"}`}
                >
                  {link.name}
                  {pathname === link.path && (
                    <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-gold rounded" />
                  )}
                </Link>
              ))}

              {/* Keep original link set only */}

              <div className="ml-4 flex items-center gap-4">
                <Link to="/login" className="btn btn-outline py-2 px-5">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary py-2 px-5">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                aria-label={isOpen ? "Close Menu" : "Open Menu"}
                onClick={() => {
                  setIsOpen((v) => !v);
                  setMobileOpen((v) => !v);
                }}
                className="p-2 text-gray-900 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
            >
              <motion.div
                ref={drawerRef}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-dark-darker border-l border-gray-800 shadow-2xl p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold text-gold">Menu</span>
                  <button aria-label="Close menu" onClick={() => { setIsOpen(false); setMobileOpen(false); }}>
                    <X />
                  </button>
                </div>
                <div className="space-y-3">
                  {links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-3 py-2 rounded font-medium transition-colors ${pathname === link.path ? "text-gold bg-white/5" : "text-gray-400 hover:text-gold hover:bg-white/5"}`}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className="pt-4 mt-4 border-t border-gray-800">
                    <p className="px-3 text-xs uppercase tracking-wide text-gray-600 mb-2">Explore</p>
                    <Link to="/services" className="block px-3 py-2 rounded text-gray-400 hover:text-gold hover:bg-white/5">Our Services</Link>
                    <Link to="/about" className="block px-3 py-2 rounded text-gray-400 hover:text-gold hover:bg-white/5">About Us</Link>
                    <Link to="/faq" className="block px-3 py-2 rounded text-gray-400 hover:text-gold hover:bg-white/5">FAQ</Link>
                    <Link to="/gallery" className="block px-3 py-2 rounded text-gray-400 hover:text-gold hover:bg-white/5">Gallery</Link>
                  </div>

                  <div className="pt-6 flex flex-col gap-3">
                    <Link to="/login" className="btn btn-outline py-2 w-full">Login</Link>
                    <Link to="/register" className="btn btn-primary py-2 w-full">Get Started</Link>
                  </div>
                </div>
              </motion.div>
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