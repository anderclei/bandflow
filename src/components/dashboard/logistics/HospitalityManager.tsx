"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Coffee, Utensils, Zap, Plus, Trash2 } from "lucide-react"

type HospitalityItem = {
    id: string
    category: "Drink" | "Food" | "Technical"
    item: string
    quantity: string
    isFulfilled: boolean
}

export function HospitalityManager() {
    const [items, setItems] = useState<HospitalityItem[]>([
        { id: "1", category: "Drink", item: "Água mineral 500ml", quantity: "24 garrafas", isFulfilled: true },
        { id: "2", category: "Drink", item: "Energético", quantity: "6 latas", isFulfilled: false },
        { id: "3", category: "Food", item: "Frutas da estação", quantity: "1 cesta", isFulfilled: true },
        { id: "4", category: "Technical", item: "Toalhas pretas", quantity: "10 unidades", isFulfilled: false },
    ])

    const toggleFulfilled = (id: string) => {
        setItems(items.map(i => i.id === id ? { ...i, isFulfilled: !i.isFulfilled } : i))
    }

    return (
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl">Rider de Camarim (Hospitality)</CardTitle>
                        <CardDescription>Itens necessários para a banda e equipe no local do evento.</CardDescription>
                    </div>
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Novo Item
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {(["Drink", "Food", "Technical"] as const).map(category => (
                        <div key={category} className="space-y-4">
                            <div className="flex items-center gap-2">
                                {category === "Drink" && <Coffee className="h-4 w-4 text-blue-500" />}
                                {category === "Food" && <Utensils className="h-4 w-4 text-orange-500" />}
                                {category === "Technical" && <Zap className="h-4 w-4 text-yellow-500" />}
                                <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500">{category}</h4>
                            </div>

                            <div className="grid gap-2">
                                {items.filter(i => i.category === category).map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/40 group">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                checked={item.isFulfilled}
                                                onCheckedChange={() => toggleFulfilled(item.id)}
                                            />
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-medium ${item.isFulfilled ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                                    {item.item}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground">{item.quantity}</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
