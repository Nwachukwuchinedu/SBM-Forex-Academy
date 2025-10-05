import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DollarSign, User, Settings, LogOut } from "lucide-react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// paymentHistory table is currently not rendered

const DashboardPage = () => {
  const [user, setUser] = useState<{ firstName: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    document.title = "Dashboard - SBM Forex Academy";
  }, [navigate]);

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
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg py-8 px-4">
        <div className="mb-10">
          <span className="text-2xl font-bold text-gold">SBM Forex</span>
        </div>
        <nav className="flex flex-col gap-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded text-gold font-semibold bg-gray-50"
          >
            <User className="h-5 w-5" /> Dashboard
          </Link>
          <Link
            to="/dashboard/service"
            className="flex items-center gap-3 px-3 py-2 rounded text-gray-600 hover:text-gold hover:bg-gray-50 transition"
          >
            <DollarSign className="h-5 w-5" /> Services
          </Link>
          <Link
            to="/dashboard/account"
            className="flex items-center gap-3 px-3 py-2 rounded text-gray-600 hover:text-gold hover:bg-gray-50 transition"
          >
            <Settings className="h-5 w-5" /> Account Setting
          </Link>
        </nav>
        <div className="mt-auto pt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Responsive Navbar */}
        <header className="md:hidden flex items-center justify-between bg-white px-4 py-4 shadow-sm relative">
          <div className="flex items-center gap-3">
            <button aria-label="Open menu" onClick={() => setMobileNavOpen(true)} className="p-2 text-gray-900">
              <Menu />
            </button>
            <span className="text-xl font-bold text-gold">SBM Forex</span>
          </div>
          {/* Avatar Circle */}
          <div ref={avatarRef} className="relative">
            <button
              className="w-10 h-10 rounded-full bg-gold text-white font-bold flex items-center justify-center text-xl focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Account menu"
            >
              {user.firstName.charAt(0).toUpperCase()}
            </button>
            {menuOpen && (
              <div
              className="absolute right-0 mt-2 w-44 bg-white rounded shadow-lg z-50"
                // Do NOT add onClick or onMouseDown here!
              >
                <Link
                  to="/dashboard/account"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                  }}
                >
                  <Settings className="h-4 w-4" /> Account Setting
                </Link>
                <button
                  className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 transition"
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
        </header>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-50 bg-black/30"
            >
              <motion.div
                ref={drawerRef}
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "tween", duration: 0.25 }}
                className="absolute left-0 top-0 h-full w-72 max-w-[85%] bg-white shadow-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold text-gold">SBM Forex</span>
                  <button aria-label="Close menu" onClick={() => setMobileNavOpen(false)}>
                    <X />
                  </button>
                </div>
                <nav className="space-y-2">
                  <Link to="/dashboard" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2 rounded text-gray-700 hover:text-gold hover:bg-gray-50">Dashboard</Link>
                  <Link to="/dashboard/service" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2 rounded text-gray-700 hover:text-gold hover:bg-gray-50">Services</Link>
                  <Link to="/dashboard/account" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2 rounded text-gray-700 hover:text-gold hover:bg-gray-50">Account Setting</Link>
                  <button onClick={() => { setMobileNavOpen(false); handleLogout(); }} className="block w-full text-left px-3 py-2 rounded text-red-600 hover:bg-red-50">Logout</button>
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 md:p-10 bg-dark">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gold">
              Welcome, {user.firstName}
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
                <div className="absolute right-0 mt-2 w-48 bg-dark-lighter rounded shadow-lg z-50">
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

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="card-glass p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <User className="h-6 w-6 text-gold" />
                  <span className="font-semibold text-lg text-gray-900">Personal Info</span>
                </div>
                <p className="text-gray-400 mb-4">Edit your username and update your password on our user system.</p>
              </div>
              <Link to="/dashboard/account" className="btn btn-primary w-full">Manage Your Account</Link>
            </div>

            <div className="card-glass p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-6 w-6 text-gold" />
                  <span className="font-semibold text-lg text-gray-900">Pricing</span>
                </div>
                <p className="text-gray-400 mb-4">View our services and pricing for each service.</p>
              </div>
              <Link to="/dashboard/service" className="btn btn-primary w-full">Services</Link>
            </div>
          </div>

          {/* Payment History Section */}
          {/* <div className="bg-dark-lighter rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gold">Payment History</h2>
              <Link
                to="/dashboard/history"
                className="text-gold hover:underline font-medium"
              >
                See All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-700 border-b border-gray-700">
                    <th className="py-2 px-4 font-semibold">ORDER ID</th>
                    <th className="py-2 px-4 font-semibold">ISSUE DATE</th>
                    <th className="py-2 px-4 font-semibold">AMOUNT</th>
                    <th className="py-2 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((row) => (
                    <tr key={row.id} className="border-b border-gray-800">
                      <td className="py-2 px-4">{row.id}</td>
                      <td className="py-2 px-4">{row.date}</td>
                      <td className="py-2 px-4">{row.amount}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            row.status === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-400 py-6 bg-dark-darker shadow-inner">
          © 2021–2025 SBM Forex Academy. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;
