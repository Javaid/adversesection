import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTenant } from "../../tenant/TenantProvider";

const navItems = [
    {
        label: "Dashboard",
        to: "/dashboard",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        label: "Providers",
        to: "/providers",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: "Reports",
        to: "/reports",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        label: "Projects",
        to: "/projects",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
        ),
    },
    {
        label: "Resources",
        to: "/resources",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: "Settings",
        to: "/settings",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { tenant } = useTenant();

    return (
        <aside
            className={`tenant-card border-r tenant-border flex flex-col shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-64"
                }`}
        >
            <div className="h-4 border-b tenant-border"></div>

            {/* Nav */}
            <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? "tenant-nav-active"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`
                        }
                    >
                        {item.icon}
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Executive snapshot */}
            {!collapsed && (
                <div className="mx-3 mb-3 p-3 tenant-card-muted rounded-xl border tenant-border">
                    <p className="text-xs font-semibold tenant-text mb-1">{tenant.displayName}</p>
                    <p className="text-xs tenant-text-muted leading-relaxed">
                        {tenant.tagline}. Plan: {tenant.plan}.
                    </p>
                </div>
            )}

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center gap-2 px-4 py-3 border-t tenant-border text-xs tenant-text-muted hover:text-slate-800 hover:bg-slate-50 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {!collapsed && <span>Collapse</span>}
            </button>
        </aside>
    );
};

export default Sidebar;
