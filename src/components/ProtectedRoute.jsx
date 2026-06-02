import { Navigate } from 'react-router-dom';
import { getTenantStorageKey } from '../services/runtimeConfig';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem(getTenantStorageKey('token'));

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
