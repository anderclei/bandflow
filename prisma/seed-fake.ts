import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🚀 Iniciando geração de Dados Fakes...");

    // 1. Criar ou Encontrar a Banda Alvo
    const bandName = "Banda Demo - Testes";
    const band = await prisma.band.upsert({
        where: { slug: "banda-demo" },
        update: {},
        create: {
            name: bandName,
            slug: "banda-demo",
            description: "Uma banda de exemplo para testes do sistema brutas.",
            primaryColor: "#ccff00",
            addressCity: "São Paulo",
            addressState: "SP",
            subscriptionStatus: "ACTIVE",
        },
    });
    console.log(`✅ Banda setada: ${band.name} (ID: ${band.id})`);

    // 2. Garantir que o admin existe
    const adminEmail = "anderclei@gmail.com";
    const user = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (user) {
        await prisma.member.upsert({
            where: { userId_bandId: { userId: user.id, bandId: band.id } },
            update: { role: "ADMIN" },
            create: { userId: user.id, bandId: band.id, role: "ADMIN", name: user.name || "Admin" },
        });
    }

    // 3. Setores: INTEGRANTES E EQUIPAMENTOS
    console.log("🎸 Gerando Integrantes e Equipos...");
    const membersData = [
        { name: "JOÃO VOCAL", role: "Vocalista", position: "FRONT" },
        { name: "PEDRO GUITAR", role: "Guitarrista", position: "L-STAGE" },
        { name: "MARTA BASS", role: "Baixista", position: "R-STAGE" },
        { name: "BRUNO DRUMS", role: "Baterista", position: "CENTER-BACK" },
    ];

    for (const m of membersData) {
        const member = await prisma.member.create({
            data: {
                name: m.name,
                role: "MEMBER",
                position: m.position,
                bandId: band.id,
                cache: 500,
            },
        });

        await prisma.equipment.create({
            data: {
                name: `EQUIPO DE ${m.name}`,
                category: "INSTRUMENTO",
                status: "AVAILABLE",
                bandId: band.id,
                ownerId: member.id,
            },
        });
    }

    // 4. Setores: LOGÍSTICA (Fornecedores e Viagens)
    console.log("🚚 Gerando Logística...");
    const supplier = await prisma.logisticsSupplier.create({
        data: {
            name: "TRANSPORTADORA VELOZ",
            kmValue: 2.5,
            bandId: band.id,
        },
    });

    const trip = await prisma.trip.create({
        data: {
            eventName: "TOUR PAULISTA 2026",
            city: "CAMPINAS",
            date: "2026-05-15",
            bandId: band.id,
        },
    });

    await prisma.flight.create({
        data: {
            airline: "LATAM",
            flightNumber: "LA3456",
            origin: "CGH",
            destination: "VCP",
            tripId: trip.id,
        },
    });

    // 5. Setores: CRM (Contratantes e Negócios)
    console.log("🤝 Gerando CRM...");
    const contractor = await prisma.contractor.create({
        data: {
            name: "AGÊNCIA NACIONAL DE SHOWS",
            type: "PJ",
            email: "contato@agencia.com",
            city: "SÃO PAULO",
            bandId: band.id,
            status: "WON",
        },
    });

    const deal = await prisma.deal.create({
        data: {
            title: "FESTIVAL DE INVERNO 2026",
            value: 25000,
            status: "WON",
            contractorId: contractor.id,
            bandId: band.id,
        },
    });

    // 6. Setores: SHOWS E REPERTÓRIO
    console.log("📅 Gerando Gigs e Setlists...");
    // Create multiple songs
    const songs = await Promise.all([
        prisma.song.create({ data: { title: "MÚSICA DE TESTE BRUTAL", artist: "PROJETO FAKE", bandId: band.id, bpm: 120 } }),
        prisma.song.create({ data: { title: "HINO DO CÓDIGO", artist: "A IA", bandId: band.id, bpm: 140 } }),
        prisma.song.create({ data: { title: "BUG FIX ANTHEM", artist: "PROJETO FAKE", bandId: band.id, bpm: 95 } }),
        prisma.song.create({ data: { title: "DEPLOY NOTURNO", artist: "A IA", bandId: band.id, bpm: 180 } }),
        prisma.song.create({ data: { title: "COMPILAÇÃO LENTA", artist: "PROJETO FAKE", bandId: band.id, bpm: 80 } }),
    ]);

    const setlist = await prisma.setlist.create({
        data: {
            title: "SETLIST PADRÃO 2026",
            bandId: band.id,
            items: {
                create: songs.map((s, index) => ({ position: index + 1, songId: s.id }))
            },
        },
    });

    const setlistAcoustic = await prisma.setlist.create({
        data: {
            title: "SETLIST ACÚSTICO",
            bandId: band.id,
            items: {
                create: [
                    { position: 1, songId: songs[0].id },
                    { position: 2, songId: songs[2].id }
                ]
            },
        },
    });

    // Create 10 gigs across different dates
    const currentDate = new Date();
    const gigs = await Promise.all(Array.from({ length: 10 }).map((_, i) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + (i * 7) - 14); // Some past, mostly future
        return prisma.gig.create({
            data: {
                title: `FESTIVAL PARTE ${i + 1}`,
                date: d,
                location: ["SESC PINHEIROS", "ALLIANZ PARQUE", "AUDIO CLUB", "CINE JOIA", "CIRCO VOADOR"][i % 5],
                fee: 10000 + (Math.random() * 20000),
                bandId: band.id,
                contractorId: contractor.id,
                setlistId: i % 2 === 0 ? setlist.id : setlistAcoustic.id,
                status: d < new Date() ? "COMPLETED" : "UPCOMING",
            },
        });
    }));

    // Add tasks and catering to the first future gig
    const futureGig = gigs.find(g => g.status === "UPCOMING");
    if (futureGig) {
        await prisma.gigTask.createMany({
            data: [
                { description: "REVISAR RIDER TÉCNICO", gigId: futureGig.id },
                { description: "FECHAR LOGÍSTICA DE VANS", gigId: futureGig.id },
                { description: "COMPRAR CORDAS EXTRAS", gigId: futureGig.id },
                { description: "ALINHAR ILUMINAÇÃO", gigId: futureGig.id },
            ],
        });

        await prisma.cateringItem.createMany({
            data: [
                { name: "ÁGUA MINERAL (SEM GÁS)", quantity: "24", gigId: futureGig.id },
                { name: "REFRIGERANTE COLA", quantity: "12", gigId: futureGig.id },
                { name: "TOALHAS PRETAS", quantity: "6", gigId: futureGig.id, category: "CAMARIM" },
                { name: "FRUTAS DA ESTAÇÃO", quantity: "1 Bandeja", gigId: futureGig.id, category: "ALIMENTAÇÃO" },
            ],
        });
    }

    // 7. Setores: FINANCEIRO (Transações e Metas)
    console.log("💰 Gerando Financeiro...");
    const financialData = Array.from({ length: 20 }).map((_, i) => ({
        description: ["CACHÊ SHOW", "ALUGUEL DE VAN", "ASSINATURA SPOTIFY", "ENSAIO ESTÚDIO", "COMPRA CORDAS", "MERCADINHO DA ESTRADA", "HOTEL"][i % 7],
        amount: Math.random() * 5000 + 100,
        type: (i % 3 === 0 || i === 0) ? "INCOME" : "EXPENSE",
        status: i % 4 === 0 ? "PENDING" : "PAID",
        category: ["SHOWS", "LOGÍSTICA", "OUTROS", "ESTÚDIO", "EQUIPAMENTO", "ALIMENTAÇÃO", "LOGÍSTICA"][i % 7],
        bandId: band.id,
        gigId: (i % 3 === 0) ? gigs[Math.floor(Math.random() * gigs.length)].id : undefined,
    }));

    await prisma.financialTransaction.createMany({
        data: financialData,
    });

    await prisma.goal.create({
        data: {
            title: "FUNDO PARA O NOVO ÁLBUM",
            targetValue: 50000,
            currentValue: 12500,
            bandId: band.id,
        },
    });

    // 8. Setores: MERCH E POS
    console.log("👕 Gerando Merchandising...");
    const merchItems = await Promise.all([
        prisma.merchItem.create({ data: { name: "AURA DARK TEE", category: "VESTUÁRIO", price: 89.90, costPrice: 35.00, stock: 45, bandId: band.id } }),
        prisma.merchItem.create({ data: { name: "INDUSTRIAL HOODIE", category: "VESTUÁRIO", price: 189.90, costPrice: 90.00, stock: 12, bandId: band.id } }),
        prisma.merchItem.create({ data: { name: "VINIL EDIÇÃO ESPECIAL", category: "MÍDIA", price: 150.00, costPrice: 80.00, stock: 0, bandId: band.id } }), // Sem estoque para teste 
        prisma.merchItem.create({ data: { name: "PULSEIRA VIP", category: "ACESSÓRIO", price: 25.00, costPrice: 5.00, stock: 100, bandId: band.id } }),
        prisma.merchItem.create({ data: { name: "TOUR POSTER 2026", category: "ARTE", price: 40.00, costPrice: 10.00, stock: 30, bandId: band.id } }),
    ]);

    await prisma.merchSale.create({
        data: {
            totalAmount: 114.90,
            paymentMethod: "CREDIT",
            bandId: band.id,
            items: {
                create: [
                    { itemId: merchItems[0].id, quantity: 1, unitPrice: 89.90 },
                    { itemId: merchItems[3].id, quantity: 1, unitPrice: 25.00 },
                ]
            }
        }
    });

    // 9. Documentos
    console.log("📄 Gerando Documentos...");
    await prisma.document.createMany({
        data: [
            { title: "CONTRATO TOUR ANUAL", category: "JURÍDICO", fileUrl: "https://example.com/fake.pdf", bandId: band.id },
            { title: "PASSAPORTE JOÃO VOCAL", category: "PESSOAL", fileUrl: "https://example.com/fake.pdf", bandId: band.id },
            { title: "MAPA DE PALCO 2026", category: "TÉCNICO", fileUrl: "https://example.com/fake.pdf", bandId: band.id },
            { title: "RIDER DE CAMARIM VIP", category: "TÉCNICO", fileUrl: "https://example.com/fake.pdf", bandId: band.id },
        ]
    });

    console.log("\n✨ TODOS OS DADOS FAKES (VERSÃO MASSIVA) FORAM GERADOS COM SUCESSO!");
}

main()
    .catch((e) => {
        console.error("❌ Erro ao gerar dados:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
