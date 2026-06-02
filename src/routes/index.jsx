import { Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardFallback from '../components/DashboardFallback';

const Login = lazy(() => import('../pages/login'));
const Dashboard = lazy(() => import('../pages/dashboard'));
const Layout = lazy(() => import('../components/layout/layout'));
const ProviderPage = lazy(() => import('../pages/Providers/providerPage'));
const AddProvider = lazy(() => import('../pages/AddProvider'));
const ProviderLayout = lazy(() => import('../components/layout/providerLayout.jsx'));
const Overview = lazy(() => import('../components/sections/Overview/overview'));
const Settings = lazy(() => import('../pages/Settings'));

function AppRoutes() {
    return (
        <Suspense fallback={<DashboardFallback />}>
            <Routes>
                {/* Simple routes - tenant detected from subdomain automatically */}
                <Route index element={<Navigate to="/login" replace />} />
                <Route path="login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="providers" element={<ProviderPage />} />
                    <Route path="add-provider" element={<AddProvider />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="provider/:id" element={<ProtectedRoute><ProviderLayout /></ProtectedRoute>}>
                    <Route index element={<Overview />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default AppRoutes;