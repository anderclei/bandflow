import { prisma } from "@/lib/prisma";
import { type Gig, type GigTask } from "@prisma/client";

export class GigsRepository {
  /**
   * Find all gigs for a band with optional inclusion.
   */
  async findAll(bandId: string, include?: any) {
    return prisma.gig.findMany({
      where: { bandId },
      include,
      orderBy: { date: 'asc' }
    });
  }

  /**
   * Find a specific gig ensuring it belongs to the band.
   */
  async findById(id: string, bandId: string, include?: any) {
    const gig = await prisma.gig.findUnique({
      where: { id },
      include
    });

    if (!gig || gig.bandId !== bandId) return null;
    return gig;
  }

  /**
   * Create a new Gig.
   */
  async create(data: any) {
    return prisma.gig.create({ data });
  }

  /**
   * Update a Gig.
   */
  async update(id: string, data: any) {
    return prisma.gig.update({
      where: { id },
      data
    });
  }

  /**
   * Delete a Gig.
   */
  async delete(id: string) {
    return prisma.gig.delete({
      where: { id }
    });
  }

  /**
   * Count gigs for a band.
   */
  async count(bandId: string) {
    return prisma.gig.count({ where: { bandId } });
  }

  // --- Gig Tasks ---

  async createTask(data: { description: string; gigId: string }) {
    return prisma.gigTask.create({ data });
  }

  async updateTask(taskId: string, data: { isCompleted: boolean }) {
    return prisma.gigTask.update({
      where: { id: taskId },
      data
    });
  }

  async deleteTask(taskId: string) {
    return prisma.gigTask.delete({
      where: { id: taskId }
    });
  }
}

export const gigsRepository = new GigsRepository();
