import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import ServicesPage from "./pages/Services";
import FAQPage from "./pages/FAQ";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import ScrollToTop from "./utils/ScrollToTop";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./utils/ProtectedRoute";
import DashboardPage from "./pages/auth/Dashboard";
import AuthServicesPage from "./pages/auth/Services";
import ServicePlanPage from "./components/auth/ServicePlanPage";
import AccountSettingPage from "./pages/auth/AccountSetting";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VerifyEmail from "./pages/VerifyEmail";
import OrganizationSchema from "./components/seo/OrganizationSchema";

function AppContent() {
  const location = useLocation();
  // List of routes where you want to hide Header and Footer
  const hideLayout =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-montserrat">
      <OrganizationSchema />
      {!hideLayout && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/service"
            element={
              <ProtectedRoute>
                <AuthServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/service/:planId"
            element={
              <ProtectedRoute>
                <ServicePlanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/account"
            element={
              <ProtectedRoute>
                <AccountSettingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
        <Toaster position="top-center" />
      </Router>
    </HelmetProvider>
  );
}

export default App;
