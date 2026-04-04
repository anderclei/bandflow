"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar } from 'recharts';
import { TrendingUp, BarChart3, Zap, Terminal } from "lucide-react";

interface BillingChartsProps {
    mrrData: any[];
    conversionData: any[];
}

export function BillingCharts({ mrrData, conversionData }: BillingChartsProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-zinc-900/30 border border-white/5 p-8 relative overflow-hidden group">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                            <Zap className="w-4 h-4 text-[#ccff00]" /> 
                            Revenue Stream (MRR)
                        </h3>
                        <p className="text-[8px] text-zinc-600 font-bold uppercase mt-2 tracking-widest leading-none">6-month growth acceleration protocol</p>
                    </div>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mrrData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMrrBilling" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ccff00" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ccff00" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#3f3f46" fontSize={10} fontWeight={900} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#3f3f46" fontSize={10} fontWeight={900} tickLine={false} axisLine={false} tickFormatter={(value: any) => `R$${value}`} />
                            <RechartsTooltip 
                                formatter={(value: number | undefined) => [value ? formatCurrency(value) : "R$ 0,00", "MRR"]}
                                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0', fontSize: '10px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}
                            />
                            <Area type="monotone" dataKey="mrr" stroke="#ccff00" strokeWidth={3} fillOpacity={1} fill="url(#colorMrrBilling)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-zinc-900/30 border border-white/5 p-8 relative overflow-hidden group">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-zinc-600" /> 
                            Trial Conversion Rate
                        </h3>
                        <p className="text-[8px] text-zinc-600 font-bold uppercase mt-2 tracking-widest leading-none">Data acquisition vs license activation</p>
                    </div>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={conversionData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#3f3f46" fontSize={10} fontWeight={900} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#3f3f46" fontSize={10} fontWeight={900} tickLine={false} axisLine={false} />
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0', fontSize: '10px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}
                                cursor={{fill: 'rgba(255,255,255,0.02)'}}
                            />
                            <Bar dataKey="trials" name="New Trials" fill="#27272a" radius={[0, 0, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="conversao" name="Converted" fill="#ccff00" radius={[0, 0, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
