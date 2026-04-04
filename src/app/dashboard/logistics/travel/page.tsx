import { Plane } from "lucide-react"
import { getActiveBand } from "@/lib/getActiveBand"
import { prisma } from "@/lib/prisma"
import { FlightList } from "@/components/dashboard/logistics/FlightList"

export default async function TravelLogisticsPage() {
    const { band } = await getActiveBand()

    const tripsWithFlights = await prisma.trip.findMany({
        where: { bandId: band?.id },
        orderBy: { createdAt: 'desc' },
        include: { flights: true }
    })

    return (
        <div className="flex-1 space-y-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black font-heading tracking-tighter text-white uppercase flex items-center gap-4">
                        LOGÍSTICA <span className="text-zinc-600">AÉREA</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        GESTÃO DE BILHETES E HORÁRIOS DE EMBARQUE
                    </p>
                </div>
            </div>
            <FlightList trips={tripsWithFlights as any} />
        </div>
    )
}
