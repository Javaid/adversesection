const StatCard = ({ label, value, badge, badgeColor, desc, icon, iconBg }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-700 leading-5">{label}</p>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${badgeColor}`}>
                            {badge}
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 mt-1 leading-none">{value}</p>
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 leading-5">{desc}</p>
        </div>
    );
};

export default StatCard;
