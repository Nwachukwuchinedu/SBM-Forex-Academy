import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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

function AppContent() {
  const location = useLocation();
  // List of routes where you want to hide Header and Footer
  const hideLayout = location.pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-montserrat">
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
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
      <Toaster position="top-center" />
    </Router>
  );
}

export default App;
