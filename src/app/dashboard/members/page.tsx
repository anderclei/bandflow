import { getActiveBand } from "@/lib/getActiveBand";
import { prisma } from "@/lib/prisma";
import { MembersClient } from "./members-client";

export default async function MembersPage() {
    const { band } = await getActiveBand({
        members: {
            include: {
                user: true,
                formats: true,
                documents: true,
            }
        },
        formats: true // Fetch show formats for the band
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    return (
        <MembersClient
            members={band.members}
            formats={band.formats}
            bandName={band.name}
        />
    );
}
