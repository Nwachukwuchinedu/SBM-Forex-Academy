import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- add useNavigate
import { Eye, EyeOff, TrendingUp, Mail, AlertCircle } from "lucide-react";
import AnimatedSection from "../components/ui/AnimatedSection";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  useEffect(() => {
    document.title = "Login - SBM Forex Academy";
  }, []);

  const navigate = useNavigate(); // <-- initialize navigate

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState<any>(null);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Function to clear all authentication-related data from localStorage
  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    // You can add other auth-related keys here if needed
    console.log("Previous authentication data cleared");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Clear any existing authentication data before attempting login
    clearAuthData();

    setIsLoading(true); // Start loading

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      // Check if email is verified
      if (!data.user.isEmailVerified) {
        setUnverifiedUser(data.user);
        setShowVerificationPrompt(true);
        toast.error("Please verify your email address before accessing your account");
        return;
      }

      // Store new tokens only if email is verified
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("New authentication data stored");

      toast.success("Login successful! Welcome back.");

      // Redirect to dashboard
      navigate("/dashboard");

      // Reset form
      setFormData({
        email: "",
        password: "",
        rememberMe: false,
      });
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedUser?.email) return;

    setIsResending(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: unverifiedUser.email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    } catch (err) {
      console.error("Resend verification error:", err);
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    setShowVerificationPrompt(false);
    setUnverifiedUser(null);
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    });
  };

  // Verification Prompt Component
  if (showVerificationPrompt) {
    return (
      <div className="section-padding bg-dark relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-md mx-auto">
            <AnimatedSection>
              <div className="card-glass p-8 border border-gray-700/30">
                <div className="text-center mb-8">
                  <div className="mx-auto w-16 h-16 mb-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-sm opacity-70"></div>
                    <div className="relative bg-white rounded-full p-4 flex items-center justify-center">
                      <Mail className="text-amber-500 h-8 w-8" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Email Verification Required</h1>
                  <p className="text-gray-700">
                    Please verify your email address to access your account
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-700">
                      <p className="font-medium mb-1">Account Found</p>
                      <p>
                        We found your account ({unverifiedUser?.email}), but your email address hasn't been verified yet.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full bg-gradient-to-r from-gold to-amber-400 text-white py-3 px-4 rounded-md font-medium hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? "Sending..." : "Resend Verification Email"}
                  </button>

                  <button
                    onClick={handleBackToLogin}
                    className="w-full bg-dark-lighter border border-gray-700 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors"
                  >
                    Back to Login
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    Check your spam folder if you don't see the email.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    );
  }

  // Regular Login Form
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
                <p className="text-gray-700">
                  Sign in to access your SBM Forex Academy account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 disabled:opacity-50"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
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
                      disabled={isLoading}
                      className="h-4 w-4 accent-gold rounded border-gray-600 focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 block text-sm text-gray-400"
                    >
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
                  disabled={isLoading}
                  className="w-full bg-gold text-white py-3 px-4 rounded-md font-medium hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-700 text-center">
                <p className="text-gray-400 text-sm mb-2">
                  Don't have an account?
                </p>
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
