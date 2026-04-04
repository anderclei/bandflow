"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateShowFormatTechnical(
    formatId: string,
    data: { stagePlot?: string; inputList?: string; techSpecs?: string }
) {
    try {
        await prisma.showFormat.update({
            where: { id: formatId },
            data: data
        })
        revalidatePath("/dashboard/rider")
        revalidatePath("/dashboard/rider/stage-plot")
        revalidatePath(`/dashboard/settings/formats/${formatId}`)
        return { success: true }
    } catch (error) {
        console.error("Error updating technical data:", error)
        return { success: false, error: "Falha ao salvar os dados técnicos" }
    }
}

export async function createDefaultShowFormat(bandId: string, name: string = "Layout Padrão") {
    try {
        const format = await prisma.showFormat.create({
            data: {
                name,
                bandId,
                stagePlot: "[]"
            }
        })
        return { success: true, format }
    } catch (error) {
        console.error("Error creating default format:", error)
        return { success: false, error: "Falha ao criar formato padrão" }
    }
}
