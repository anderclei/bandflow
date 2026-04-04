import { prisma } from "@/lib/prisma";

export class InventoryRepository {
  /**
   * Find all equipment for a band.
   */
  async findAll(bandId: string) {
    return prisma.equipment.findMany({
      where: { bandId },
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Find a specific equipment.
   */
  async findById(id: string, bandId: string) {
    const item = await prisma.equipment.findUnique({
      where: { id }
    });
    if (!item || item.bandId !== bandId) return null;
    return item;
  }

  /**
   * Create an equipment.
   */
  async create(data: any, bandId: string) {
    return prisma.equipment.create({
      data: {
        ...data,
        bandId
      }
    });
  }

  /**
   * Update an equipment.
   */
  async update(id: string, data: any) {
    return prisma.equipment.update({
      where: { id },
      data
    });
  }

  /**
   * Delete an equipment.
   */
  async delete(id: string) {
    return prisma.equipment.delete({
      where: { id }
    });
  }

  /**
   * Summarize inventory value.
   */
  async getEquityValue(bandId: string) {
    const items = await prisma.equipment.findMany({
      where: { bandId },
      select: { value: true }
    });
    return items.reduce((acc, item) => acc + (item.value || 0), 0);
  }
}

export const inventoryRepository = new InventoryRepository();
