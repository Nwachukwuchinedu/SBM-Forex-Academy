import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuth(!!token);
  }, []);

  if (isAuth === null) return null; // or a loader

  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
