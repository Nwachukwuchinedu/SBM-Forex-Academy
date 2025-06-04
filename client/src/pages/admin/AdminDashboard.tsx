import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
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

  const handleChangePassword = async (e) => {
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
    <div className="min-h-screen bg-dark p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gold">Admin Dashboard</h1>
        <button className="btn btn-outline" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Change Password Form */}
      <div className="mb-12 p-6 bg-dark-lighter rounded shadow max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gold">
          Change Password
        </h2>
        {message && <p className="mb-4 text-sm text-yellow-500">{message}</p>}
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm mb-2"
              htmlFor="currentPassword"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm mb-2"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gold hover:bg-gold-dark text-dark px-4 py-2 rounded font-semibold transition"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* User Table */}
      <h2 className="text-xl font-semibold mb-4 text-gold">All Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-dark-lighter rounded shadow">
          <thead>
            <tr className="text-gold border-b border-gray-700">
              <th className="py-2 px-4">First Name</th>
              <th className="py-2 px-4">Last Name</th>
              <th className="py-2 px-4">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-800">
                <td className="py-2 px-4 text-gray-500">{u.firstName}</td>
                <td className="py-2 px-4 text-gray-500">{u.lastName}</td>
                <td className="py-2 px-4 text-gray-500">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
