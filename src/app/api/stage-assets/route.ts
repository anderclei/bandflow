import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const assets = await prisma.stageAssetDefinition.findMany({
            orderBy: { category: "asc" },
            where: { isActive: true },
        });

        const serialized = assets.map(a => ({
            id: a.id,
            type: a.type,
            label: a.label,
            category: a.category,
            widthClass: a.widthClass,
            svgContent: a.svgContent,
            imageUrl: a.imageUrl,
            isActive: a.isActive,
            createdAt: a.createdAt.toISOString(),
            updatedAt: a.updatedAt.toISOString(),
        }));

        return NextResponse.json({ ok: true, assets: serialized });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
