import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DollarSign, User, Settings, LogOut } from "lucide-react";

const AccountSettingPage = () => {
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch user info
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
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
      } catch {
        navigate("/login");
      }
    };
    fetchUser();
    document.title = "Account Setting - SBM Forex Academy";
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

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
        setUser((prev) => (prev ? { ...prev, ...form } : prev));
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/update-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update password");
      } else {
        toast.success("Password updated successfully");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
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
          <Link
            to="/dashboard/service"
            className="flex items-center gap-3 text-gray-400 hover:text-gold transition"
          >
            <DollarSign className="h-5 w-5" /> Services
          </Link>
          <Link
            to="/dashboard/account"
            className="flex items-center gap-3 text-gold font-semibold"
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

        {/* Avatar for desktop */}
        <div className="hidden md:flex justify-end items-center px-10 pt-8">
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
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <main className="flex-1 flex flex-col items-center bg-dark py-10">
          <div className="card-glass p-8 w-full max-w-xl">
            <h1 className="text-2xl font-bold text-gold mb-6">
              Account Setting
            </h1>
            <form onSubmit={handleProfileUpdate} className="space-y-4 mb-8">
              <div>
                <label className="block text-gray-400 mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-300 border border-gray-00 rounded-md py-2 px-3 text-gray-500 cursor-not-allowed opacity-60"
                  value={form.email}
                  readOnly
                  disabled
                  tabIndex={-1}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>

            <hr className="my-6 border-gray-700" />

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <h2 className="text-lg font-semibold text-gold mb-2">
                Change Password
              </h2>
              <div>
                <label className="block text-gray-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full bg-dark-lighter border border-gray-700 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-400 py-6 border-t border-gray-800 bg-dark-darker">
          © 2021–2025 SBM Forex Academy. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AccountSettingPage;
