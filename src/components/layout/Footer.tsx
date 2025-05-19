import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer = () => {
  return (
    <footer className="bg-dark-darker pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="h-10 w-auto" />
              <span className="text-xl font-bold">SBM Forex</span>
            </div>
            <p className="text-gray-400 text-sm">
              SBM Forex Academy is a premier forex education and trading service provider, 
              helping traders worldwide achieve consistent profits through expert mentorship, 
              reliable signals, and professional account management.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gold transition-colors duration-300">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" 
                className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gold transition-colors duration-300">
                <Youtube size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gold transition-colors duration-300">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gold transition-colors duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-gold transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-gold transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-gold transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-gold transition-colors">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-gold transition-colors">Register</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-gold transition-colors">Forex Mentorship</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-gold transition-colors">Forex Signals</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-gold transition-colors">Account Management</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gold mt-0.5" />
                <a href="mailto:support@sbmforexacademy.com" className="text-gray-400 hover:text-gold transition-colors">
                  support@sbmforexacademy.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gold mt-0.5" />
                <span className="text-gray-400">+234 000 000 0000</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold mt-0.5" />
                <span className="text-gray-400">123 Trading Street, Financial District, Lagos 10004</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © 2021–2025 SBM Forex Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;