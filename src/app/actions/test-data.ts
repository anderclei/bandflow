"use server";

import { prisma } from "@/lib/prisma";
import { getActiveBand } from "@/lib/getActiveBand";
import { revalidatePath } from "next/cache";

export async function createTestGig(formData?: FormData) {
    const { band } = await getActiveBand({
        members: { include: { user: true } },
        songs: { take: 5 }
    });

    if (!band) throw new Error("Band not found");

    const members = (band as any).members || [];
    const songs = (band as any).songs || [];

    const date = new Date();
    date.setDate(date.getDate() + 7); // Show in 7 days

    // 1. Create the Gig
    const gig = await prisma.gig.create({
        data: {
            title: "Show de Lançamento - Teste Completo",
            date: date,
            location: "Teatro Municipal de São Paulo",
            fee: 5000,
            loadIn: new Date(date.getTime() - 4 * 60 * 60 * 1000), // 4h before
            soundcheck: new Date(date.getTime() - 2 * 60 * 60 * 1000), // 2h before
            showtime: date,
            bandId: band.id,
            notes: "Este é um show de teste gerado automaticamente com todos os dados de logística e equipe.",
        }
    });

    // 2. Create Tasks
    await prisma.gigTask.createMany({
        data: [
            { description: "Revisar cabos de áudio", gigId: gig.id },
            { description: "Confirmar transporte da equipe", gigId: gig.id },
            { description: "Check-list de figurino", gigId: gig.id },
        ]
    });

    // 3. Create Member Fees
    if (members.length > 0) {
        await prisma.memberGigFee.createMany({
            data: members.map((m: any) => ({
                amount: 300,
                memberId: m.id,
                gigId: gig.id,
            }))
        });
    }

    // 4. Create Setlist
    if (songs.length > 0) {
        const setlist = await prisma.setlist.create({
            data: {
                title: `Setlist - ${gig.title}`,
                bandId: band.id,
                gig: { connect: { id: gig.id } }
            }
        });

        await prisma.setlistItem.createMany({
            data: songs.map((song: any, index: number) => ({
                songId: song.id,
                setlistId: setlist.id,
                position: index + 1
            }))
        });
    }

    // 5. Create Trip and Rooms (Logistics)
    const trip = await prisma.trip.create({
        data: {
            eventName: gig.title,
            city: "São Paulo",
            date: date.toISOString().split('T')[0],
            hotel: "Hotel Transamérica",
            bandId: band.id,
        }
    });

    const room = await prisma.room.create({
        data: {
            name: "Suíte 502",
            type: "DOUBLE",
            tripId: trip.id
        }
    });

    if (members.length >= 2) {
        await prisma.roomAssignment.createMany({
            data: [
                { roomId: room.id, memberId: members[0].id },
                { roomId: room.id, memberId: members[1].id },
            ]
        });
    }

    revalidatePath("/dashboard/gigs");
}
