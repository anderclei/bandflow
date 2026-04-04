"use server";

import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/safe-action";
import { inventoryRepository } from "@/lib/repositories/inventory";
import { CreateEquipmentSchema, DeleteEquipmentSchema } from "./schemas";
import { prisma } from "@/lib/prisma";

/**
 * Creates a new piece of equipment.
 * Automatically handles category, status and ownership.
 */
export const createEquipment = createSafeAction(
  CreateEquipmentSchema,
  async (data, { bandId }) => {
    const { formats, ownerId, ...itemData } = data;
    const formatsToConnect = formats?.map((id: string) => ({ id })) || [];

    const equipment = await prisma.equipment.create({
      data: {
        ...itemData,
        ownerId: ownerId === "band" ? null : ownerId,
        bandId,
        formats: {
          connect: formatsToConnect
        }
      }
    });

    revalidatePath("/dashboard/inventory");
    return equipment;
  },
  {
    audit: {
      action: "CREATED",
      entity: "EQUIPMENT",
      details: (data) => `Equipamento "${data.name}" adicionado ao inventário`
    }
  }
);

/**
 * Deletes an equipment ensuring tenant isolation.
 */
export const deleteEquipment = createSafeAction(
  DeleteEquipmentSchema,
  async ({ id }, { bandId }) => {
    const existing = await inventoryRepository.findById(id, bandId);
    if (!existing) throw new Error("Ação não autorizada.");

    await inventoryRepository.delete(id);
    revalidatePath("/dashboard/inventory");
    return { success: true };
  },
  {
    audit: {
      action: "DELETED",
      entity: "EQUIPMENT",
      details: () => `Equipamento removido`
    }
  }
);
