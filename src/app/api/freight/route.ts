import { NextRequest, NextResponse } from "next/server";

function toRad(deg: number) {
    return (deg * Math.PI) / 180;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocode(city: string): Promise<{ lat: number; lon: number; display: string } | null> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ", Brasil")}&format=json&limit=1&addressdetails=1`;
    try {
        const res = await fetch(url, {
            headers: { "User-Agent": "BandFlow-ERP/1.0 (bandflow@example.com)" },
            next: { revalidate: 86400 }, // cache 24h
        });
        const data = await res.json();
        if (!data || data.length === 0) return null;
        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            display: data[0].display_name,
        };
    } catch {
        return null;
    }
}

export async function GET(req: NextRequest) {
    const origin = req.nextUrl.searchParams.get("origin");
    const destination = req.nextUrl.searchParams.get("destination");
    const kmValue = parseFloat(req.nextUrl.searchParams.get("kmValue") || "0");

    if (!origin || !destination) {
        return NextResponse.json({ error: "Parâmetros 'origin' e 'destination' são obrigatórios." }, { status: 400 });
    }

    const [originGeo, destGeo] = await Promise.all([geocode(origin), geocode(destination)]);

    if (!originGeo) {
        return NextResponse.json({ error: `Cidade de origem não encontrada: "${origin}"` }, { status: 404 });
    }
    if (!destGeo) {
        return NextResponse.json({ error: `Cidade de destino não encontrada: "${destination}"` }, { status: 404 });
    }

    // Distância em linha reta × 1.35 (fator estrada médio Brasil)
    const straightKm = haversineKm(originGeo.lat, originGeo.lon, destGeo.lat, destGeo.lon);
    const roadKm = Math.round(straightKm * 1.35);
    const estimatedCost = kmValue > 0 ? roadKm * kmValue : null;

    return NextResponse.json({
        originDisplay: originGeo.display,
        destinationDisplay: destGeo.display,
        straightKm: Math.round(straightKm),
        roadKm,
        estimatedCost,
    });
}
