import { Sidebar } from "@/components/dashboard/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { generateSmartNotifications } from "@/app/actions/notifications";
import { SearchTrigger } from "@/components/dashboard/SearchTrigger";
import { RoleToggle } from "@/components/dashboard/RoleToggle";
import { SubscriptionGuard } from "@/components/ui/subscription-guard";
import { GlobalAnnouncement } from "@/components/dashboard/GlobalAnnouncement";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user?.id }
    });
    const isSuperAdmin = user?.isSuperAdmin || false;

    // Check all bands the user belongs to
    const memberships = await prisma.member.findMany({
        where: { userId: session.user?.id },
        include: {
            band: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    imageUrl: true,
                    primaryColor: true,
                    secondaryColor: true,
                    type: true
                }
            }
        },
    });

    // Determine active band
    const cookieStore = await cookies();
    let activeBandId = cookieStore.get("activeBandId")?.value;

    // Check if the user is a member of the active band
    const isMemberOfActive = activeBandId ? memberships.some(m => m.bandId === activeBandId) : false;

    // Default to first band if none active
    if (!activeBandId || (!isMemberOfActive && !isSuperAdmin)) {
        if (memberships.length > 0) {
            activeBandId = memberships[0].bandId;
        }
    }

    const hasBand = memberships.length > 0 || (isSuperAdmin && !!activeBandId);

    let activeBand: any = null;
    if (hasBand && activeBandId) {
        // Usar findFirst sem Select para pegar todos os campos já que o prisma client pode estar dessincronizado
        // em ambiente de dev rodando hot-reload
        const tempBand = await prisma.band.findUnique({
            where: { id: activeBandId }
        });
        activeBand = tempBand;
    }

    let notifications: any[] = [];
    if (hasBand && activeBandId) {
        await generateSmartNotifications(activeBandId);
        notifications = await (prisma as any).notification.findMany({
            where: { bandId: activeBandId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }

    return (
        <div
            className="flex h-screen bg-[#0a0a0a] text-white selection:bg-[#ccff00] selection:text-black font-body"
            style={{
                // @ts-ignore
                "--brand-primary": "#0a0a0a",
                "--brand-secondary": activeBand?.secondaryColor || "#ccff00",
                "--brand-border": activeBand?.secondaryColor ? `${activeBand.secondaryColor}33` : "rgba(204, 255, 0, 0.2)",
                "--brand-accent": activeBand?.secondaryColor ? `${activeBand.secondaryColor}11` : "rgba(204, 255, 0, 0.05)",
            } as any}
        >
            {hasBand && (
                <Sidebar
                    memberships={memberships}
                    activeBandId={activeBandId!}
                    activeBand={activeBand}
                    isSuperAdmin={isSuperAdmin}
                />
            )}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <GlobalAnnouncement />
                {hasBand && (
                    <header
                        className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/50 backdrop-blur-3xl sticky top-0 z-40"
                    >
                        <div className="flex items-center gap-4">
                            <SearchTrigger />
                            <RoleToggle primaryColor={activeBand?.secondaryColor || "#ccff00"} />
                        </div>
                        <div className="flex items-center gap-2">
                            <NotificationPanel
                                notifications={JSON.parse(JSON.stringify(notifications))}
                                bandId={activeBandId!}
                            />
                        </div>
                    </header>
                )}
                <main className={`flex-1 overflow-y-auto ${hasBand ? 'p-8' : 'p-0'}`}>
                    <div className={`mx-auto ${hasBand ? 'max-w-7xl' : 'w-full h-full'}`}>
                        {hasBand && activeBand ? (
                            <SubscriptionGuard
                                status={activeBand.subscriptionStatus}
                                plan={activeBand.subscriptionPlan}
                                expiresAt={activeBand.planExpiresAt}
                            >
                                {children}
                            </SubscriptionGuard>
                        ) : (
                            children
                        )}
                    </div>
                </main>
            </div>
            {hasBand && <CommandPalette bandId={activeBandId!} />}
        </div>
    );
}
