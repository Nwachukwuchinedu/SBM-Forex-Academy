import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { DollarSign, User, Settings, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TRON_ADDRESS = "TQh1bwxRLFoNdzhvKcYSqbUjmSXajwWApg"; // Update with your TRON address

const allPlans = [
  {
    name: "Standard Mentorship",
    id: "standard-mentorship",
    price: 210,
    duration: "1 MONTH",
  },
  {
    name: "VIP Mentorship Package",
    id: "vip-mentorship-package",
    price: 1000,
    duration: "1 MONTH",
  },
  {
    name: "Signal Provision Service",
    id: "signal-provision-service",
    price: 80,
    duration: "1 MONTH",
  },
];

const ServicePlanPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const plan = allPlans.find((p) => p.id === planId);

  const [tronRate, setTronRate] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<{ firstName: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch TRON/USD rate from CoinGecko
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.tron && data.tron.usd) {
          setTronRate(1 / data.tron.usd);
        }
      })
      .catch(() => setTronRate(null));
  }, []);

  // Fetch user info for avatar
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch {
        // ignore
      }
    };
    fetchUser();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
      if (
        mobileNavOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setMobileNavOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, mobileNavOpen]);

  function getTronPrice(price: number | string) {
    if (!tronRate) return "-";
    if (typeof price === "string" && price.includes("-")) {
      // Handle price ranges
      const [min, max] = price.split("-").map((p) => parseFloat(p.trim()));
      if (isNaN(min) || isNaN(max)) return "-";
      return `${(min * tronRate).toFixed(2)} - ${(max * tronRate).toFixed(
        2
      )} TRX`;
    }
    const num = typeof price === "number" ? price : parseFloat(price);
    if (isNaN(num)) return "-";
    return `${(num * tronRate).toFixed(2)} TRX`;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(TRON_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

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

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark">
        <h2 className="text-gold text-2xl font-bold mb-4">Plan Not Found</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard/service")}
        >
          Back to Services
        </button>
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
          <div className="flex items-center gap-3">
            <button aria-label="Open menu" onClick={() => setMobileNavOpen(true)} className="p-2 text-gray-900">
              <Menu />
            </button>
            <span className="text-xl font-bold text-gold">SBM Forex</span>
          </div>
          {/* Avatar Circle */}
          {user && (
            <div ref={avatarRef} className="relative">
              <button
                className="w-10 h-10 rounded-full bg-gold text-dark font-bold flex items-center justify-center text-xl focus:outline-none"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Account menu"
              >
                {user.firstName.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-dark-lighter rounded shadow-lg border border-gray-700 z-50"
                >
                  <Link
                    to="/dashboard/account"
                    className="flex items-center gap-2 px-4 py-2 text-gray-900 hover:bg-gold/10 transition"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                    }}
                  >
                    <Settings className="h-4 w-4" /> Account Setting
                  </Link>
                  <button
                    className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-600 hover:bg-gold/10 transition"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-50 bg-black/50"
            >
              <motion.div
                ref={drawerRef}
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "tween", duration: 0.25 }}
                className="absolute left-0 top-0 h-full w-72 max-w=[85%] bg-dark-darker border-r border-gray-800 shadow-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold text-gold">SBM Forex</span>
                  <button aria-label="Close menu" onClick={() => setMobileNavOpen(false)}>
                    <X />
                  </button>
                </div>
                <nav className="space-y-2">
                  <Link to="/dashboard" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2 rounded text-gray-400 hover:text-gold hover:bg-white/5">Dashboard</Link>
                  <Link to="/dashboard/service" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2 rounded text-gray-400 hover:text-gold hover:bg-white/5">Services</Link>
                  <Link to="/dashboard/account" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2 rounded text-gray-400 hover:text-gold hover:bg-white/5">Account Setting</Link>
                  <button onClick={() => { setMobileNavOpen(false); handleLogout(); }} className="block w-full text-left px-3 py-2 rounded text-red-600 hover:bg-white/5">Logout</button>
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar for desktop */}
        <div className="hidden md:flex justify-end items-center px-10 pt-8">
          {user && (
            <div ref={avatarRef} className="relative">
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
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center bg-grid-pattern">
          <div className="card-glass p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gold mb-2">{plan.name}</h1>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${plan.price}
            </div>
            <div className="text-lg font-semibold text-gray-400 mb-2">
              ≈ {tronRate ? getTronPrice(plan.price) : "Loading..."}
            </div>
            <div className="text-sm text-gray-400 mb-4">{plan.duration}</div>
            <h2 className="text-lg font-semibold text-gold mb-2">
              Payment Options
            </h2>
            <div className="mb-4">
              <div className="text-gray-400 mb-2">
                <span className="font-semibold">Bank Account:</span>
                <br />
                Account Name: SBM Forex Academy
                <br />
                Account Number: <span className="font-mono">1234567890</span>
                <br />
                Bank: Example Bank
              </div>
              <div className="text-gray-400 mb-2">
                <span className="font-semibold">TRON Wallet:</span>
                <br />
                <span className="font-mono select-all">{TRON_ADDRESS}</span>
                <button
                  className="ml-2 px-2 py-1 text-xs rounded bg-gold text-dark font-semibold hover:bg-amber-400 transition"
                  onClick={handleCopy}
                  type="button"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="text-gray-400 mt-4">
                <span className="font-semibold text-gold">
                  After payment, send proof of payment to WhatsApp:
                </span>
                <br />
                <a
                  href="https://wa.me/2349032085666"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline font-semibold"
                >
                  Click here to chat on WhatsApp
                </a>
              </div>
            </div>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/dashboard/service")}
            >
              Back to Services
            </button>
          </div>
          <footer className="text-center text-gray-400 py-6 border-t border-gray-800 bg-dark-darker w-full mt-8">
            © 2021–2025 SBM Forex Academy. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ServicePlanPage;
