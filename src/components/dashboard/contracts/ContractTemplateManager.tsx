"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VisualContractEditor } from "./VisualContractEditor"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Wand2, Info, FileSignature, Calculator } from "lucide-react"

export function ContractTemplateManager() {
    const [contractContent, setContractContent] = useState(`
        <h1 style="text-align: center">CONTRATO DE PRESTAÇÃO DE SERVIÇOS MUSICAIS</h1>
        <p></p>
        <p>CONTRATADA: {{nome_da_banda}}</p>
        <p>CONTRATANTE: {{nome_contratante}}</p>
        <p></p>
        <p>Pelo presente instrumento particular, as partes acima identificadas têm entre si justo e acertado o presente contrato conforme as cláusulas abaixo:</p>
        <p></p>
        <h3>CLÁUSULA 1 - DO OBJETO</h3>
        <p>A CONTRATADA se compromete a realizar apresentação musical no evento {{nome_evento}}, na cidade de {{cidade}}, no dia {{data_show}}.</p>
        <p></p>
        <h3>CLÁUSULA 2 - DO VALOR</h3>
        <p>O valor total acordado para a prestação dos serviços é de {{valor_cache}}.</p>
    `)

    const [budgetContent, setBudgetContent] = useState(`
        <h1 style="text-align: center">PROPOSTA DE ORÇAMENTO MUSICAL</h1>
        <p></p>
        <p>BANDA: {{nome_da_banda}}</p>
        <p>CLIENTE: {{nome_contratante}}</p>
        <p></p>
        <p>Agradecemos o interesse em nosso trabalho para o evento <strong>{{nome_evento}}</strong> em {{cidade}}.</p>
        <p></p>
        <h3>PROPOSTA COMERCIAL</h3>
        <p>Data sugerida: {{data_show}}</p>
        <p>Valor do Cachê Artístico: <strong>{{valor_cache}}</strong></p>
        <p></p>
        <p>Aguardamos seu retorno para darmos prosseguimento à contratação.</p>
    `)

    const [exclusivityContent, setExclusivityContent] = useState(`
        <h1 style="text-align: center">CARTA DE EXCLUSIVIDADE</h1>
        <p></p>
        <p>Declaramos para os devidos fins de direito prestação de contas, de acordo com o inciso III c/c art. 25 da Lei nº 8.666/93 e Lei 14.133/21, que o artista/banda <strong>{{nome_da_banda}}</strong> é representado de forma EXCLUSIVA pela empresa <strong>{{nome_contratante}}</strong> para fins de comercialização de seus espetáculos musicais.</p>
        <p></p>
        <p>Por ser verdade, firmamos a presente.</p>
        <p></p>
        <p>Data de emissão: {{data_show}}</p>
    `)

    const placeholders = [
        { key: "{{nome_da_banda}}", label: "Nome da Banda" },
        { key: "{{nome_contratante}}", label: "Nome do Contratante" },
        { key: "{{valor_cache}}", label: "Valor do Cachê" },
        { key: "{{data_show}}", label: "Data do Show" },
        { key: "{{nome_evento}}", label: "Nome do Evento" },
        { key: "{{cidade}}", label: "Cidade" },
    ]

    return (
        <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
                <Tabs defaultValue="contract" className="w-full">
                    <TabsList className="mb-4 bg-black border border-white/5 p-1 rounded-none">
                        <TabsTrigger
                            value="contract"
                            className="rounded-none data-[state=active]:bg-[#ccff00] data-[state=active]:text-black flex gap-2 font-black uppercase text-[10px] tracking-widest"
                        >
                            <FileSignature className="h-4 w-4" />
                            Contrato
                        </TabsTrigger>
                        <TabsTrigger
                            value="budget"
                            className="rounded-none data-[state=active]:bg-[#ccff00] data-[state=active]:text-black flex gap-2 font-black uppercase text-[10px] tracking-widest"
                        >
                            <Calculator className="h-4 w-4" />
                            Orçamento
                        </TabsTrigger>
                        <TabsTrigger
                            value="exclusivity"
                            className="rounded-none data-[state=active]:bg-[#ccff00] data-[state=active]:text-black flex gap-2 font-black uppercase text-[10px] tracking-widest"
                        >
                            <FileText className="h-4 w-4" />
                            Exclusividade
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="contract" className="mt-0">
                        <VisualContractEditor
                            initialContent={contractContent}
                            onSave={(html) => {
                                console.log("Saving Contract HTML:", html)
                                alert("Modelo salvo")
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="budget" className="mt-0">
                        <VisualContractEditor
                            initialContent={budgetContent}
                            onSave={(html) => {
                                console.log("Saving Budget HTML:", html)
                                alert("Modelo salvo")
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="exclusivity" className="mt-0">
                        <VisualContractEditor
                            initialContent={exclusivityContent}
                            onSave={(html) => {
                                console.log("Saving Exclusivity HTML:", html)
                                alert("Modelo salvo")
                            }}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <div className="space-y-6">
                <Card className="bg-zinc-900/40 border-white/5 rounded-none">
                    <CardHeader>
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-2">
                            <Wand2 className="h-4 w-4 text-[#ccff00]" />
                            CAMPOS DINÂMICOS
                        </CardTitle>
                        <CardDescription className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
                            ESTES CAMPOS SERÃO PREENCHIDOS AUTOMATICAMENTE.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {placeholders.map((p) => (
                            <button
                                key={p.key}
                                className="w-full flex items-center justify-between p-3 rounded-none border border-white/5 bg-black hover:border-[#ccff00]/40 text-left transition-all group"
                            >
                                <span className="text-[10px] font-mono text-[#ccff00] font-black tracking-widest">{p.key}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white">{p.label}</span>
                            </button>
                        ))}

                        <div className="mt-6 p-4 rounded-none bg-[#ccff00]/5 border border-[#ccff00]/20 flex gap-4 text-[#ccff00]">
                            <Info className="h-4 w-4 shrink-0" />
                            <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
                                Clique para copiar ou arraste para o editor. Eles serão substituídos pelos dados reais.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/40 border-white/5 rounded-none">
                    <CardHeader>
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[#ccff00]" />
                            EXPORTAÇÃO & ASSINATURA
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full text-[9px] font-black uppercase tracking-widest h-12 justify-start gap-4 rounded-none border-white/5 bg-black hover:bg-white hover:text-black transition-all">
                            <FileText className="h-4 w-4" />
                            Exportar para PDF
                        </Button>
                        <Button variant="outline" className="w-full text-[9px] font-black uppercase tracking-widest h-12 justify-start gap-4 rounded-none border-white/5 bg-black hover:bg-white hover:text-black transition-all">
                            <FileText className="h-4 w-4 text-[#ccff00]" />
                            Exportar para Word (.docx)
                        </Button>
                        <Button variant="default" className="w-full text-[9px] font-black uppercase tracking-widest h-12 justify-start gap-4 bg-[#ccff00] text-black hover:bg-white transition-all rounded-none border-0">
                            <Wand2 className="h-4 w-4" />
                            Solicitar Assinatura
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
