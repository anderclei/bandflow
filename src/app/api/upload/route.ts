import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/auth";

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string; // 'logo', 'song', 'gig-contract'

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

        let uploadDir = "";
        if (type === "logo") uploadDir = "logos";
        else if (type === "song") uploadDir = "songs";
        else if (type === "document") uploadDir = "documents";
        else uploadDir = "others";

        const relativePath = join("uploads", uploadDir, filename);
        const absolutePath = join(process.cwd(), "public", relativePath);

        // Ensure directory exists
        await mkdir(join(process.cwd(), "public", "uploads", uploadDir), { recursive: true });

        await writeFile(absolutePath, buffer);

        // Return browser-accessible URL
        return NextResponse.json({ url: `/${relativePath.replace(/\\/g, "/")}` });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
