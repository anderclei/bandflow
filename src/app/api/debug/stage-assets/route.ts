import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const count = await prisma.stageAssetDefinition.count();
        const assets = await prisma.stageAssetDefinition.findMany({
            select: { id: true, label: true, category: true, type: true },
            take: 20,
        });
        
        return NextResponse.json({
            ok: true,
            count,
            assets,
            dbEnv: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasDirectUrl: !!process.env.DIRECT_URL,
                // partial masking for safety
                databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) ?? "NOT_SET",
            }
        });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message, stack: e.stack }, { status: 500 });
    }
}
