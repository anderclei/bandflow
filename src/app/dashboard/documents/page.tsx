import { getActiveBand } from "@/lib/getActiveBand";
import { redirect } from "next/navigation";
import { FolderOpen } from "lucide-react";
import { DocumentClient } from "./DocumentClient";

export default async function DocumentsPage() {
    const { band } = await getActiveBand({
        documents: {
            include: { member: { include: { user: true } } },
            orderBy: { createdAt: 'desc' }
        },
        members: {
            include: { user: true }
        },
        setlists: {
            orderBy: { createdAt: 'desc' }
        }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const documents = (band.documents as any[]) || [];
    const members = (band.members as any[]) || [];
    const setlists = (band.setlists as any[]) || [];

    return (
        <div className="space-y-8 h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <FolderOpen className="h-8 w-8 text-secondary" />
                        Drive Corporativo
                    </h1>
                    <p className="text-zinc-500 mt-1">
                        Gerencie CNDs, contratos e documentos exigidos pelas prefeituras e licitações.
                    </p>
                </div>
            </div>

            <DocumentClient initialDocuments={documents} members={members} bandId={band.id} setlists={setlists} />
        </div>
    );
}
