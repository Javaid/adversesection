import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTenant } from "../tenant/TenantProvider";
import { getTenantFromSubdomain } from "../services/runtimeConfig";

const Login = () => {
    const { isAuthenticated, loading, error, handleLogin } = useAuth();
    const { tenant } = useTenant();
    const subdomainTenant = getTenantFromSubdomain();
    const currentTenant = subdomainTenant !== "default" ? subdomainTenant : tenant.slug || "default";
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    function onSubmit(event) {
        event.preventDefault();
        // Pass subdomain tenant to login handler
        handleLogin(username, password, currentTenant);
    }

    return (
        <div className="min-h-screen tenant-shell flex">

            {/* Left panel — branding */}
            <div className="hidden lg:flex lg:w-1/2 tenant-brand-panel flex-col justify-between p-12">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm leading-tight">{tenant.displayName}</p>
                        <p className="text-xs text-white/75 leading-tight">{tenant.tagline}</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-4xl font-bold text-white leading-snug mb-4">
                        {tenant.loginHero.headline.split(" ").slice(0, 2).join(" ")}<br />
                        {tenant.loginHero.headline.split(" ").slice(2, 5).join(" ")}<br />
                        {tenant.loginHero.headline.split(" ").slice(5).join(" ")}
                    </h2>
                    <p className="text-white/75 text-sm leading-relaxed max-w-sm">
                        {tenant.loginHero.description}
                    </p>
                </div>

                <div className="flex gap-4">
                    {[`${tenant.plan} plan`, tenant.tagline, `${tenant.shortName} workspace`].map((stat) => (
                        <div key={stat} className="bg-white/10 rounded-xl px-4 py-3 text-center">
                            <p className="text-white text-xs font-medium">{stat}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 rounded-lg tenant-avatar flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="font-bold tenant-text text-sm">{tenant.displayName}</p>
                    </div>

                    <h1 className="text-2xl font-bold tenant-text mb-1">Welcome back</h1>
                    <p className="text-sm tenant-text-muted mb-8">Sign in to {tenant.displayName}</p>

                    {error && (
                        <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="e.g. admin"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm rounded-lg tenant-input"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <button type="button" className="text-xs text-sky-600 hover:text-sky-800 font-medium transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm rounded-lg tenant-input"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 tenant-primary-button disabled:opacity-60 text-sm font-semibold rounded-lg flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-xs text-center tenant-text-muted">
                        Demo credentials: <span className="font-medium tenant-text">admin / admin</span>
                    </p>

                </div>
            </div>

        </div>
    );
};

export default Login;
