import { prisma } from "@/lib/prisma";

export class MembersRepository {
  /**
   * Find all members for a band.
   */
  async findAll(bandId: string) {
    return prisma.member.findMany({
      where: { bandId },
      include: {
        formats: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        }
      }
    });
  }

  /**
   * Find a specific member.
   */
  async findById(id: string, bandId: string) {
    const member = await prisma.member.findUnique({
      where: { id },
      include: { user: true, formats: true }
    });
    if (!member || member.bandId !== bandId) return null;
    return member;
  }

  /**
   * Create a Member.
   */
  async create(data: any, bandId: string) {
    const { selectedFormats, ...memberData } = data;
    const formatsToConnect = selectedFormats?.map((id: string) => ({ id })) || [];

    return prisma.member.create({ 
      data: {
        ...memberData,
        bandId,
        formats: {
          connect: formatsToConnect
        }
      } 
    });
  }

  /**
   * Update Member.
   */
  async update(id: string, data: any) {
    const { selectedFormats, ...memberData } = data;
    const formatsToConnect = selectedFormats?.map((id: string) => ({ id })) || [];

    return prisma.member.update({
      where: { id },
      data: {
        ...memberData,
        formats: {
          set: [], // Clear existing
          connect: formatsToConnect
        }
      }
    });
  }

  /**
   * Delete Member.
   */
  async delete(id: string) {
    return prisma.member.delete({
      where: { id }
    });
  }

  /**
   * Count members.
   */
  async count(bandId: string) {
    return prisma.member.count({ where: { bandId } });
  }

  /**
   * Find band limits.
   */
  async getBandLimits(bandId: string) {
    return prisma.band.findUnique({
      where: { id: bandId },
      select: { maxMembers: true, subscriptionPlan: true }
    });
  }
}

export const membersRepository = new MembersRepository();
