import { getActiveBand } from "@/lib/getActiveBand";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Map, Plus, ArrowRight, Settings2 } from "lucide-react";
import Link from "next/link";

export default async function StagePlotsPage() {
    const { band } = await getActiveBand({
        formats: true
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const formats = (band as any).formats || [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Map className="h-8 w-8 text-secondary" />
                        Mapas de Palco
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Gerencie a disposição da sua banda no palco para cada tipo de show.
                    </p>
                </div>
                <Link
                    href="/dashboard/settings/formats"
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-secondary/20"
                >
                    <Plus className="h-4 w-4" /> Novo Formato de Show
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formats.length > 0 ? (
                    formats.map((format: any) => (
                        <div key={format.id} className="group relative rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 transition-all hover:shadow-md">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
                                    <Map className="h-6 w-6" />
                                </div>
                                <Link
                                    href={`/dashboard/settings/formats/${format.id}/stage-plot`}
                                    className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <Settings2 className="h-5 w-5" />
                                </Link>
                            </div>

                            <h3 className="text-lg font-bold text-foreground mb-1">{format.name}</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 line-clamp-2">
                                {format.description || "Nenhuma descrição definida para este formato."}
                            </p>

                            <Link
                                href={`/dashboard/settings/formats/${format.id}/stage-plot`}
                                className="flex items-center justify-between w-full p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-secondary hover:text-white transition-all group/btn"
                            >
                                Editar Mapa
                                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                        <Map className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Nenhum formato de show</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Crie um formato de show para configurar seu mapa de palco.</p>
                        <Link
                            href="/dashboard/settings/formats"
                            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-all dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        >
                            Começar agora
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
