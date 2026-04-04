"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

type InputChannel = {
    channel: number
    source: string
    mic: string
    insert: string
    stand: string
}

export function InputList() {
    const [channels, setChannels] = useState<InputChannel[]>([
        { channel: 1, source: "Bumbo", mic: "Beta 52/D6", insert: "Comp/Gate", stand: "Small" },
        { channel: 2, source: "Caixa Top", mic: "SM57", insert: "Comp", stand: "Small" },
        { channel: 3, source: "Caixa Bot", mic: "SM57", insert: "Gate", stand: "Small" },
        { channel: 4, source: "Hi-Hat", mic: "SM81/C451", insert: "-", stand: "Small" },
        { channel: 5, source: "Tons", mic: "E604/D2", insert: "Gate", stand: "Clip" },
    ])

    const addChannel = () => {
        const nextChannel = channels.length > 0 ? Math.max(...channels.map(c => c.channel)) + 1 : 1
        setChannels([...channels, {
            channel: nextChannel,
            source: "Novo Canal",
            mic: "-",
            insert: "-",
            stand: "-"
        }])
    }

    const removeChannel = (channelNum: number) => {
        setChannels(channels.filter(c => c.channel !== channelNum))
    }

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Lista de Inputs (Patch List)</CardTitle>
                        <CardDescription>Defina a ordem dos canais e periféricos necessários.</CardDescription>
                    </div>
                    <Button onClick={addChannel} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Adicionar Canal
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="px-0">
                <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/20">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[80px]">Canal</TableHead>
                                <TableHead>Fonte (Source)</TableHead>
                                <TableHead>Microfone/DI</TableHead>
                                <TableHead>Insert/FX</TableHead>
                                <TableHead>Suporte (Stand)</TableHead>
                                <TableHead className="text-right">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {channels.map((item) => (
                                <TableRow key={item.channel}>
                                    <TableCell className="font-bold">
                                        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center rounded-full p-0">
                                            {item.channel}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.source}</TableCell>
                                    <TableCell>{item.mic}</TableCell>
                                    <TableCell>{item.insert}</TableCell>
                                    <TableCell>{item.stand}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50/10"
                                            onClick={() => removeChannel(item.channel)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
