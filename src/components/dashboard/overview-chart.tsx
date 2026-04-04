"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ChartDataPoint {
    name: string
    total: number
}

interface DashboardOverviewChartProps {
    data: ChartDataPoint[]
}

export function DashboardOverviewChart({ data }: DashboardOverviewChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center text-zinc-500 text-sm italic">
                Aguardando dados financeiros para gerar inteligência...
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `R$${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #27272a',
                            backgroundColor: '#18181b',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'
                        }}
                        itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                        formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, "Receita"]}
                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#ef4444"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
