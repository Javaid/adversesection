import { Navigate, Outlet } from "react-router-dom";

// Optional: you can pass allowedRoles if you want role-based routes
const PrivateRoutes = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }


  // Token exists → allow access
  return <Outlet />;
};

export default PrivateRoutes;
