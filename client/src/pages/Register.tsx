import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
  useEffect(() => {
    document.title = 'Register - SBM Forex Academy';
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!formData.agreeToTerms) {
      toast.error('You must agree to the Terms of Service');
      return;
    }
    
    // Submit form (in a real app, this would call an API)
    toast.success('Registration successful! Welcome to SBM Forex Academy.');
    console.log('Form submitted:', formData);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    });
  };

  return (
    <div className="section-padding bg-dark relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Information Section */}
            <AnimatedSection>
              <div className="card-glass p-8 border border-gray-700/30 h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h1 className="heading-lg mb-6 text-gray-900">
                      Join <span className="gradient-text">SBM Forex Academy</span>
                    </h1>
                    <p className="text-gray-400 mb-8">
                      Create your account today and get access to premium forex education, 
                      accurate trading signals, and professional account management services.
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald mt-0.5" />
                        <p className="text-gray-400">
                          Access to basic educational resources
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald mt-0.5" />
                        <p className="text-gray-400">
                          Weekly market analysis newsletter
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald mt-0.5" />
                        <p className="text-gray-400">
                          Community forum access
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald mt-0.5" />
                        <p className="text-gray-400">
                          Special offers on premium services
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-dark-lighter p-4 rounded-lg">
                    <div className="text-sm mb-2 text-gray-700">Already have an account?</div>
                    <Link to="/login" className="text-gold hover:underline font-medium">
                      Sign in to your account →
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            {/* Registration Form */}
            <AnimatedSection delay={0.1}>
              <div className="card-glass p-8 border border-gray-700/30">
                <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50"
                        required
                      />
                    </div>
                  </div>
                  
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
                    <p className="text-xs text-gray-400 mt-1">
                      Password must be at least 8 characters long with a mix of letters, numbers, and symbols.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="h-4 w-4 accent-gold rounded border-gray-600 focus:ring-2 focus:ring-gold/50"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="text-gray-400">
                        I agree to the <a href="#" className="text-gold hover:underline">Terms of Service</a> and <a href="#" className="text-gold hover:underline">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gold to text-white py-3 px-4 rounded-md font-medium hover:shadow-glow transition-all duration-300"
                  >
                    Create Account
                  </button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;