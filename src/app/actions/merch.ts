"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createMerchItem(bandId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const priceStr = formData.get("price") as string;
    const costStr = formData.get("costPrice") as string;
    const stockStr = formData.get("stock") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const sizes = formData.get("sizes") as string; // String JSON ou separada por vírgula

    if (!name || !category || !priceStr || !bandId) return;

    await prisma.merchItem.create({
        data: {
            name,
            category,
            price: parseFloat(priceStr),
            costPrice: costStr ? parseFloat(costStr) : null,
            stock: parseInt(stockStr) || 0,
            imageUrl,
            sizes,
            bandId,
        },
    });

    revalidatePath(`/dashboard/merch`);
}

export async function updateMerchStock(itemId: string, newStock: number) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.merchItem.update({
        where: { id: itemId },
        data: { stock: Math.max(0, newStock) }
    });

    revalidatePath(`/dashboard/merch`);
}

export async function deleteMerchItem(itemId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.merchItem.delete({
        where: { id: itemId }
    });

    revalidatePath(`/dashboard/merch`);
}

interface CartItem {
    itemId: string;
    quantity: number;
    unitPrice: number;
}

export async function registerMerchSale(
    bandId: string,
    items: CartItem[],
    paymentMethod: string,
    gigId?: string
) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    if (!items || items.length === 0) return { error: "Carrinho vazio" };

    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    // Create the sale
    await prisma.merchSale.create({
        data: {
            totalAmount,
            paymentMethod,
            bandId,
            gigId: gigId || null,
            items: {
                create: items.map(item => ({
                    itemId: item.itemId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                }))
            }
        }
    });

    // Decrease the stock for each item sold
    for (const item of items) {
        await prisma.merchItem.update({
            where: { id: item.itemId },
            data: {
                stock: {
                    decrement: item.quantity
                }
            }
        });
    }

    revalidatePath(`/dashboard/merch`);
    revalidatePath(`/dashboard/merch/pos`);
    if (gigId) {
        revalidatePath(`/dashboard/gigs/${gigId}`);
    }

    return { success: true };
}
