import React from "react";

function SectionShell({
    title,
    actions,
    children,
    className = "",
    titleClassName = "",
}) {
    return (
        <section
            className={`p-6 bg-[#f5f9fd] border border-[#d7e6f2] rounded-xl overflow-x-hidden shadow-sm mb-6 ${className}`}
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold text-[#1f3d55] ${titleClassName}`}>{title}</h2>
                {actions ? <div className="flex items-center gap-4">{actions}</div> : null}
            </div>
            {children}
        </section>
    );
}

export default SectionShell;