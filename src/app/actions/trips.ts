"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function getActiveBandId() {
    const cookieStore = await cookies();
    return cookieStore.get("activeBandId")?.value;
}

export async function getTrips() {
    const bandId = await getActiveBandId();
    if (!bandId) return [];

    const trips = await prisma.trip.findMany({
        where: { bandId },
        orderBy: { createdAt: "desc" },
        include: {
            rooms: {
                include: {
                    assignments: {
                        include: {
                            member: true,
                        }
                    }
                }
            }
        }
    });
    return trips;
}

export async function createTrip(data: {
    eventName: string;
    city: string;
    date: string;
    hotel?: string;
}) {
    const bandId = await getActiveBandId();
    if (!bandId) throw new Error("Nenhuma banda ativa.");

    await prisma.trip.create({
        data: {
            eventName: data.eventName,
            city: data.city,
            date: data.date,
            hotel: data.hotel || null,
            bandId,
        }
    });
    revalidatePath("/dashboard/logistics/hotel");
}

export async function deleteTrip(id: string) {
    const bandId = await getActiveBandId();
    if (!bandId) throw new Error("Nenhuma banda ativa.");

    // Deletar filhos primeiro
    await (prisma as any).roomAssignment.deleteMany({
        where: { room: { tripId: id } }
    });
    await prisma.room.deleteMany({ where: { tripId: id } });
    await prisma.trip.deleteMany({ where: { id, bandId } });

    revalidatePath("/dashboard/logistics/hotel");
}

export async function createRoom(tripId: string, data: {
    name: string;
    type: string;
}) {
    await prisma.room.create({
        data: {
            name: data.name,
            type: data.type,
            tripId,
        }
    });
    revalidatePath("/dashboard/logistics/hotel");
}

export async function deleteRoom(id: string) {
    await (prisma as any).roomAssignment.deleteMany({ where: { roomId: id } });
    await prisma.room.delete({ where: { id } });
    revalidatePath("/dashboard/logistics/hotel");
}

export async function assignMemberToRoom(roomId: string, memberId: string) {
    // Evitar duplicata
    const exists = await prisma.roomAssignment.findFirst({
        where: { roomId, memberId }
    });
    if (!exists) {
        await prisma.roomAssignment.create({ data: { roomId, memberId } });
    }
    revalidatePath("/dashboard/logistics/hotel");
}

export async function removeAssignment(roomId: string, memberId: string) {
    await prisma.roomAssignment.deleteMany({ where: { roomId, memberId } });
    revalidatePath("/dashboard/logistics/hotel");
}
