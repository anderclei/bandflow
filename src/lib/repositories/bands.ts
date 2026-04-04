import { prisma } from "@/lib/prisma";

export class BandsRepository {
  /**
   * Find band by ID.
   */
  async findById(id: string) {
    return prisma.band.findUnique({
      where: { id }
    });
  }

  /**
   * Find band by Slug.
   */
  async findBySlug(slug: string) {
    return prisma.band.findUnique({
      where: { slug }
    });
  }

  /**
   * Update band settings.
   */
  async update(id: string, data: any) {
    return prisma.band.update({
      where: { id },
      data
    });
  }

  /**
   * Create a new band.
   */
  async create(data: any) {
    return prisma.band.create({ data });
  }

  /**
   * Generate a unique slug for a band.
   */
  generateSlug(name: string): string {
    return name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim() + "-" + Math.random().toString(36).substring(2, 6);
  }
}

export const bandsRepository = new BandsRepository();
