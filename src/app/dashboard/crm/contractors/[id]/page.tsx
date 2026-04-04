import { getActiveBand } from "@/lib/getActiveBand";
import { prisma } from "@/lib/prisma";
import { Building, Mail, Phone, MapPin, FileText, Calendar, DollarSign, ArrowLeft, Briefcase, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function ContractorDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { band } = await getActiveBand();

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const contractor = await prisma.contractor.findUnique({
        where: { id: params.id, bandId: band.id },
        include: {
            gigs: {
                orderBy: { date: 'desc' },
            },
            deals: {
                orderBy: { updatedAt: 'desc' },
            }
        }
    });

    if (!contractor) {
        redirect("/dashboard/crm/contractors");
    }

    const totalPaid = contractor.gigs.reduce((acc, gig) => acc + (gig.fee || 0), 0);
    const totalShows = contractor.gigs.length;

    return (
        <div className="space-y-8 pb-10">
            {/* Header / Back Link */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/crm/contractors"
                    className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        {contractor.name}
                    </h1>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                        Detalhes e histórico do contratante.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left Column: Details */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Main Info Card */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 rounded-2xl bg-secondary/10 text-secondary">
                                <Building className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{contractor.name}</h2>
                                {contractor.document && (
                                    <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
                                        <FileText className="h-3 w-3" /> {contractor.document}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 text-sm">
                            {contractor.email && (
                                <div className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
                                    <Mail className="h-5 w-5 shrink-0 opacity-50 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-zinc-900 dark:text-zinc-200">E-mail</p>
                                        <p>{contractor.email}</p>
                                    </div>
                                </div>
                            )}
                            {contractor.phone && (
                                <div className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
                                    <Phone className="h-5 w-5 shrink-0 opacity-50 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-zinc-900 dark:text-zinc-200">Telefone</p>
                                        <p>{contractor.phone}</p>
                                    </div>
                                </div>
                            )}
                            {(contractor.city || contractor.state) && (
                                <div className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
                                    <MapPin className="h-5 w-5 shrink-0 opacity-50 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-zinc-900 dark:text-zinc-200">Localização</p>
                                        <p>{contractor.city}{contractor.city && contractor.state ? ' - ' : ''}{contractor.state}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notes Card */}
                    {contractor.notes && (
                        <div className="rounded-3xl bg-amber-50 dark:bg-amber-900/10 p-6 shadow-sm ring-1 ring-amber-200/50 dark:ring-amber-500/20">
                            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-500 mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Observações
                            </h3>
                            <p className="text-sm text-amber-800 dark:text-amber-200/70 whitespace-pre-wrap">
                                {contractor.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column: History & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                            <div className="flex items-center gap-3 text-secondary mb-2">
                                <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <span className="font-semibold text-sm">Total de Shows</span>
                            </div>
                            <p className="text-3xl font-bold">{totalShows}</p>
                        </div>
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                            <div className="flex items-center gap-3 text-secondary mb-2">
                                <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <span className="font-semibold text-sm">Valor Pago</span>
                            </div>
                            <p className="text-3xl font-bold">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaid)}
                            </p>
                        </div>
                    </div>

                    {/* Gigs History */}
                    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 overflow-hidden">
                        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-secondary" />
                                Histórico de Shows
                            </h3>
                            <Link
                                href="/dashboard/gigs/new"
                                className="text-sm font-semibold text-secondary hover:underline flex items-center gap-1"
                            >
                                <Plus className="h-4 w-4" /> Novo
                            </Link>
                        </div>

                        {contractor.gigs.length > 0 ? (
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {contractor.gigs.map(gig => (
                                    <Link key={gig.id} href={`/dashboard/gigs/${gig.id}`} className="block hover:bg-zinc-50 dark:hover:bg-zinc-800/50 p-6 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-foreground">{gig.title}</p>
                                                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {format(new Date(gig.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                                    </span>
                                                    {gig.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {gig.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {gig.fee ? (
                                                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gig.fee)}
                                                </p>
                                            ) : (
                                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                    Sem valor
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-zinc-500">
                                <p>Este contratante ainda não possui histórico de shows.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
