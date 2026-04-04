"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend } from 'recharts';

export function DashboardCharts({ historicalData }: { historicalData: any[] }) {
    if (!historicalData || historicalData.length === 0) return null;

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* MRR Growth Chart */}
            <div className="border border-white/5 bg-zinc-900/30 p-8">
                <div className="mb-8">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Revenue Evolution (MRR)</h3>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase mt-2 tracking-widest">Monthly simulation based on active nodes</p>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historicalData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                             <defs>
                                <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ccff00" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ccff00" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#3f3f46', fontWeight: 900 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#3f3f46', fontWeight: 900 }} tickFormatter={(value) => `R$${value}`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0', fontSize: '10px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}
                                formatter={(value: any) => [`R$ ${Number(value || 0).toFixed(2)}`, 'MRR']}
                            />
                            <Area type="monotone" dataKey="mrr" stroke="#ccff00" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* User Growth vs Churn Chart */}
            <div className="border border-white/5 bg-zinc-900/30 p-8">
                <div className="mb-8">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Cluster Health</h3>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase mt-2 tracking-widest">Active Licenses vs Connection Termination</p>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={historicalData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#3f3f46', fontWeight: 900 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#3f3f46', fontWeight: 900 }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0', fontSize: '10px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}
                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', paddingTop: '20px', letterSpacing: '0.1em' }} />
                            <Bar dataKey="ativos" name="Active" fill="#ccff00" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="churn" name="Lost" fill="#27272a" radius={[0, 0, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
