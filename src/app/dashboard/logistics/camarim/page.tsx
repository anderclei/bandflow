import { Coffee } from "lucide-react"
import { getActiveBand } from "@/lib/getActiveBand"
import { prisma } from "@/lib/prisma"
import { CateringList } from "@/components/dashboard/logistics/CateringList"

export default async function CamarimLogisticsPage() {
    const { band } = await getActiveBand()

    const gigs = await prisma.gig.findMany({
        where: { bandId: band?.id },
        orderBy: { date: 'asc' },
        include: { cateringItems: true }
    })

    return (
        <div className="flex-1 space-y-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black font-heading tracking-tighter text-white uppercase flex items-center gap-4">
                        Camarim <span className="text-zinc-600">E CATERING</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                        CONTROLE DE SUPRIMENTOS PARA A OPERAÇÃO
                    </p>
                </div>
            </div>
            <CateringList gigs={gigs as any} />
        </div>
    )
}
