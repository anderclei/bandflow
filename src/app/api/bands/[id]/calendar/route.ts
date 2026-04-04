import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function formatDateForICS(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const bandId = (await params).id;

    try {
        const band = await prisma.band.findUnique({
            where: { id: bandId },
            include: { gigs: true }
        });

        if (!band) {
            return new NextResponse("Band not found", { status: 404 });
        }

        const events = band.gigs.map(gig => {
            const start = formatDateForICS(new Date(gig.date));
            // Assuming gigs generally last 4 hours if no specific end time is given
            const endDate = new Date(gig.date);
            endDate.setHours(endDate.getHours() + 4);
            const end = formatDateForICS(endDate);

            return `BEGIN:VEVENT
UID:${gig.id}@bandmanager.app
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${start}
DTEND:${end}
SUMMARY:${gig.title}
LOCATION:${gig.location || ''}
DESCRIPTION:${gig.notes ? gig.notes.replace(/\r\n|\n/g, '\\n') : ''}
END:VEVENT`;
        });

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BandFlow//NONSGML v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${band.name} - Shows
X-WR-TIMEZONE:America/Sao_Paulo
${events.join('\n')}
END:VCALENDAR`;

        return new NextResponse(icsContent, {
            headers: {
                'Content-Type': 'text/calendar; charset=utf-8',
                'Content-Disposition': `attachment; filename="${band.slug}-agenda.ics"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });

    } catch (error) {
        console.error("Error generating ICS:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
