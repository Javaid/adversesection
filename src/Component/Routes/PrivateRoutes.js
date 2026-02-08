import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  // not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

 

  return <Outlet />;
};

export default PrivateRoutes;
