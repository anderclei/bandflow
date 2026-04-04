"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight } from "lucide-react"

const data = [
    { name: 'Jan', revenue: 4000, costs: 2400 },
    { name: 'Fev', revenue: 3000, costs: 1398 },
    { name: 'Mar', revenue: 2000, costs: 9800 },
    { name: 'Abr', revenue: 2780, costs: 3908 },
    { name: 'Mai', revenue: 1890, costs: 4800 },
    { name: 'Jun', revenue: 2390, costs: 3800 },
]

export function AdvancedFinancialDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Faturamento Bruto</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black italic">R$ 45.231,89</div>
                        <p className="text-xs text-green-500 flex items-center gap-1 mt-1 font-bold">
                            <TrendingUp className="h-3 w-3" /> +20.1% em relação ao mês anterior
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Custos Totais</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black italic">R$ 12.432,00</div>
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-bold">
                            <TrendingUp className="h-3 w-3" /> +4% em relação ao mês anterior
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Lucro Líquido</CardTitle>
                        <PieChart className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black italic">R$ 32.799,89</div>
                        <Badge variant="secondary" className="mt-1 bg-blue-500/10 text-blue-500 border-none font-bold">Margem: 72%</Badge>
                    </CardContent>
                </Card>
                <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Ticket Médio</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black italic">R$ 8.500,00</div>
                        <p className="text-xs text-muted-foreground mt-1">Baseado em 6 shows no mês</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Fluxo de Caixa (6 Meses)</CardTitle>
                        <CardDescription>Visão comparativa entre faturamento e custos operacionais.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#80808020" />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="costs" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Próximos Pagamentos</CardTitle>
                        <CardDescription>Custos fixos e cachês pendentes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Aluguel Van", date: "Em 2 dias", amount: "R$ 1.200", status: "Pendente" },
                                { name: "Marketing Digital", date: "Em 5 dias", amount: "R$ 500", status: "Agendado" },
                                { name: "Cachê Roadie 01", date: "Amanhã", amount: "R$ 350", status: "Urgente" },
                                { name: "Energia Estúdio", date: "Em 10 dias", amount: "R$ 280", status: "Agendado" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black">{item.amount}</p>
                                        <Badge variant="outline" className={`text-[10px] mt-1 ${item.status === "Urgente" ? "text-red-500 border-red-500/20 bg-red-500/5" : "text-muted-foreground"
                                            }`}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
