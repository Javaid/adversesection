import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";

const Layout = () => {
    return (
        <div className="flex flex-col h-screen overflow-hidden tenant-shell">
            {/* Top header — full width */}
            <Header />

            {/* Body: sidebar + main content */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                {/* Main content area */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default Layout;
