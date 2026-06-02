import React from "react";

function SectionShell({ title, actions, children, className = "" }) {
  return (
    <div className={`bg-white border border-[#d8e4ef] rounded-xl p-6 mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#2e4358]">{title}</h2>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export default SectionShell;
