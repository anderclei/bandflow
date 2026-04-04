"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle2, Info } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
    StageItem,
    StageItemIcon
} from '../StagePlotAssets';

import { InputChannel } from "../InputListEditor";
import { TechSpecs } from "../TechSpecsEditor";

interface Format {
    id: string;
    name: string;
    stagePlot?: string | null;
    inputList?: string | null;
    techSpecs?: string | null;
}

interface RiderGeneratorProps {
    formats: Format[];
    bandName: string;
    equipment?: any[]; // Kept for compatibility, but not used in the manual view
}

export function RiderGenerator({ formats, bandName }: RiderGeneratorProps) {
    const [selectedFormatId, setSelectedFormatId] = useState<string>(formats[0]?.id || "");
    const [isGenerating, setIsGenerating] = useState(false);

    const activeFormat = formats.find(f => f.id === selectedFormatId);

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const element = document.getElementById("rider-document");
            if (!element) return;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff"
            });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

            // If height exceeds A4, this simple version might squash it. 
            // In a production app you'd iterate through canvas slices.
            // But for now, we'll aim for a single-page high-density document or multiple adds if needed.

            pdf.save(`Rider_Tecnico_${bandName.replace(/\s+/g, '_')}_${activeFormat?.name}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Erro ao gerar o PDF. Tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    };

    const parseInputList = (data?: string | null): InputChannel[] => {
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    };

    const parseTechSpecs = (data?: string | null): TechSpecs | null => {
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    };

    const inputList = parseInputList(activeFormat?.inputList);
    const techSpecs = parseTechSpecs(activeFormat?.techSpecs);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-red-500" />
                        Gerar Documentação PDF
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Exporte o Rider completo concatenando Mapa, Input List e Specs.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating || !activeFormat}
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-900/20 disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        {isGenerating ? "Processando..." : "Baixar PDF Oficial"}
                    </button>
                </div>
            </div>

            {/* Document Preview Rendering */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/10">
                <div className="p-4 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Visualização do Documento</span>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-zinc-700" />
                        <div className="w-2 h-2 rounded-full bg-zinc-700" />
                        <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    </div>
                </div>

                <div className="p-8 flex justify-center bg-zinc-950/50 overflow-x-auto">
                    {/* The Actual Document ID for html2canvas */}
                    <div
                        id="rider-document"
                        className="bg-white text-black p-16 shadow-2xl origin-top transition-transform"
                        style={{ width: "210mm", minHeight: "297mm", fontSize: "12pt" }}
                    >
                        {/* Header */}
                        <div className="border-b-4 border-black pb-8 mb-10 flex justify-between items-end">
                            <div>
                                <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2">{bandName}</h1>
                                <p className="text-xl font-bold text-zinc-500 uppercase tracking-[0.2em]">Rider Técnico Oficial</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold uppercase text-zinc-400">Formato de Show</p>
                                <p className="text-2xl font-black text-red-600">{activeFormat?.name}</p>
                            </div>
                        </div>

                        {/* 1. Stage Plot Section */}
                        {(() => {
                            if (!activeFormat?.stagePlot) return null;
                            try {
                                const plotItems = JSON.parse(activeFormat.stagePlot) as StageItem[];
                                if (plotItems.length === 0) return null;

                                return (
                                    <div className="mb-16 break-inside-avoid">
                                        <div className="bg-black text-white px-4 py-2 mb-6 inline-block skew-x-[-12deg]">
                                            <h2 className="text-2xl font-black uppercase skew-x-[12deg]">01. Mapa de Palco</h2>
                                        </div>

                                        <div className="w-full h-[550px] border-2 border-zinc-900 relative bg-zinc-50 overflow-hidden mx-auto">
                                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                                            <div className="absolute top-0 left-0 right-0 bg-zinc-200/50 py-1 border-b border-zinc-400 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Fundo / Backstage</div>
                                            <div className="absolute bottom-0 left-0 right-0 h-10 border-t-4 border-zinc-900 bg-zinc-200/50 flex items-center justify-center font-black uppercase tracking-[0.5em] text-xs text-zinc-600">Público</div>

                                            {plotItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                                                    style={{ left: item.x, top: item.y }}
                                                >
                                                    <div
                                                        className="flex items-center justify-center text-black mb-1 drop-shadow-sm"
                                                        style={{
                                                            transform: `rotate(${item.rotation || 0}deg) scale(${item.scale || 1})`,
                                                        }}
                                                    >
                                                        <StageItemIcon type={item.type} />
                                                    </div>
                                                    <div className="bg-white border border-black text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap uppercase tracking-tighter" style={{ transform: `translateY(${(item.scale || 1) * 8}px)` }}>
                                                        {item.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            } catch (e) { return null; }
                        })()}

                        {/* 2. Input List Section */}
                        {inputList.length > 0 && (
                            <div className="mb-16 break-inside-avoid">
                                <div className="bg-black text-white px-4 py-2 mb-6 inline-block skew-x-[-12deg]">
                                    <h2 className="text-2xl font-black uppercase skew-x-[12deg]">02. Input List</h2>
                                </div>
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-y-2 border-black bg-zinc-50">
                                            <th className="py-3 px-2 text-left font-black w-14">CH</th>
                                            <th className="py-3 px-2 text-left font-black">Instrumento</th>
                                            <th className="py-3 px-2 text-left font-black">Microfone / DI</th>
                                            <th className="py-3 px-2 text-left font-black">Insert / FX</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inputList.map((ch, idx) => (
                                            <tr key={ch.id} className={`border-b border-zinc-200 ${idx % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}`}>
                                                <td className="py-3 px-2 font-mono font-bold text-red-600">{ch.channel}</td>
                                                <td className="py-3 px-2 font-bold uppercase">{ch.instrument}</td>
                                                <td className="py-3 px-2 text-zinc-600">{ch.mic}</td>
                                                <td className="py-3 px-2 text-zinc-600">{ch.insert}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* 3. Tech Specs Section */}
                        {techSpecs && (
                            <div className="space-y-12">
                                <div className="break-inside-avoid">
                                    <div className="bg-black text-white px-4 py-2 mb-6 inline-block skew-x-[-12deg]">
                                        <h2 className="text-2xl font-black uppercase skew-x-[12deg]">03. Som & Monitoração</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {techSpecs.paSystem && (
                                            <div>
                                                <h4 className="font-black uppercase text-sm text-zinc-400 mb-2">Sistema de PA</h4>
                                                <p className="bg-zinc-50 p-4 border-l-4 border-black whitespace-pre-wrap">{techSpecs.paSystem}</p>
                                            </div>
                                        )}
                                        {techSpecs.monitorSystem && (
                                            <div>
                                                <h4 className="font-black uppercase text-sm text-zinc-400 mb-2">Monitoração</h4>
                                                <p className="bg-zinc-50 p-4 border-l-4 border-black whitespace-pre-wrap">{techSpecs.monitorSystem}</p>
                                            </div>
                                        )}
                                        {techSpecs.console && (
                                            <div>
                                                <h4 className="font-black uppercase text-sm text-zinc-400 mb-2">Console</h4>
                                                <p className="bg-zinc-50 p-4 border-l-4 border-black whitespace-pre-wrap">{techSpecs.console}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="break-inside-avoid">
                                    <div className="bg-black text-white px-4 py-2 mb-6 inline-block skew-x-[-12deg]">
                                        <h2 className="text-2xl font-black uppercase skew-x-[12deg]">04. Backline Requerido</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {techSpecs.backlineDrum && (
                                            <div>
                                                <h4 className="font-black uppercase text-sm text-zinc-400 mb-2">Bateria</h4>
                                                <p className="bg-zinc-50 p-4 border-l-4 border-black whitespace-pre-wrap">{techSpecs.backlineDrum}</p>
                                            </div>
                                        )}
                                        {techSpecs.backlineAmps && (
                                            <div>
                                                <h4 className="font-black uppercase text-sm text-zinc-400 mb-2">Amplificadores</h4>
                                                <p className="bg-zinc-50 p-4 border-l-4 border-black whitespace-pre-wrap">{techSpecs.backlineAmps}</p>
                                            </div>
                                        )}
                                        {techSpecs.backlineOther && (
                                            <div>
                                                <h4 className="font-black uppercase text-sm text-zinc-400 mb-2">Outras Necessidades</h4>
                                                <p className="bg-zinc-50 p-4 border-l-4 border-black whitespace-pre-wrap">{techSpecs.backlineOther}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-20 pt-10 border-t-2 border-zinc-200 text-center">
                            <p className="text-zinc-400 text-xs italic tracking-widest uppercase mb-4">Documento gerado automaticamente via BandFlow ERP Premium</p>
                            <div className="flex justify-center gap-20">
                                <div className="w-48 border-t border-black pt-2">
                                    <p className="text-[10px] font-bold uppercase">Produção Técnica</p>
                                </div>
                                <div className="w-48 border-t border-black pt-2">
                                    <p className="text-[10px] font-bold uppercase">Contratante / Local</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-zinc-500 bg-zinc-900/20 p-4 rounded-xl border border-zinc-800">
                <Info className="h-4 w-4" />
                <p className="text-xs italic">O PDF é gerado a partir dos dados salvos nas abas anteriores. Certifique-se de salvar suas mudanças.</p>
            </div>
        </div>
    );
}
