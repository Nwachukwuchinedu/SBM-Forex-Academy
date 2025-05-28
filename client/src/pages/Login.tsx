import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  useEffect(() => {
    document.title = 'Login - SBM Forex Academy';
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Submit form (in a real app, this would call an API)
    toast.success('Login successful! Welcome back.');
    console.log('Form submitted:', formData);
    
    // Reset form
    setFormData({
      email: '',
      password: '',
      rememberMe: false
    });
  };

  return (
    <div className="section-padding bg-dark relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-md mx-auto">
          <AnimatedSection>
            <div className="card-glass p-8 border border-gray-700/30">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gold to-amber-400 rounded-full blur-sm opacity-70"></div>
                  <div className="relative bg-white rounded-full p-4 flex items-center justify-center">
                    <TrendingUp className="text-gold h-8 w-8" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-700">Sign in to access your SBM Forex Academy account</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 accent-gold rounded border-gray-600 focus:ring-2 focus:ring-gold/50"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-400">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="text-gold hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gold to text-white py-3 px-4 rounded-md font-medium hover:shadow-glow transition-all duration-300"
                >
                  Sign In
                </button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-gray-700 text-center">
                <p className="text-gray-400 text-sm mb-2">Don't have an account?</p>
                <Link
                  to="/register"
                  className="w-full inline-block bg-dark-lighter border border-gold text-gold py-2 px-4 rounded-md font-medium hover:bg-gold hover:text-white transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;