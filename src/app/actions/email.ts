"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

export async function sendContactEmail(formData: FormData) {
    const bandId = formData.get("bandId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!bandId || !name || !email || !message) {
        throw new Error("Missing required fields");
    }

    try {
        // Find the band's admins to send the email to
        const admins = await prisma.member.findMany({
            where: {
                bandId,
                role: "ADMIN",
            },
            include: { user: true }
        });

        if (admins.length === 0) {
            throw new Error("No administrators found for this band");
        }

        const adminEmails = admins.map(admin => admin.user?.email).filter(Boolean) as string[];

        if (adminEmails.length === 0) {
            throw new Error("Band administrators do not have valid emails");
        }

        // Send email using Resend
        await resend.emails.send({
            from: "Contato BandFlow <onboarding@resend.dev>", // Replace with your verified domain
            to: adminEmails,
            subject: `Nova mensagem para sua banda de ${name}`,
            html: `
                <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                    <h2>Você recebeu uma nova mensagem através do seu perfil público no BandFlow!</h2>
                    <p><strong>De:</strong> ${name} (${email})</p>
                    <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                </div>
            `,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: "Failed to send message" };
    }
}
