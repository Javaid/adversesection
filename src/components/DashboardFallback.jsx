const SkeletonBlock = ({ className = "" }) => {
    return <div className={`yt-skeleton ${className}`}></div>;
};

const DashboardFallback = () => {
    return (
        <div className="space-y-6" aria-hidden="true">
            <div className="space-y-2">
                <SkeletonBlock className="h-8 w-44 rounded-lg" />
                <SkeletonBlock className="h-4 w-96 max-w-full rounded-md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                            <SkeletonBlock className="h-11 w-11 rounded-xl shrink-0" />
                            <div className="flex-1 space-y-2">
                                <SkeletonBlock className="h-3 w-24 rounded" />
                                <SkeletonBlock className="h-8 w-14 rounded" />
                            </div>
                            <SkeletonBlock className="h-5 w-14 rounded-full" />
                        </div>
                        <SkeletonBlock className="h-3 w-full rounded" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <SkeletonBlock className="h-4 w-40 rounded" />
                                <SkeletonBlock className="h-3 w-28 rounded" />
                            </div>
                            <SkeletonBlock className="h-6 w-24 rounded-md" />
                        </div>

                        <div className="grid grid-cols-8 gap-2 items-end h-36">
                            {Array.from({ length: 8 }).map((__, barIndex) => (
                                <SkeletonBlock
                                    key={barIndex}
                                    className={`w-full rounded-t-md ${barIndex % 2 === 0 ? "h-24" : "h-16"}`}
                                />
                            ))}
                        </div>

                        <div className="space-y-2">
                            {Array.from({ length: 4 }).map((__, rowIndex) => (
                                <SkeletonBlock key={rowIndex} className="h-2 w-full rounded-full" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardFallback;
