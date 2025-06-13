import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, X } from "lucide-react";
import AnimatedSection from "../components/ui/AnimatedSection";
import { toast } from "react-hot-toast";

const RegisterPage = () => {
  useEffect(() => {
    document.title = "Register - SBM Forex Academy";
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false); // <-- Add state for modal
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("You must agree to the Terms of Service");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      // Optionally store tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      toast.success("Registration successful! Welcome to SBM Forex Academy.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });

      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="section-padding bg-dark relative">
      {/* Terms of Service & Privacy Policy Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-dark-lighter max-w-2xl w-full rounded-lg shadow-lg p-8 relative border border-gray-700 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gold"
              onClick={() => setShowTerms(false)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gold">
              SBM Forex Trading Academy Disclaimer and Risk Warning
            </h2>
            <div className="text-gray-500 text-sm space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <strong>Important Notice</strong>
                <p>
                  Before engaging with SBM Forex Trading Academy's services,
                  including mentorship programs, trading signals, or investment
                  opportunities, please carefully read, understand, and accept
                  the terms and conditions outlined below. Trading in Forex and
                  other financial markets involves significant risks, and you
                  should carefully consider your financial situation, investment
                  objectives, and risk tolerance before participating.
                </p>
              </div>
              <div>
                <strong>Risk Disclosure</strong>
                <ul className="list-disc ml-5">
                  <li>
                    <b>Trading Risks:</b> Trading in Forex and other financial
                    markets involves substantial risks, including market
                    volatility, liquidity risks, and the risk of losing your
                    entire investment.
                  </li>
                  <li>
                    <b>No Guarantee of Success:</b> Our services are designed to
                    provide educational content, trading signals, and guidance,
                    but they are not a guarantee of success. Past performance is
                    not indicative of future results.
                  </li>
                  <li>
                    <b>Investment Risk:</b> You should only invest money that
                    you can afford to lose. We will not be responsible for any
                    losses or damages resulting from your trading decisions.
                  </li>
                </ul>
              </div>
              <div>
                <strong>Disclaimer</strong>
                <ul className="list-disc ml-5">
                  <li>
                    <b>Educational and Informational Content:</b> Our services
                    provide educational content, trading signals, and guidance,
                    and should not be considered as investment advice or a
                    solicitation to trade.
                  </li>
                  <li>
                    <b>No Fiduciary Relationship:</b> Our relationship with you
                    is that of a service provider and client, and we do not owe
                    you any fiduciary duties.
                  </li>
                  <li>
                    <b>Independent Trading Decisions:</b> You are responsible
                    for making your own trading decisions, and you should not
                    rely solely on the information provided by us.
                  </li>
                </ul>
              </div>
              <div>
                <strong>Investor and Signal User Acknowledgement</strong>
                <ul className="list-disc ml-5">
                  <li>
                    <b>Assumption of Risk:</b> By investing or using our trading
                    signals, you acknowledge that you are aware of the risks
                    involved in trading in Forex and other financial markets,
                    and you assume full responsibility for any losses or damages
                    resulting from your trading decisions.
                  </li>
                  <li>
                    <b>Due Diligence:</b> You acknowledge that you have
                    conducted your own due diligence on our services and
                    understand the risks and potential rewards.
                  </li>
                </ul>
              </div>
              <div>
                <strong>Privacy Policy</strong>
                <ul className="list-disc ml-5">
                  <li>
                    <b>Confidentiality:</b> We respect your privacy and will
                    keep your personal and financial information confidential.
                    We will not share your information with any third parties
                    without your consent.
                  </li>
                  <li>
                    <b>Data Protection:</b> We will take reasonable steps to
                    protect your personal and financial information from
                    unauthorized access, disclosure, or destruction.
                  </li>
                </ul>
              </div>
              <div>
                <strong>Terms of Service</strong>
                <ul className="list-disc ml-5">
                  <li>
                    <b>Acknowledgement:</b> By engaging with our services, you
                    acknowledge that you have read, understood, and agreed to
                    these terms and conditions.
                  </li>
                  <li>
                    <b>Release of Liability:</b> You release and hold harmless
                    SBM Forex Trading Academy, its officers, directors,
                    employees, and agents from any and all claims, demands, and
                    causes of action arising from or related to your use of our
                    services.
                  </li>
                </ul>
              </div>
              <div>
                <strong>Important Notice</strong>
                <p>
                  Our services are not a solicitation or offer to trade, and are
                  not intended to provide personalized investment advice. You
                  should not rely solely on the information provided by us in
                  making your trading decisions. You should consult with a
                  financial advisor or other professional before making any
                  investment decisions.
                </p>
                <p>
                  By engaging with our services, you confirm that you have read
                  and understood these terms and conditions. If you have any
                  questions or concerns, please contact us before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                      Join{" "}
                      <span className="gradient-text">SBM Forex Academy</span>
                    </h1>
                    <p className="text-gray-400 mb-8">
                      Create your account today and get access to premium forex
                      education, accurate trading signals, and professional
                      account management services.
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
                        <p className="text-gray-400">Community forum access</p>
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
                    <div className="text-sm mb-2 text-gray-700">
                      Already have an account?
                    </div>
                    <Link
                      to="/login"
                      className="text-gold hover:underline font-medium"
                    >
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
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

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
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Password must be at least 8 characters long with a mix of
                      letters, numbers, and symbols.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 disabled:opacity-50"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
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
                        disabled={isLoading}
                        className="h-4 w-4 accent-gold rounded border-gray-600 focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="text-gray-400">
                        I agree to the{" "}
                        <button
                          type="button"
                          className="text-gold hover:underline bg-transparent p-0 m-0 border-0 disabled:opacity-50"
                          style={{ textDecoration: "underline" }}
                          onClick={() => setShowTerms(true)}
                          disabled={isLoading}
                        >
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          className="text-gold hover:underline bg-transparent p-0 m-0 border-0 disabled:opacity-50"
                          style={{ textDecoration: "underline" }}
                          onClick={() => setShowTerms(true)}
                          disabled={isLoading}
                        >
                          Privacy Policy
                        </button>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gold text-white py-3 px-4 rounded-md font-medium hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
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
