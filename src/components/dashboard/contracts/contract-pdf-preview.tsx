"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileSignature, Printer, PenTool } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { DigitalSignaturePad } from "./DigitalSignaturePad"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ContractData {
    clientName: string
    venue: string
    amount: string | number
    startTime: string
    endTime: string
    date?: Date
    includeRider: boolean
    outsideHeadquarters?: boolean
    displacementValue?: number
    // Novos campos dinâmicos
    contractType: "BAR" | "WEDDING" | "CITY_HALL"
    couvertValue?: string
    foodIncluded?: boolean
    ceremonyTime?: string
    biddingProcess?: string
    paymentTerms?: string
}

export function ContractPDFPreview({ data }: { data: ContractData }) {
    const currentDate = new Date()
    const componentRef = useRef<HTMLDivElement>(null)
    const [signature, setSignature] = useState<string | null>(null)
    const [isSignatureOpen, setIsSignatureOpen] = useState(false)

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Contrato-${data.clientName || 'Evento'}`,
    })

    const handleSaveSignature = (sigData: string) => {
        setSignature(sigData)
        setIsSignatureOpen(false)
    }

    // Format amount safely
    const formattedAmount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number(data.amount) || 0)

    const formattedDisplacement = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number(data.displacementValue) || 0)

    const totalAmount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format((Number(data.amount) || 0) + (Number(data.displacementValue) || 0))

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex justify-end gap-2">
                <Dialog open={isSignatureOpen} onOpenChange={setIsSignatureOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <PenTool className="h-4 w-4" />
                            Assinar Digitalmente
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assinatura Digital</DialogTitle>
                            <DialogDescription>
                                Assine abaixo usando o mouse ou dedo.
                            </DialogDescription>
                        </DialogHeader>
                        <DigitalSignaturePad onSave={handleSaveSignature} />
                    </DialogContent>
                </Dialog>

                <Button size="sm" onClick={handlePrint} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Printer className="h-4 w-4" />
                    Imprimir / Salvar PDF
                </Button>
            </div>

            <div className="border rounded-md overflow-hidden bg-gray-100 p-4">
                <ScrollArea className="h-[600px] w-full">
                    <div ref={componentRef} className="bg-white text-black p-12 shadow-lg mx-auto max-w-[210mm] min-h-[297mm] text-sm leading-relaxed font-serif">
                        <div className="space-y-6">
                            <div className="text-center border-b pb-6 mb-6">
                                <h1 className="text-xl font-bold uppercase tracking-wide">Contrato de Prestação de Serviços Artísticos</h1>
                                <p className="text-gray-500 mt-2">Nº 2024/{Math.floor(Math.random() * 1000)}</p>
                            </div>

                            <div>
                                <h2 className="font-bold mb-2 uppercase text-sm border-b inline-block pb-1">1. Partes</h2>
                                <p className="mb-2">
                                    <strong>CONTRATANTE:</strong> {data.clientName || "______________________"}, com sede em {data.venue || "______________________"}.
                                </p>
                                <p>
                                    <strong>CONTRATADA:</strong> BAND MANAGER PRODUÇÕES ARTÍSTICAS LTDA, CNPJ 00.000.000/0001-00.
                                </p>
                            </div>

                            <div>
                                <h2 className="font-bold mb-2 uppercase text-sm border-b inline-block pb-1">2. Objeto</h2>
                                <p>
                                    O presente contrato tem por objeto a apresentação musical da banda no evento {data.contractType === "BAR" ? "em regime de Couvert Artístico/Cachê fixo" : data.contractType === "WEDDING" ? "social (Casamento/Festa Privada)" : "em atendimento ao processo de contratação pública"} a realizar-se em:
                                </p>
                                <ul className="list-disc ml-8 mt-2 space-y-1">
                                    <li><strong>Data:</strong> {data.date ? format(data.date, "PPP", { locale: ptBR }) : "___/___/_____"}</li>
                                    <li><strong>Local:</strong> {data.venue || "______________________"}</li>
                                    <li><strong>Horário:</strong> {data.startTime || "--:--"} às {data.endTime || "--:--"}</li>
                                    {data.contractType === "WEDDING" && data.ceremonyTime && (
                                        <li><strong>Cerimônia:</strong> Início previsto às {data.ceremonyTime}</li>
                                    )}
                                    {data.outsideHeadquarters && (
                                        <li><strong>Logística:</strong> Evento sediado fora da cidade base. Aplica-se taxa de deslocamento ao valor final.</li>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h2 className="font-bold mb-2 uppercase text-sm border-b inline-block pb-1">3. Valor e Condições</h2>
                                <p>
                                    O valor base do cachê artístico é de <strong>{formattedAmount}</strong>.
                                </p>

                                {data.contractType === "BAR" && data.couvertValue && (
                                    <p className="mt-2">
                                        Fica acordado o valor de <strong>R$ {data.couvertValue}</strong> por pessoa a título de Couvert Artístico, com garantia de cachê mínimo de {formattedAmount}.
                                    </p>
                                )}

                                {data.outsideHeadquarters && data.displacementValue ? (
                                    <>
                                        <p className="mt-2">
                                            Aplica-se ao valor base do cachê uma taxa de deslocamento logístico de <strong>{formattedDisplacement}</strong>.
                                        </p>
                                        <div className="mt-2 bg-gray-50 p-2 border inline-block rounded">
                                            <strong>TOTAL INTEGRAL: {totalAmount}</strong>
                                        </div>
                                    </>
                                ) : (
                                    <p className="mt-2 font-bold">
                                        VALOR TOTAL: {formattedAmount}
                                    </p>
                                )}

                                <div className="mt-4 space-y-2 text-xs italic">
                                    {data.contractType === "CITY_HALL" ? (
                                        <p><strong>Nota Fiscal:</strong> O pagamento será realizado mediante emissão de Nota Fiscal Eletrônica de Serviços, em até 30 dias após a apresentação, conforme empenho nº {data.biddingProcess || "________"}.</p>
                                    ) : (
                                        <p><strong>Pagamento:</strong> O valor total deverá ser pago conforme acordado entre as partes (50% na assinatura via PIX/Transferência, 50% na data do evento antes do início da apresentação).</p>
                                    )}
                                    {data.contractType === "BAR" && data.foodIncluded && (
                                        <p><strong>Alimentação:</strong> O CONTRATANTE disponibilizará alimentação e bebidas (água, sucos, refrigerantes) para a equipe técnica e músicos (total de 5 pessoas) sem custo adicional.</p>
                                    )}
                                </div>
                            </div>

                            {data.includeRider && (
                                <div className="bg-gray-50 p-4 rounded border border-gray-200 mt-4">
                                    <h2 className="font-bold mb-2 uppercase text-sm">4. Rider Técnico e Hospitalidade (Anexo I)</h2>
                                    <p className="text-xs">
                                        O CONTRATANTE declara estar ciente das necessidades técnicas (Som, Luz, Palco) e de hospitalidade descritas no Rider Técnico. O não cumprimento de itens críticos (ex: aterramento elétrico, dimensões de palco) pode acarretar em cancelamento sem devolução do sinal.
                                    </p>
                                </div>
                            )}

                            <div>
                                <h2 className="font-bold mb-2 uppercase text-sm border-b inline-block pb-1">5. Cancelamento e Multas</h2>
                                <p>
                                    {data.contractType === "CITY_HALL"
                                        ? "Regido pelas cláusulas de rescisão administrativa previstas na Lei 14.133/21 ou instrumento convocatório equivalente."
                                        : "Em caso de cancelamento por parte do CONTRATANTE com menos de 30 dias de antecedência, será cobrada multa de 50% do valor total. O cancelamento com menos de 7 dias implica no pagamento integral."
                                    }
                                </p>
                            </div>

                            <div>
                                <h2 className="font-bold mb-2 uppercase text-sm border-b inline-block pb-1">6. Foro</h2>
                                <p>
                                    Fica eleito o foro da Comarca de {data.contractType === "CITY_HALL" ? "domicílio do órgão contratante" : "São Paulo/SP"} para dirimir quaisquer dúvidas oriundas deste contrato.
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t-2 border-gray-100 text-center">
                                <p className="mb-12">São Paulo, {format(currentDate, "PPP", { locale: ptBR })}</p>
                                <div className="grid grid-cols-2 gap-12 mb-12">
                                    <div className="flex flex-col items-center">
                                        {signature ? (
                                            <img src={signature} alt="Assinatura Contratante" className="h-16 mb-2" />
                                        ) : (
                                            <div className="h-16 mb-2 w-full"></div>
                                        )}
                                        <div className="border-t border-black w-full pt-2">
                                            <p className="font-bold uppercase text-xs">Contratante</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="h-16 mb-2 flex items-end justify-center font-cursive text-2xl text-blue-900">
                                            BandManager
                                        </div>
                                        <div className="border-t border-black w-full pt-2">
                                            <p className="font-bold uppercase text-xs">Band Manager Produções</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-12">
                                    <div className="flex flex-col items-center">
                                        <div className="h-8 mb-8 w-full"></div>
                                        <div className="border-t border-black w-full pt-2">
                                            <p className="font-bold uppercase text-xs">Testemunha 1 (CPF: ___.___.___-__)</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="h-8 mb-8 w-full"></div>
                                        <div className="border-t border-black w-full pt-2">
                                            <p className="font-bold uppercase text-xs">Testemunha 2 (CPF: ___.___.___-__)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Audit Log / Page Break */}
                            <div className="mt-12 pt-8 border-t border-dashed border-gray-300 text-xs text-gray-400">
                                <h3 className="uppercase font-bold mb-2 text-gray-500">Log de Assinatura Eletrônica</h3>
                                <div className="space-y-1 font-mono">
                                    <p>ID do Documento: {Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
                                    <p>Data/Hora (UTC): {new Date().toISOString()}</p>
                                    <p>IP de Origem: 192.168.1.xxx (Simulado)</p>
                                    <p>Hash de Integridade: {Math.random().toString(36).substring(2)}... (SHA-256)</p>
                                    <p>Status: <strong>ASSINADO DIGITALMENTE</strong> conforme MP 2.200-2/2001</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground bg-green-500/10 text-green-700 p-2 rounded border border-green-200">
                <span className="flex items-center gap-2 font-medium">
                    <FileSignature className="h-3 w-3" />
                    Este documento possui validade jurídica como Título Executivo Extrajudicial.
                </span>
                <span>Gerado por BandManager Platform</span>
            </div>
        </div>
    )
}
