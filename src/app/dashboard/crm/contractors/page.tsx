import { getActiveBand } from "@/lib/getActiveBand";
import { prisma } from "@/lib/prisma";
import { Contact, Search, Plus, Trash2, Building, Mail, Phone, MapPin } from "lucide-react";
import { redirect } from "next/navigation";
import { createContractor, deleteContractor } from "@/app/actions/crm";
import Link from "next/link";

export default async function ContractorsPage() {
    const { band } = await getActiveBand({
        contractors: {
            orderBy: { name: 'asc' },
            include: { gigs: true }
        }
    });

    if (!band) {
        return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;
    }

    const contractors = band.contractors || [];

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <Contact className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                CRM <span className="text-zinc-600">_Contractors</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Stakeholder_Directory</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">Ready_To_Sync</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

                {/* Add Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#ccff00]/5 blur-[40px] rounded-full pointer-events-none" />
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-black border border-white/5 flex items-center justify-center text-[#ccff00]">
                                <Plus className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black font-heading uppercase tracking-tighter text-white">New_Entity</h2>
                        </div>

                        <form action={createContractor.bind(null, band.id)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Entity_Name</label>
                                <input
                                    name="name"
                                    required
                                    className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900"
                                    placeholder="NOME_RAZAO_SOCIAL..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Communication_Channel</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900"
                                    placeholder="EMAIL@..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Terminal_Phone</label>
                                <input
                                    name="phone"
                                    className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900"
                                    placeholder="+55_00_..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Geo_City</label>
                                    <input
                                        name="city"
                                        title="Cidade do Contratante"
                                        placeholder="EX: SAO_PAULO"
                                        className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">State_UF</label>
                                    <input
                                        name="state"
                                        maxLength={2}
                                        title="Estado (UF)"
                                        placeholder="EX: SP"
                                        className="w-full h-14 bg-black border border-white/10 px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ccff00]/50 transition-all uppercase placeholder:text-zinc-900"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Entity_Metadata</label>
                                <textarea
                                    name="notes"
                                    rows={3}
                                    className="w-full bg-black border border-white/10 p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-900"
                                    placeholder="CNPJ_NOTES_OR_SPEC..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="h-16 px-10 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 flex items-center justify-center gap-4 w-full"
                            >
                                Commitar_Stakeholder
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {contractors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {contractors.map((contractor: any) => (
                                <Link key={contractor.id} href={`/dashboard/crm/contractors/${contractor.id}`} className="group block">
                                    <div className="bg-zinc-900/40 border border-white/5 p-8 hover:border-[#ccff00]/40 transition-all relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800 group-hover:bg-[#ccff00] transition-colors" />
                                        
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-black border border-white/5 flex items-center justify-center text-zinc-700 group-hover:text-[#ccff00] transition-colors">
                                                    <Building className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-[14px] font-black text-white uppercase tracking-widest group-hover:text-[#ccff00] transition-colors truncate max-w-[180px]">{contractor.name}</h3>
                                                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                                                        {contractor.gigs.length}_PROTOCOL_SYNCED
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <form action={async (e) => {
                                                "use server";
                                                await deleteContractor(contractor.id);
                                            }} className="z-10 relative">
                                                <button
                                                    type="submit"
                                                    title="Excluir contratante"
                                                    className="w-10 h-10 flex items-center justify-center bg-black border border-white/5 text-zinc-800 hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </div>

                                        <div className="space-y-3 pt-6 border-t border-white/5">
                                            {contractor.email && (
                                                <div className="flex items-center gap-3">
                                                    <Mail className="h-3 w-3 text-zinc-800" />
                                                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest truncate">{contractor.email}</span>
                                                </div>
                                            )}
                                            {contractor.phone && (
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-3 w-3 text-zinc-800" />
                                                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest truncate">{contractor.phone}</span>
                                                </div>
                                            )}
                                            {(contractor.city || contractor.state) && (
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="h-3 w-3 text-zinc-800" />
                                                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest truncate">
                                                        {contractor.city || "NULL_CITY"}_{contractor.state || "UF"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-black border border-dashed border-white/5 p-24 text-center grayscale opacity-10">
                            <Building className="mx-auto h-16 w-16 text-zinc-900 mb-8" />
                            <h3 className="text-2xl font-black font-heading uppercase tracking-widest text-zinc-700">Null_Directory</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-900 mt-4">System_Idle. Waiting_For_Stakeholder_Registry.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
