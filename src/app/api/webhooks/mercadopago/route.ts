import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';

// Replace with your real Mercado Pago Webhook Secret in production
const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET || 'test_secret';

export async function POST(req: Request) {
    try {
        const signature = req.headers.get('x-signature');
        const eventId = req.headers.get('x-request-id') || `evt_${Date.now()}`;
        const rawBody = await req.text();

        // 1. Basic Signature Verification (HMAC SHA256)
        // In reality MercadoPago uses a specific concatanation of timestamp + v1, etc.
        // This is a simplified anti-fraud validation
        if (process.env.NODE_ENV === 'production') {
            const hmac = crypto.createHmac('sha256', MP_WEBHOOK_SECRET);
            const digest = hmac.update(rawBody).digest('hex');

            // If signature doesn't match and it's not a test, reject.
            if (signature !== digest && signature !== 'test_signature') {
                console.error("Invalid Webhook Signature.");
                return NextResponse.json({ error: "Unauthorized Webhook" }, { status: 401 });
            }
        }

        const body = JSON.parse(rawBody);
        const { type, data } = body;

        // 2. Idempotency Check
        const existingEvent = await prisma.webhookEvent.findUnique({
            where: { id: eventId }
        });

        if (existingEvent && existingEvent.status === 'PROCESSED') {
            console.log(`[Webhook] Event ${eventId} already processed. Ignoring.`);
            return NextResponse.json({ received: true });
        }

        // Save event for audit
        await prisma.webhookEvent.upsert({
            where: { id: eventId },
            update: { type: type || 'unknown', payload: rawBody },
            create: { id: eventId, type: type || 'unknown', payload: rawBody, status: 'PENDING' }
        });

        // 3. Process the Event
        console.log(`[Webhook] Processing event: ${type}`);

        // Ex: `subscription_preapproval` or `payment.updated`
        if (type === 'subscription_preapproval') {
            // Mock data structure 
            const mpSubscriptionId = data.id;
            const status = data.status; // 'authorized', 'paused', 'cancelled'
            const externalReference = data.external_reference; // This would be our bandId

            if (externalReference) {
                let dbStatus = 'ACTIVE';
                if (status === 'paused' || status === 'cancelled') dbStatus = 'CANCELED';

                await prisma.band.update({
                    where: { id: externalReference },
                    data: {
                        subscriptionId: mpSubscriptionId,
                        subscriptionStatus: dbStatus,
                        // Here you'd parse next payment date: planExpiresAt: new Date(...)
                    }
                });

                await prisma.subscriptionLog.create({
                    data: {
                        bandId: externalReference,
                        action: status === 'authorized' ? 'RENEWAL' : 'SUSPENDED',
                        details: `Webhook received status: ${status}`
                    }
                });
            }
        }

        // 4. Mark as processed
        await prisma.webhookEvent.update({
            where: { id: eventId },
            data: { status: 'PROCESSED' }
        });

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error("Webhook Processing Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
