"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTicket(data: { subject: string, category: string, priority: string, message: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Usuário não autenticado." };

        const member = await prisma.member.findFirst({
            where: { userId: session.user.id },
            include: { band: true }
        });

        if (!member) {
            return { success: false, error: "Usuário não associado a uma conta/banda ativa." };
        }

        const ticket = await prisma.supportTicket.create({
            data: {
                bandId: member.bandId,
                userId: session.user.id,
                subject: data.subject,
                category: data.category,
                priority: data.priority,
                messages: {
                    create: {
                        userId: session.user.id,
                        content: data.message,
                        isFromAdmin: false
                    }
                }
            }
        });

        revalidatePath("/dashboard/support");
        revalidatePath("/super-admin/tickets");

        return { success: true, ticketId: ticket.id };

    } catch (error) {
        console.error("Error creating ticket:", error);
        return { success: false, error: "Falha ao abrir chamado." };
    }
}

export async function getTickets(bandId?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado" };

        const whereClause: any = {};
        
        if (bandId) {
            whereClause.bandId = bandId;
        } else {
            // Se não tem bandId, precisa ser Super Admin para listar tudo
            const user = await prisma.user.findUnique({ where: { id: session.user.id } });
            if (!user?.isSuperAdmin) {
                return { success: false, error: "Sem permissão global." };
            }
        }

        const tickets = await prisma.supportTicket.findMany({
            where: whereClause,
            include: {
                band: { select: { name: true, type: true, imageUrl: true } },
                user: { select: { name: true, email: true } },
                _count: { select: { messages: true } }
            },
            orderBy: [
                { status: 'asc' }, // OPEN primeiro
                { updatedAt: 'desc' }
            ]
        });

        return { success: true, tickets };

    } catch (error) {
        return { success: false, error: "Erro ao buscar tickets" };
    }
}

export async function getTicketDetails(ticketId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado" };

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            include: {
                band: { select: { name: true } },
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        user: { select: { name: true, isSuperAdmin: true, image: true } }
                    }
                }
            }
        });

        if (!ticket) return { success: false, error: "Ticket não encontrado." };

        return { success: true, ticket };
    } catch (error) {
        return { success: false, error: "Erro ao detalhar" };
    }
}

export async function replyToTicket(ticketId: string, content: string, newStatus?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        const isAdmin = user?.isSuperAdmin === true || (user as any).isSuperAdmin === 1;

        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                status: newStatus ? newStatus : isAdmin ? "IN_PROGRESS" : "OPEN",
                messages: {
                    create: {
                        userId: session.user.id,
                        content,
                        isFromAdmin: isAdmin
                    }
                }
            }
        });

        revalidatePath("/dashboard/support");
        revalidatePath("/super-admin/tickets");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Falha na resposta." };
    }
}

export async function updateTicketStatus(ticketId: string, status: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Não autorizado." };

        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { status }
        });

        revalidatePath("/dashboard/support");
        revalidatePath("/super-admin/tickets");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Falha ao alterar status." };
    }
}
