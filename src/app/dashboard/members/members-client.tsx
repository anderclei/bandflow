"use client"

import { useState } from "react"
import { Users, Mail, Shield, UserCircle, Plus, Send, Clock, Trash2, Edit } from "lucide-react"
import { MemberDialog } from "@/components/dashboard/members/member-dialog"

export function MembersClient({ members, formats, bandName }: { members: any[], formats: any[], bandName: string }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<any>(null)

    const handleEdit = (member: any) => {
        setSelectedMember(member)
        setIsDialogOpen(true)
    }

    const handleNew = () => {
        setSelectedMember(null)
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end justify-between border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ccff00]">
                            <Users className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-heading tracking-tighter uppercase leading-none text-white">
                                Integrantes <span className="text-zinc-600">& Músicos</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">BASE DE DADOS</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ccff00]">ACESSO OK</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleNew} 
                        className="bg-[#ccff00] px-8 py-4 text-[10px] font-black uppercase tracking-[.4em] text-black hover:bg-white transition-all shadow-[0_0_40px_rgba(204,255,0,0.1)] active:scale-95 flex items-center gap-3 font-heading"
                    >
                        <Plus className="h-4 w-4" />
                        ADICIONAR MEMBRO
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1">
                {/* Members List */}
                <div className="space-y-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800 ml-1">EQUIPE: {bandName?.toUpperCase()}</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {members?.map((member: any) => (
                            <div key={member.id} className="group relative bg-zinc-900/40 border border-white/5 transition-all hover:border-[#ccff00]/30 flex flex-col p-8 overflow-hidden">
                                <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#ccff00]/5 blur-[40px] rounded-full pointer-events-none" />
                                
                                <div className="absolute top-6 right-6 flex items-center gap-2">
                                    <button 
                                        onClick={() => handleEdit(member)} 
                                        title="Editar Perfil"
                                        className="w-8 h-8 flex items-center justify-center bg-black border border-white/5 text-zinc-600 hover:text-[#ccff00] transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center text-center space-y-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-black border border-white/5 overflow-hidden p-1 shadow-2xl">
                                            {member.user?.image ? (
                                                <img src={member.user.image} alt={member.name || member.user.name || ""} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-800 bg-zinc-900/20">
                                                    <UserCircle className="w-12 h-12" />
                                                </div>
                                            )}
                                        </div>
                                        {member.role === "ADMIN" && (
                                            <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-[#ccff00] flex items-center justify-center text-black border-4 border-[#0a0a0a]">
                                                <Shield className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2 w-full">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-[#ccff00] transition-colors truncate">{member.name || member.user?.name || "NOME NÃO INFORMADO"}</h3>
                                        <div className="bg-black border border-white/5 px-4 py-1.5 inline-block">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                                {member.position || "GERAL"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 space-y-4 pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                                        <span className="text-zinc-700">E-MAIL</span>
                                        <span className="text-zinc-500 truncate ml-4 max-w-[120px]">{member.user?.email || "PRIVADO"}</span>
                                    </div>

                                    {member.cache && member.cache > 0 && (
                                        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                                            <span className="text-zinc-700">CACHÊ PADRÃO</span>
                                            <span className="text-[#ccff00]">R$ {member.cache.toFixed(2)}</span>
                                        </div>
                                    )}

                                    {member.formats && member.formats.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {member.formats.map((f: any) => (
                                                <span key={f.id} className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 border border-white/5 text-zinc-400">
                                                    #{f.name.toUpperCase()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <MemberDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                member={selectedMember}
                formats={formats}
            />
        </div>
    )
}
