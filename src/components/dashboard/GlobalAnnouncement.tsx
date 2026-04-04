import { getActiveAnnouncements } from "@/app/actions/announcements";
import { AlertCircle, CheckCircle2, Info, Navigation } from "lucide-react";

export async function GlobalAnnouncement() {
    const res = await getActiveAnnouncements();
    if (!res.success || !res.announcements || res.announcements.length === 0) {
        return null;
    }

    const current = res.announcements[0];

    const styles = {
        INFO: "bg-blue-500 text-white border-blue-600",
        WARNING: "bg-amber-500 text-amber-950 border-amber-600",
        SUCCESS: "bg-emerald-500 text-emerald-950 border-emerald-600",
        CRITICAL: "bg-red-600 text-white border-red-700"
    };

    const icons = {
        INFO: <Info className="w-4 h-4" />,
        WARNING: <AlertCircle className="w-4 h-4" />,
        SUCCESS: <CheckCircle2 className="w-4 h-4" />,
        CRITICAL: <AlertCircle className="w-4 h-4 animate-pulse" />
    };

    const typeKey = (current.type as keyof typeof styles) || "INFO";

    return (
        <div className={`w-full px-4 py-2 flex items-center justify-center gap-3 text-sm font-bold shadow-md z-50 ${styles[typeKey]}`}>
            {icons[typeKey]}
            <p className="flex-1 text-center sm:text-left">{current.message}</p>
        </div>
    );
}
