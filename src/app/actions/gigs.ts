"use server";

import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import { gigsRepository } from "@/lib/repositories/gigs";
import { 
  CreateGigSchema, 
  UpdateGigSchema, 
  CreateGigTaskSchema, 
  ToggleGigTaskSchema, 
  DeleteGigTaskSchema 
} from "./schemas";
import { z } from "zod";

/**
 * Creates a new Gig with multi-tenancy and plan restrictions.
 */
export const createGig = createSafeAction(
  CreateGigSchema,
  async (data, { bandId, plan }) => {
    // 1. Plan Governance: Limit of Gigs for Essential Plan
    if (plan === "ESSENTIAL") {
      const gigCount = await gigsRepository.count(bandId);
      if (gigCount >= 5) {
        throw new Error("Limite atingido: O plano Essential permite apenas 5 shows. Faça upgrade para o PRO!");
      }
    }

    const gig = await gigsRepository.create({
      ...data,
      bandId,
    });

    revalidatePath("/dashboard/gigs");
    revalidatePath("/dashboard");

    return gig;
  },
  {
    audit: {
      action: "CREATED",
      entity: "GIG",
      details: (data) => `Show "${data.title}" criado`
    }
  }
);

/**
 * Updates an existing Gig ensuring tenant isolation.
 */
export const updateGig = createSafeAction(
  UpdateGigSchema,
  async (data, { bandId }) => {
    const { id, ...updateData } = data;
    
    const existingGig = await gigsRepository.findById(id, bandId);
    if (!existingGig) throw new Error("Unauthorized: Show não pertence à banda ativa.");

    await gigsRepository.update(id, updateData);

    revalidatePath("/dashboard/gigs");
    revalidatePath(`/dashboard/gigs/${id}`);
    revalidatePath("/dashboard");

    return { id };
  }
);

/**
 * Deletes a Gig with proper authentication.
 */
export const deleteGig = createSafeAction(
  z.object({ id: z.string() }),
  async ({ id }, { bandId }) => {
    const existingGig = await gigsRepository.findById(id, bandId);
    if (!existingGig) throw new Error("Unauthorized");

    await gigsRepository.delete(id);

    revalidatePath("/dashboard/gigs");
    revalidatePath("/dashboard");

    return { id };
  },
  {
    audit: {
      action: "DELETED",
      entity: "GIG",
      details: () => `Show removido`
    }
  }
);

/**
 * Creates a task for a Gig.
 */
export const createGigTask = createSafeAction(
  CreateGigTaskSchema,
  async ({ gigId, description }, { bandId }) => {
    const gig = await gigsRepository.findById(gigId, bandId);
    if (!gig) throw new Error("Unauthorized");

    await gigsRepository.createTask({ description, gigId });

    revalidatePath(`/dashboard/gigs/${gigId}`);
    return { success: true };
  }
);

/**
 * Toggles a Gig task status.
 */
export const toggleGigTask = createSafeAction(
  ToggleGigTaskSchema,
  async ({ taskId, isCompleted, gigId }, { bandId }) => {
    const gig = await gigsRepository.findById(gigId, bandId);
    if (!gig) throw new Error("Unauthorized");

    await gigsRepository.updateTask(taskId, { isCompleted });

    revalidatePath(`/dashboard/gigs/${gigId}`);
    return { success: true };
  }
);

/**
 * Deletes a Gig task.
 */
export const deleteGigTask = createSafeAction(
  DeleteGigTaskSchema,
  async ({ taskId, gigId }, { bandId }) => {
    const gig = await gigsRepository.findById(gigId, bandId);
    if (!gig) throw new Error("Unauthorized");

    await gigsRepository.deleteTask(taskId);

    revalidatePath(`/dashboard/gigs/${gigId}`);
    return { success: true };
  }
);
