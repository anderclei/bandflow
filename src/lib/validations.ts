import { z } from "zod";

// Gig
export const gigSchema = z.object({
    title: z.string().min(1, "Título obrigatório"),
    date: z.string().min(1, "Data obrigatória"),
    location: z.string().optional(),
    fee: z.string().optional(),
    taxRate: z.string().optional(),
    taxAmount: z.string().optional(),
    notes: z.string().optional(),
    setlistId: z.string().optional(),
    loadIn: z.string().optional(),
    soundcheck: z.string().optional(),
    showtime: z.string().optional(),
});

// Expense
export const expenseSchema = z.object({
    description: z.string().min(1, "Descrição obrigatória"),
    amount: z.string().min(1, "Valor obrigatório"),
    date: z.string().min(1, "Data obrigatória"),
    category: z.string().optional(),
});

// Song
export const songSchema = z.object({
    title: z.string().min(1, "Título obrigatório"),
    artist: z.string().optional(),
    key: z.string().optional(),
    bpm: z.string().optional(),
    duration: z.string().optional(),
});

// Royalty Split
export const royaltySplitSchema = z.object({
    songId: z.string().min(1),
    memberId: z.string().min(1, "Selecione um integrante"),
    percentage: z.string().min(1, "Porcentagem obrigatória"),
    role: z.string().optional(),
});

// Royalty Payment
export const royaltyPaymentSchema = z.object({
    songId: z.string().min(1),
    amount: z.string().min(1, "Valor obrigatório"),
    date: z.string().min(1, "Data obrigatória"),
    source: z.string().min(1, "Fonte obrigatória"),
});

// Goal
export const goalSchema = z.object({
    title: z.string().min(1, "Título obrigatório"),
    targetValue: z.string().min(1, "Meta obrigatória"),
    unit: z.string().default("BRL"),
    deadline: z.string().optional(),
});
