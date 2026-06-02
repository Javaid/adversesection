import { useAuth } from "../../hooks/useAuth";
import { useTenant } from "../../tenant/TenantProvider";

const Header = () => {
    const { handleLogout } = useAuth();
    const { tenant } = useTenant();

    return (
        <header className="h-14 tenant-card border-b tenant-border flex items-center justify-between px-6 shrink-0 gap-4">

            {/* Brand + search */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 shrink-0">
                    <div className="w-8 h-8 rounded-lg tenant-avatar flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div className="hidden sm:block leading-tight">
                        <p className="font-bold tenant-text text-sm leading-tight">{tenant.displayName}</p>
                        <p className="text-xs tenant-text-muted leading-tight">{tenant.tagline}</p>
                    </div>
                </div>

                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search cases, reports, or staff"
                            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg tenant-input"
                        />
                    </div>
                </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">

                {/* Notification bell */}
                <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full"></span>
                </button>

                {/* Dark mode toggle */}
                <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </button>

                {/* Divider */}
                <div className="w-px h-6 tenant-border border-l mx-1"></div>

                {/* User + logout */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full tenant-avatar flex items-center justify-center shrink-0">
                        <span className="text-white font-semibold text-xs">{tenant.shortName}</span>
                    </div>
                    <div className="hidden sm:block leading-tight">
                        <p className="text-sm font-semibold tenant-text">Admin</p>
                        <p className="text-xs tenant-text-muted">{tenant.displayName}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Sign out"
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>

            </div>
        </header>
    );
};

export default Header;
