import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DollarSign,
  User,
  FileText,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

const mentorshipPlans = [
  { name: "Standard Mentorship", price: 210, duration: "1 MONTH" },
  { name: "VIP Mentorship Package", price: 1000, duration: "1 MONTH" },
];

// const accountManagementPlans = [
//   { name: "Basic Account Management", price: 500, duration: "1 MONTH" },
//   {
//     name: "Advanced Account Management",
//     price: "1000 - 5000",
//     duration: "1 MONTH",
//   },
//   {
//     name: "Premium Account Management",
//     price: "5000 - 10000",
//     duration: "1 MONTH",
//   },
// ];

const signalPlans = [
  { name: "Signal Provision Service", price: 80, duration: "1 MONTH" },
];

const AuthServicesPage = () => {
  const [user, setUser] = useState<{ firstName: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string } | null>(
    null
  );
  const avatarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch user info for avatar
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 401) {
          localStorage.removeItem("accessToken");
          navigate("/login");
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch {
        navigate("/login");
      }
    };
    fetchUser();
    document.title = "Services - SBM Forex Academy";
  }, [navigate]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Consent Modal
  const ConsentModal = () =>
    consentOpen && selectedPlan ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-dark-lighter rounded-lg shadow-lg p-8 max-w-md w-full border border-gray-700">
          <h3 className="text-xl font-bold text-gold mb-4">Consent Required</h3>
          <p className="text-gray-400 mb-6">
            By subscribing to{" "}
            <span className="font-semibold text-gold">{selectedPlan.name}</span>
            , you acknowledge and agree that you understand the risks involved
            in forex trading and account management. SBM Forex Academy is not
            liable for any financial losses. Please ensure you have read and
            understood all terms and conditions before proceeding.
          </p>
          <div className="flex justify-end gap-4">
            <button
              className="btn btn-outline"
              onClick={() => setConsentOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setConsentOpen(false);
                // Redirect to the plan's payment page (example: /dashboard/service/plan-name)
                navigate(
                  `/dashboard/service/${encodeURIComponent(
                    selectedPlan.name.toLowerCase().replace(/\s+/g, "-")
                  )}`
                );
              }}
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    ) : null;

  // Logout handler
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // ignore error, proceed to clear tokens
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setMenuOpen(false);
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark">
        <span className="text-gold text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-dark">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark-darker border-r border-gray-800 py-8 px-4">
        <div className="mb-10">
          <span className="text-2xl font-bold text-gold">SBM Forex</span>
        </div>
        <nav className="flex flex-col gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-400 hover:text-gold transition"
          >
            <User className="h-5 w-5" /> Dashboard
          </Link>
          {/* <Link
            to="/dashboard/subscription"
            className="flex items-center gap-3 text-gray-400 hover:text-gold transition"
          >
            <CreditCard className="h-5 w-5" /> My Subscription
          </Link>
          <Link
            to="/dashboard/history"
            className="flex items-center gap-3 text-gray-400 hover:text-gold transition"
          >
            <FileText className="h-5 w-5" /> Transaction History
          </Link> */}
          <Link
            to="/dashboard/service"
            className="flex items-center gap-3 text-gold font-semibold"
          >
            <DollarSign className="h-5 w-5" /> Services
          </Link>
          <Link
            to="/dashboard/account"
            className="flex items-center gap-3 text-gray-400 hover:text-gold transition"
          >
            <Settings className="h-5 w-5" /> Account Setting
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Responsive Navbar */}
        <header className="md:hidden flex items-center justify-between bg-dark-darker px-4 py-4 border-b border-gray-800 relative">
          <span className="text-xl font-bold text-gold">SBM Forex</span>
          {/* Avatar Circle */}
          <div ref={avatarRef} className="relative">
            <button
              className="w-10 h-10 rounded-full bg-gold text-dark font-bold flex items-center justify-center text-xl focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Account menu"
            >
              {user.firstName.charAt(0).toUpperCase()}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-dark-lighter rounded shadow-lg border border-gray-700 z-50">
                <Link
                  to="/dashboard/account"
                  className="flex items-center gap-2 px-4 py-2 text-gray-900 hover:bg-gold/10 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" /> Account Setting
                </Link>
                <button
                  className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-600 hover:bg-gold/10 transition"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-10 bg-dark">
          {/* Header with Avatar for desktop */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gold">
              Pricing
            </h1>
            {/* Avatar Circle for desktop */}
            <div ref={avatarRef} className="hidden md:block relative">
              <button
                className="w-12 h-12 rounded-full bg-gold text-dark font-bold flex items-center justify-center text-2xl focus:outline-none"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Account menu"
              >
                {user.firstName.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-lighter rounded shadow-lg border border-gray-700 z-50">
                  <Link
                    to="/dashboard/account"
                    className="flex items-center gap-2 px-4 py-2 text-gray-900 hover:bg-gold/10 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" /> Account Setting
                  </Link>
                  <button
                    className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-600 hover:bg-gold/10 transition"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-400 mb-8">
            Choose Suitable Plan
            <br />
            <span className="text-sm text-gray-500">
              You can change your plan any time or auto renew by subscribing to
              the service again
            </span>
          </p>

          {/* Mentorship Package */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gold mb-4">
              Mentorship Package
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mentorshipPlans.map((plan) => (
                <div
                  key={plan.name}
                  className="card-glass p-6 flex flex-col items-center text-center"
                >
                  <h3 className="text-lg font-bold text-gold mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ${plan.price}
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    {plan.duration}
                  </div>
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setConsentOpen(true);
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Account Management Services */}
          {/* <section className="mb-10">
            <h2 className="text-xl font-bold text-gold mb-4">
              Account Management Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {accountManagementPlans.map((plan) => (
                <div
                  key={plan.name}
                  className="card-glass p-6 flex flex-col items-center text-center"
                >
                  <h3 className="text-lg font-bold text-gold mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ${plan.price}
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    {plan.duration}
                  </div>
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setConsentOpen(true);
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              ))}
            </div>
          </section> */}

          {/* Signal Provision Service */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gold mb-4">
              Signal Provision Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {signalPlans.map((plan) => (
                <div
                  key={plan.name}
                  className="card-glass p-6 flex flex-col items-center text-center"
                >
                  <h3 className="text-lg font-bold text-gold mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ${plan.price}
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    {plan.duration}
                  </div>
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setConsentOpen(true);
                    }}
                  >
                    Subscribe
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
        {/* Consent Modal */}
        <ConsentModal />
        {/* Footer */}
        <footer className="text-center text-gray-400 py-6 border-t border-gray-800 bg-dark-darker">
          © 2021–2025 SBM Forex Academy. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AuthServicesPage;
