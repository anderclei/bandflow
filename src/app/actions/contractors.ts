"use server"

import { prisma as db } from "@/lib/prisma"
import { getActiveBand } from "@/lib/getActiveBand"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const contractorSchema = z.object({
    type: z.enum(["PF", "PJ"]).default("PF"),
    name: z.string().min(1, "Nome é obrigatório"),
    document: z.string().optional().nullable(),
    rg: z.string().optional().nullable(),
    issuingBody: z.string().optional().nullable(),
    nationality: z.string().optional().nullable(),
    maritalStatus: z.string().optional().nullable(),
    profession: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    addressNumber: z.string().optional().nullable(),
    addressComplement: z.string().optional().nullable(),
    neighborhood: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    repName: z.string().optional().nullable(),
    repNationality: z.string().optional().nullable(),
    repMaritalStatus: z.string().optional().nullable(),
    repProfession: z.string().optional().nullable(),
    repRg: z.string().optional().nullable(),
    repCpf: z.string().optional().nullable(),
    email: z.string().email("E-mail inválido").optional().nullable().or(z.literal('')),
    phone: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    status: z.string().default("LEAD"),
})

export async function getContractors() {
    try {
        const { activeBandId: bandId } = await getActiveBand()
        if (!bandId) {
            return { success: false, error: "Nenhuma banda selecionada" }
        }

        const contractors = await db.contractor.findMany({
            where: { bandId },
            orderBy: { name: "asc" }
        })

        return { success: true, data: contractors }
    } catch (error) {
        console.error("Erro ao buscar contratantes:", error)
        return { success: false, error: "Erro interno ao buscar contratantes" }
    }
}

function extractFormData(formData: FormData) {
    return {
        type: formData.get("type") as "PF" | "PJ" || "PF",
        name: formData.get("name") as string,
        document: formData.get("document") as string || null,
        rg: formData.get("rg") as string || null,
        issuingBody: formData.get("issuingBody") as string || null,
        nationality: formData.get("nationality") as string || null,
        maritalStatus: formData.get("maritalStatus") as string || null,
        profession: formData.get("profession") as string || null,
        zipCode: formData.get("zipCode") as string || null,
        address: formData.get("address") as string || null,
        addressNumber: formData.get("addressNumber") as string || null,
        addressComplement: formData.get("addressComplement") as string || null,
        neighborhood: formData.get("neighborhood") as string || null,
        city: formData.get("city") as string || null,
        state: formData.get("state") as string || null,
        repName: formData.get("repName") as string || null,
        repNationality: formData.get("repNationality") as string || null,
        repMaritalStatus: formData.get("repMaritalStatus") as string || null,
        repProfession: formData.get("repProfession") as string || null,
        repRg: formData.get("repRg") as string || null,
        repCpf: formData.get("repCpf") as string || null,
        email: formData.get("email") as string || null,
        phone: formData.get("phone") as string || null,
        notes: formData.get("notes") as string || null,
        status: formData.get("status") as string || "LEAD",
    }
}

export async function createContractor(formData: FormData) {
    try {
        const { activeBandId: bandId } = await getActiveBand()
        if (!bandId) {
            return { success: false, error: "Nenhuma banda selecionada" }
        }

        const data = extractFormData(formData)

        const result = contractorSchema.safeParse(data)
        if (!result.success) {
            return { success: false, error: (result.error as any).errors[0].message }
        }

        const contractor = await db.contractor.create({
            data: {
                ...result.data,
                bandId
            }
        })

        revalidatePath("/dashboard/contractors")
        revalidatePath("/dashboard/contracts")
        return { success: true, data: contractor }
    } catch (error) {
        console.error("Erro ao criar contratante:", error)
        return { success: false, error: "Erro interno ao criar contratante" }
    }
}

export async function updateContractor(id: string, formData: FormData) {
    try {
        const { activeBandId: bandId } = await getActiveBand()
        if (!bandId) {
            return { success: false, error: "Nenhuma banda selecionada" }
        }

        const existing = await db.contractor.findUnique({ where: { id } })
        if (!existing || existing.bandId !== bandId) {
            return { success: false, error: "Contratante não encontrado ou sem permissão" }
        }

        const data = extractFormData(formData)

        const result = contractorSchema.safeParse(data)
        if (!result.success) {
            return { success: false, error: (result.error as any).errors[0].message }
        }

        const contractor = await db.contractor.update({
            where: { id },
            data: result.data
        })

        revalidatePath("/dashboard/contractors")
        revalidatePath("/dashboard/contracts")
        return { success: true, data: contractor }
    } catch (error) {
        console.error("Erro ao atualizar contratante:", error)
        return { success: false, error: "Erro interno ao atualizar contratante" }
    }
}

export async function deleteContractor(id: string) {
    try {
        const { activeBandId: bandId } = await getActiveBand()
        if (!bandId) {
            return { success: false, error: "Nenhuma banda/escritório ativo selecionado" }
        }

        // Verify ownership
        const existing = await db.contractor.findUnique({ where: { id } })
        if (!existing || existing.bandId !== bandId) {
            return { success: false, error: "Contratante não encontrado ou sem permissão" }
        }

        await db.contractor.delete({
            where: { id }
        })

        revalidatePath("/dashboard/contractors")
        revalidatePath("/dashboard/contracts")
        return { success: true }
    } catch (error) {
        console.error("Erro ao excluir contratante:", error)
        return { success: false, error: "Erro interno ao excluir contratante. Ele pode estar atrelado a algum evento ou contrato." }
    }
}

export async function updateContractorStatus(id: string, status: string) {
    try {
        const { activeBandId: bandId } = await getActiveBand()
        if (!bandId) return { success: false, error: "Não autorizado" }

        // Primeiro verificamos se o contratante pertence à banda
        const existing = await db.contractor.findFirst({
            where: { id, bandId }
        })
        if (!existing) return { success: false, error: "Contratante não encontrado" }

        await db.contractor.update({
            where: { id },
            data: { status }
        })

        revalidatePath("/dashboard/contractors")
        return { success: true }
    } catch (error) {
        console.error("Erro ao atualizar status:", error)
        return { success: false, error: "Erro ao atualizar status" }
    }
}
