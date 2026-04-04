"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function addCateringItem(gigId: string, data: { name: string, quantity?: string, category: string }) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await prisma.cateringItem.create({
        data: {
            ...data,
            gigId
        }
    })

    revalidatePath("/dashboard/logistics/camarim")
}

export async function toggleCateringItem(itemId: string, isChecked: boolean) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await prisma.cateringItem.update({
        where: { id: itemId },
        data: { isChecked }
    })

    revalidatePath("/dashboard/logistics/camarim")
}

export async function deleteCateringItem(itemId: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    await prisma.cateringItem.delete({
        where: { id: itemId }
    })

    revalidatePath("/dashboard/logistics/camarim")
}
