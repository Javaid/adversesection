import { Navigate, Outlet } from "react-router-dom";
import { getRole, isLoggedIn } from "../../utils/auth";

const PrivateRoutes = ({ allowedRoles }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const role = getRole();
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoutes;
