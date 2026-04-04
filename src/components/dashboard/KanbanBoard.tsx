"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, Calendar, User, LayoutGrid } from "lucide-react"
import { DndContext, DragEndEvent, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type Task = {
    id: string
    title: string
    priority: "Low" | "Medium" | "High"
    assignee: string
    dueDate: string
}

type Column = {
    id: string
    title: string
    tasks: Task[]
}

export function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([
        {
            id: "todo",
            title: "A Fazer",
            tasks: [
                { id: "1", title: "Enviar Rider Técnico", priority: "High", assignee: "Roadie", dueDate: "10 Mar" },
                { id: "2", title: "Confirmar Hotel", priority: "Medium", assignee: "Produtor", dueDate: "12 Mar" },
            ]
        },
        {
            id: "doing",
            title: "Em Andamento",
            tasks: [
                { id: "3", title: "Fechamento de Contrato", priority: "High", assignee: "Vocalista", dueDate: "05 Mar" },
            ]
        },
        {
            id: "done",
            title: "Concluído",
            tasks: [
                { id: "4", title: "Reserva de Van", priority: "Low", assignee: "Baterista", dueDate: "01 Mar" },
            ]
        }
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        // Find the columns
        const sourceCol = columns.find(col => col.tasks.some(t => t.id === activeId))
        const destCol = columns.find(col => col.id === overId || col.tasks.some(t => t.id === overId))

        if (!sourceCol || !destCol) return

        if (sourceCol.id === destCol.id) {
            const oldIndex = sourceCol.tasks.findIndex(t => t.id === activeId)
            const newIndex = sourceCol.tasks.findIndex(t => t.id === overId)

            const newTasks = arrayMove(sourceCol.tasks, oldIndex, newIndex)
            setColumns(columns.map(col => col.id === sourceCol.id ? { ...col, tasks: newTasks } : col))
        } else {
            const task = sourceCol.tasks.find(t => t.id === activeId)!
            const newSourceTasks = sourceCol.tasks.filter(t => t.id !== activeId)
            const newDestTasks = [...destCol.tasks, task]

            setColumns(columns.map(col => {
                if (col.id === sourceCol.id) return { ...col, tasks: newSourceTasks }
                if (col.id === destCol.id) return { ...col, tasks: newDestTasks }
                return col
            }))
        }
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar min-h-[600px]">
                {columns.map((column) => (
                    <div key={column.id} className="flex flex-col gap-4 min-w-[320px] max-w-[320px]">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-500">{column.title}</h3>
                                <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold border-none">
                                    {column.tasks.length}
                                </Badge>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <SortableContext id={column.id} items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-col gap-3 p-2 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/10 min-h-[500px]">
                                {column.tasks.map((task) => (
                                    <SortableTask key={task.id} task={task} />
                                ))}
                            </div>
                        </SortableContext>
                    </div>
                ))}
            </div>
        </DndContext>
    )
}

function SortableTask({ task }: { task: Task }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group cursor-grab active:cursor-grabbing border-white/5 hover:border-primary/40 hover:shadow-md transition-all bg-black"
        >
            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <Badge
                        variant="outline"
                        className={`text-[10px] font-bold uppercase tracking-wide border-none px-0 ${task.priority === "High" ? "text-red-500" :
                            task.priority === "Medium" ? "text-orange-500" : "text-blue-500"
                            }`}
                    >
                        {task.priority}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-3 w-3" />
                    </Button>
                </div>

                <h4 className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-100 italic">
                    "{task.title}"
                </h4>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-50 dark:border-zinc-800/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="text-[10px] font-medium">{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[10px] font-medium">{task.dueDate}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
