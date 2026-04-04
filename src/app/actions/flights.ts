"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function addFlight(tripId: string, data: { airline: string, flightNumber?: string, locator?: string, departureTime?: Date, arrivalTime?: Date, origin?: string, destination?: string, passengers?: string }) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await prisma.flight.create({
        data: {
            ...data,
            tripId
        }
    })

    revalidatePath("/dashboard/logistics/travel")
}

export async function deleteFlight(flightId: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await prisma.flight.delete({
        where: { id: flightId }
    })

    revalidatePath("/dashboard/logistics/travel")
}
