"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Search, Filter, Wrench, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"

type Equipment = {
    id: string
    name: string
    category: string
    brand: string
    status: "Available" | "Maintenance" | "Lost"
    value: string
}

export function AdvancedInventory() {
    const [inventory] = useState<Equipment[]>([
        { id: "1", name: "Bateria Maple Custom", category: "Instrumento", brand: "Yamaha", status: "Available", value: "R$ 15.000" },
        { id: "2", name: "Cabo XLR 10m", category: "Acessório", brand: "Santo Angelo", status: "Maintenance", value: "R$ 150" },
        { id: "3", name: "Microfone SM58", category: "Áudio", brand: "Shure", status: "Available", value: "R$ 1.200" },
        { id: "4", name: "Amplificador JCM800", category: "Amplificação", brand: "Marshall", status: "Maintenance", value: "R$ 12.000" },
    ])

    return (
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl">Inventário e Patrimônio</CardTitle>
                        <CardDescription>Controle total de equipamentos, manutenção e valores.</CardDescription>
                    </div>
                    <Button size="sm" className="gap-2 bg-secondary hover:bg-secondary/90 text-white shadow-sm rounded-xl px-4 py-1.5 transition-all">
                        <Plus className="h-4 w-4" />
                        Novo Item
                    </Button>
                </div>
                <div className="flex gap-2 pt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar equipamento..." className="pl-9 h-9" />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filtros
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-xl border border-zinc-100 dark:border-zinc-800/50 overflow-hidden bg-zinc-50/30 dark:bg-black/20">
                    <Table>
                        <TableHeader className="bg-zinc-100/50 dark:bg-zinc-900/50">
                            <TableRow className="hover:bg-transparent border-zinc-200 dark:border-zinc-800">
                                <TableHead className="font-bold">Equipamento</TableHead>
                                <TableHead className="font-bold">Categoria</TableHead>
                                <TableHead className="font-bold">Marca</TableHead>
                                <TableHead className="font-bold">Status</TableHead>
                                <TableHead className="font-bold text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.map((item) => (
                                <TableRow key={item.id} className="border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-100/30 dark:hover:bg-zinc-800/30 transition-colors">
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wide">
                                            {item.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{item.brand}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {item.status === "Available" && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                                            {item.status === "Maintenance" && <Wrench className="h-3.5 w-3.5 text-orange-500" />}
                                            {item.status === "Lost" && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
                                            <span className={`text-xs font-semibold ${item.status === "Available" ? "text-green-600" :
                                                    item.status === "Maintenance" ? "text-orange-600" : "text-red-600"
                                                }`}>
                                                {item.status === "Available" ? "Disponível" :
                                                    item.status === "Maintenance" ? "Manutenção" : "Extraviado"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold text-sm">{item.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
