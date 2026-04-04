"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSafeAction } from "@/lib/safe-action";
import { bandsRepository } from "@/lib/repositories/bands";
import { UpdateBandSchema } from "./schemas";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * Creates a new band and assigns the user as ADMIN.
 */
export const createBand = createSafeAction(
  z.object({ name: z.string().min(1), description: z.string().optional() }),
  async (data, { userId }) => {
    // Check global user license first
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { memberships: { where: { role: "ADMIN" } } }
    });

    if (!user) throw new Error("Usuário não encontrado.");
    if (user.licenseStatus === "BLOCKED") throw new Error("Sua licença está bloqueada.");
    if (user.memberships.length >= user.maxBands) {
      throw new Error(`Limite de bandas atingido. Seu plano permite ${user.maxBands} banda(s).`);
    }

    const slug = bandsRepository.generateSlug(data.name);

    const band = await bandsRepository.create({
      ...data,
      slug,
      members: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    });

    const cookieStore = await cookies();
    cookieStore.set("activeBandId", band.id);

    revalidatePath("/dashboard");
    redirect("/dashboard");
  }
);

/**
 * Updates band settings with strict admin role verification.
 */
export const updateBand = createSafeAction(
  UpdateBandSchema,
  async (data, { bandId }) => {
    await bandsRepository.update(bandId, data);

    revalidatePath("/dashboard/settings");
    revalidatePath("/super-admin/tenants");
    revalidatePath(`/band/[slug]`, 'page');

    return { success: true };
  },
  {
    requiredRole: "ADMIN",
    audit: {
      action: "UPDATED",
      entity: "BAND",
      details: (data) => `Identidade da banda "${data.name}" atualizada.`
    }
  }
);

/**
 * Switches the active band context.
 */
export async function switchBand(bandId: string) {
    const cookieStore = await cookies();
    cookieStore.set("activeBandId", bandId);
    revalidatePath("/dashboard");
}

/**
 * Updates EPK specific data.
 */
export async function updateEpkData(bandId: string, data: any) {
  await bandsRepository.update(bandId, data);
  revalidatePath(`/epk/${bandId}`);
  revalidatePath(`/dashboard/epk`);
  return { success: true };
}
