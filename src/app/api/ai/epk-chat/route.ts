import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, bandId } = await req.json();

    // 1. Buscar contexto completo da banda
    const band = await prisma.band.findUnique({
        where: { id: bandId },
        include: {
            formats: true,
            members: { select: { name: true, position: true } },
            gigs: {
                where: { date: { gte: new Date() } },
                select: { date: true, location: true }
            }
        }
    });

    if (!band) return new Response("Band not found", { status: 404 });

    // 2. Formatar agenda para a IA entender disponibilidade
    const busyDates = band.gigs.map(g => 
        `${g.date.toLocaleDateString('pt-BR')} em ${g.location || 'Local Reservado'}`
    ).join(", ");

    // 3. Formatar formatos de show
    const formatsInfo = band.formats.map(f => 
        `- ${f.name}: ${f.description}. Preço base sugerido: R$ ${f.basePrice || 'A consultar'}`
    ).join("\n");

    const systemPrompt = `
        Você é o "Booking Agent" oficial da banda/artista ${band.name}. 
        Seu objetivo é ser educado, profissional e converter conversas em reservas de shows.
        
        CONTEXTO DA BANDA:
        - Nome: ${band.name}
        - Bio: ${band.shortBio}
        - Membros: ${band.members.map(m => `${m.name} (${m.position})`).join(", ")}
        
        FORMATOS DE SHOW DISPONÍVEIS:
        ${formatsInfo}
        
        DISPONIBILIDADE (Datas já ocupadas): 
        ${busyDates || "A banda está com a agenda totalmente aberta no momento."}
        
        REGRAS DE CONDUTA:
        1. Se perguntarem sobre preço, mencione o "preço base" do formato e diga que o valor final depende de logística/distância.
        2. Se perguntarem sobre rider técnico, explique que você pode ajudar com dúvidas gerais, mas que os PDFs oficiais estão na página.
        3. Seja conciso. Use emojis de forma profissional 🎸.
        4. O tom deve ser moderno e focado em fechar negócio.
        5. Se o interesse for real, peça para clicarem no botão "Falar com a Produção" para formalizar.
    `;

    const result = streamText({
        model: openai("gpt-4o-mini"),
        messages,
        system: systemPrompt,
    });

    return result.toUIMessageStreamResponse();
}
