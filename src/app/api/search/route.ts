import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const bandId = searchParams.get("bandId") || "";

    if (!q || q.length < 2 || !bandId) {
        return NextResponse.json({ results: [] });
    }

    const [gigs, songs, contractors, documents] = await Promise.all([
        prisma.gig.findMany({
            where: { bandId, title: { contains: q } },
            select: { id: true, title: true },
            take: 5,
        }),
        prisma.song.findMany({
            where: { bandId, title: { contains: q } },
            select: { id: true, title: true },
            take: 5,
        }),
        prisma.contractor.findMany({
            where: { bandId, name: { contains: q } },
            select: { id: true, name: true },
            take: 5,
        }),
        prisma.document.findMany({
            where: { bandId, title: { contains: q } },
            select: { id: true, title: true },
            take: 5,
        }),
    ]);

    const results = [
        ...gigs.map((g) => ({ id: g.id, title: g.title, type: "gig", href: `/dashboard/gigs/${g.id}` })),
        ...songs.map((s) => ({ id: s.id, title: s.title, type: "song", href: `/dashboard/songs` })),
        ...contractors.map((c) => ({ id: c.id, title: c.name, type: "contractor", href: `/dashboard/crm/contractors/${c.id}` })),
        ...documents.map((d) => ({ id: d.id, title: d.title, type: "document", href: `/dashboard/documents` })),
    ];

    return NextResponse.json({ results });
}
