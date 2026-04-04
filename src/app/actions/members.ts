"use server";

import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import { membersRepository } from "@/lib/repositories/members";
import { CreateMemberSchema, UpdateMemberSchema, DeleteMemberSchema } from "./schemas";

/**
 * Creates or invites a new member to the band.
 * Enforces dynamic member limits based on subscription plan.
 */
export const createMember = createSafeAction(
  CreateMemberSchema,
  async (data, { bandId }) => {
    const limits = await membersRepository.getBandLimits(bandId);
    const maxMembers = limits?.maxMembers || 10;

    const currentCount = await membersRepository.count(bandId);
    if (currentCount >= maxMembers) {
      throw new Error(`Limite atingido: Seu plano permite apenas ${maxMembers} integrantes.`);
    }

    const member = await membersRepository.create(data, bandId);
    revalidatePath("/dashboard/members");
    return member;
  },
  {
    audit: {
      action: "CREATED",
      entity: "MEMBER",
      details: (data) => `Integrante "${data.name}" criado`
    },
    requiredRole: "ADMIN"
  }
);

/**
 * Updates a member's profile and roles.
 */
export const updateMember = createSafeAction(
  UpdateMemberSchema,
  async (data, { bandId }) => {
    const { id, ...updateData } = data;
    
    const existing = await membersRepository.findById(id, bandId);
    if (!existing) throw new Error("Acesso negado: Integrante não encontrado ou sem permissão.");

    const member = await membersRepository.update(id, updateData);
    revalidatePath("/dashboard/members");
    return member;
  },
  {
    requiredRole: "ADMIN"
  }
);

/**
 * Removes a member from the band.
 */
export const deleteMember = createSafeAction(
  DeleteMemberSchema,
  async ({ id }, { bandId }) => {
    const existing = await membersRepository.findById(id, bandId);
    if (!existing) throw new Error("Acesso negado: Integrante não encontrado ou sem permissão.");

    await membersRepository.delete(id);
    revalidatePath("/dashboard/members");
    return { success: true };
  },
  {
    audit: {
      action: "DELETED",
      entity: "MEMBER",
      details: (_, result: any) => `Integrante removido`
    },
    requiredRole: "ADMIN"
  }
);
