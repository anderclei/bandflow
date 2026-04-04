"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createDocument(bandId: string, fileUrl: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const expiryDateStr = formData.get("expiryDate") as string;
    const memberId = formData.get("memberId") as string;

    if (!title || !category || !fileUrl) {
        throw new Error("Missing required fields");
    }

    // Storage Governance Check
    const band = await prisma.band.findUnique({ where: { id: bandId } }) as any;
    if (band) {
        const maxStorageGB = band.maxStorageGB || 5;
        // In a real world we would track actual S3/Supabase bytes used, 
        // For simplicity we will track an arbitrary limit of documents or simulate the logic
        const docsCount = await prisma.document.count({ where: { bandId } });
        // Assume 50MB per file average for the sake of the limit warning
        const currentSimulatedGB = docsCount * 0.05; 
        
        if (currentSimulatedGB >= maxStorageGB) {
            throw new Error(`Limite atingido: O seu plano atual permite apenas ${maxStorageGB}GB de espaço. Faça um upgrade ou contate o suporte.`);
        }
    }

    await prisma.document.create({
        data: {
            title,
            category,
            fileUrl,
            bandId,
            expiryDate: expiryDateStr ? new Date(expiryDateStr) : null,
            memberId: memberId || null,
        }
    });

    revalidatePath("/dashboard/documents");
    return { success: true };
}

export async function deleteDocument(documentId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.document.delete({
        where: { id: documentId }
    });

    revalidatePath("/dashboard/documents");
}
