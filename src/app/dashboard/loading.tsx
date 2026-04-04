export default function DashboardLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                    <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                    <div className="h-4 w-96 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1 h-[600px] bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800"></div>
                <div className="lg:col-span-2 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
