const Footer = () => {
    return (
        <footer className="h-9 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0">
            <span className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Adverse Section. All rights reserved. Internal use only.
            </span>
            <span className="text-xs text-slate-400">v1.0.0</span>
        </footer>
    );
};

export default Footer;
