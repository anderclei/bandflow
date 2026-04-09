import { StagePlotEditor } from "@/components/dashboard/StagePlotEditor"
import { Card, CardContent } from "@/components/ui/card"
import { getActiveBand } from "@/lib/getActiveBand"
import { prisma } from "@/lib/prisma"
import { createDefaultShowFormat } from "@/app/actions/show-formats"

export default async function StagePlotPage() {
    const { band } = await getActiveBand({
        formats: true
    })

    if (!band) return null

    // Ensure at least one format exists
    let formats = (band as any).formats || []
    if (formats.length === 0) {
        const result = await createDefaultShowFormat(band.id)
        if (result.success && result.format) {
            formats = [result.format]
        }
    }

    const currentFormat = formats[0]
    const initialItems = currentFormat.stagePlot ? JSON.parse(currentFormat.stagePlot) : []

    let libraryAssets: any[] = [];
    try {
        const assets = await prisma.stageAssetDefinition.findMany({
            orderBy: { category: "asc" },
        });
        // Serialize Dates for Client Component
        libraryAssets = assets.map(a => ({
            ...a,
            createdAt: a.createdAt.toISOString(),
            updatedAt: a.updatedAt.toISOString(),
        }));
    } catch (e) {
        console.error("Erro ao carregar biblioteca:", e);
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mapa de Palco</h2>
                    <p className="text-sm text-muted-foreground">Editando: {currentFormat.name}</p>
                </div>
            </div>

            <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                    <StagePlotEditor
                        bandId={band.id}
                        formatId={currentFormat.id}
                        initialData={initialItems}
                        libraryAssets={libraryAssets}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
