import { getActiveBand } from "@/lib/getActiveBand";
import { redirect } from "next/navigation";
import { POSClient } from "./POSClient";

export default async function POSPage() {
    // For the POS, we only need items that have stock > 0
    const { band } = await getActiveBand({
        merchItems: {
            where: { stock: { gt: 0 } },
            orderBy: { category: 'asc' }
        },
        gigs: {
            where: { date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }, // Only today or future gigs
            orderBy: { date: 'asc' },
            take: 5
        }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const items = (band.merchItems as any[]) || [];
    const recentGigs = (band.gigs as any[]) || [];

    return (
        <div className="h-[calc(100vh-8rem)]">
            <POSClient items={items} gigs={recentGigs} bandId={band.id} />
        </div>
    );
}
