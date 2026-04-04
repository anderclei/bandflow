import { Hotel } from "lucide-react"
import { getTrips } from "@/app/actions/trips"
import { getActiveBand } from "@/lib/getActiveBand"
import { RoomingList } from "@/components/dashboard/logistics/RoomingList"

export default async function HotelLogisticsPage() {
    const [trips, { band }] = await Promise.all([
        getTrips(),
        getActiveBand({ members: true })
    ]);
    const members = (band as any)?.members || [];

    return (
        <div className="flex-1 space-y-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black font-heading tracking-tighter text-white uppercase flex items-center gap-4">
                        HOSPEDAGEM <span className="text-zinc-600">DE EQUIPE</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        CONTROLE DE QUARTOS E DISTRIBUIÇÃO DA EQUIPE
                    </p>
                </div>
            </div>
            <RoomingList initialTrips={trips as any} members={members} />
        </div>
    )
}
