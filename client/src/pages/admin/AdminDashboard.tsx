import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/user";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Fetch admin profile
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAdmin(data))
      .catch(() => navigate("/admin/login"));

    // Fetch all users
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setUsers([]));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to update password.");
      } else {
        setMessage("✅ Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err) {
      setMessage("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your platform with powerful tools</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-gray-900 px-6 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6">
          {/* Change Password Form */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Change Password
          </h2>
          <p className="text-gray-400 mt-1 text-sm">Update your account password securely</p>
        </div>
        <div className="p-6 bg-gray-50">
          {message && (
            <div className={`mb-4 p-3 rounded-md text-sm ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label
                className="block text-gray-400 text-sm font-medium mb-2"
                htmlFor="currentPassword"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent focus:ring-offset-2 transition-all duration-200"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label
                className="block text-gray-400 text-sm font-medium mb-2"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent focus:ring-offset-2 transition-all duration-200"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-gold text-gray-900 font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50 shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* User Table */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            All Users
          </h2>
          <p className="text-gray-400 mt-1 text-sm">Manage all registered users on the platform</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">First Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Last Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span className="text-lg font-medium text-gray-700">No users found</span>
                      <span className="text-sm text-gray-500 mt-1">There are currently no registered users</span>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u, index) => (
                  <tr 
                    key={u._id} 
                    className={`transition-all duration-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-gold to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {u.firstName.charAt(0)}{u.lastName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{u.firstName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{u.lastName}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {u.email}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
