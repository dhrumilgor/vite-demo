import { Navigate } from "react-router-dom";

interface ProtectedRoutesProps {
    children: React.ReactNode;
  }

const ProtectedRoutes = ({children}: ProtectedRoutesProps)  => {
  const isAuthenticated = localStorage.getItem("isLogin") === "true"; // Simulating authentication
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoutes;