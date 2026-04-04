"use client";

import { FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef, useState } from "react";

interface GigContractProps {
    gig: any;
    bandName: string;
}

export function GigContract({ gig, bandName }: GigContractProps) {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = async () => {
        if (!componentRef.current) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(componentRef.current, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            // A4 dimensions in mm
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`contrato-${bandName.replace(/\s+/g, '-').toLowerCase()}-${gig.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Erro ao gerar o PDF. Tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="flex items-center gap-4 px-6 h-12 text-[10px] font-black uppercase tracking-widest text-[#ccff00] bg-black border border-[#ccff00]/20 hover:border-[#ccff00] hover:bg-[#ccff00]/5 transition-all disabled:opacity-50 rounded-none shadow-[0_0_20px_rgba(204,255,0,0.05)]"
            >
                {isGenerating ? (
                    <span className="w-4 h-4 border-2 border-[#ccff00] border-t-transparent animate-spin" />
                ) : (
                    <Download className="h-4 w-4" />
                )}
                BAIXAR CONTRATO (PDF)
            </button>

            {/* Hidden template for the PDF */}
            <div className="absolute left-[-9999px] top-[-9999px]">
                <div
                    ref={componentRef}
                    className="w-[800px] bg-white p-12 text-black"
                    style={{ fontFamily: 'sans-serif' }}
                >
                    <div className="border-b-2 border-black pb-6 mb-8 text-center">
                        <h1 className="text-3xl font-black uppercase tracking-wider">{bandName}</h1>
                        <h2 className="text-xl text-gray-600 mt-2">Contrato de Apresentação Musical</h2>
                    </div>

                    <div className="space-y-6 text-lg leading-relaxed">
                        <p>
                            Pelo presente instrumento particular, acordam as partes sobre a apresentação musical da banda <strong>{bandName}</strong>.
                        </p>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="font-bold text-xl mb-4 border-b border-gray-300 pb-2">Detalhes do Evento</h3>
                            <p><strong>Evento:</strong> {gig.title}</p>
                            <p><strong>Data:</strong> {new Date(gig.date).toLocaleDateString('pt-BR')}</p>
                            <p><strong>Local:</strong> {gig.location || "A definir"}</p>

                            {gig.contractor && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h4 className="font-bold text-lg mb-2">Dados do Contratante</h4>
                                    <p><strong>Nome/Razão Social:</strong> {gig.contractor.name}</p>
                                    <p><strong>Email:</strong> {gig.contractor.email}</p>
                                    <p><strong>Telefone:</strong> {gig.contractor.phone || "Não informado"}</p>
                                </div>
                            )}

                            <p className="text-xl mt-4 border-t border-gray-300 pt-4">
                                <strong>Cachê Acordado:</strong> {gig.fee ? gig.fee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "A Combinar"}
                            </p>
                        </div>

                        {(gig.loadIn || gig.soundcheck || gig.showtime || gig.notes) && (
                            <div className="pt-6">
                                <h3 className="font-bold text-xl mb-4 border-b border-gray-300 pb-2">Cronograma e Responsabilidades (Rider Téc.)</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    {gig.loadIn && <li><strong>Load-in (Chegada):</strong> {new Date(gig.loadIn).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</li>}
                                    {gig.soundcheck && <li><strong>Passagem de Som:</strong> {new Date(gig.soundcheck).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</li>}
                                    {gig.showtime && <li><strong>Início do Show:</strong> {new Date(gig.showtime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</li>}
                                    {gig.notes && <li className="mt-4 break-words"><strong>Notas Adicionais:</strong> {gig.notes}</li>}
                                </ul>
                            </div>
                        )}

                        <div className="pt-24 mt-40 grid grid-cols-2 gap-12 text-center">
                            <div>
                                <div className="border-t border-black pt-2">
                                    <p className="font-bold">Contratante / Local</p>
                                    <p className="text-sm text-gray-500">Assinatura</p>
                                </div>
                            </div>
                            <div>
                                <div className="border-t border-black pt-2">
                                    <p className="font-bold">{bandName}</p>
                                    <p className="text-sm text-gray-500">Assinatura do Representante</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
