"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createFollower(bandId: string, formData: FormData) {
    const email = formData.get("email") as string;

    if (!email || !bandId) return { error: "Dados inválidos." };

    try {
        await prisma.follower.create({
            data: {
                email,
                bandId
            }
        });

        // Retorna sucesso para o client component exibir a mensagem
        return { success: true };
    } catch (e: any) {
        // Se já existe, apenas ignore e finja sucesso (ou mostre mensagem específica)
        if (e.code === 'P2002') {
            return { success: true, message: "Você já está na lista!" };
        }
        return { error: "Erro ao se inscrever." };
    }
}
