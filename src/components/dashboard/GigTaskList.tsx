"use client";

import { useState } from "react";
import { CheckSquare, Square, Trash2, Plus } from "lucide-react";
import { createGigTask, toggleGigTask, deleteGigTask } from "@/app/actions/gigs";

interface Task {
    id: string;
    description: string;
    isCompleted: boolean;
}

interface GigTaskListProps {
    gigId: string;
    initialTasks: Task[];
}

export function GigTaskList({ gigId, initialTasks }: GigTaskListProps) {
    const [tasks, setTasks] = useState(initialTasks);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleToggle = async (taskId: string, currentStatus: boolean) => {
        // Optimistic update
        setTasks(tasks.map(t => t.id === taskId ? { ...t, isCompleted: !currentStatus } : t));
        await toggleGigTask(taskId, !currentStatus, gigId);
    };

    const handleDelete = async (taskId: string) => {
        // Optimistic update
        setTasks(tasks.filter(t => t.id !== taskId));
        await deleteGigTask(taskId, gigId);
    };

    const handleCreate = async (formData: FormData) => {
        setIsSubmitting(true);
        const description = formData.get("description") as string;

        // Let the server action revalidate and we rely on standard next.js refresh
        // For better UX we could add optimistically but since we need an ID, we'll wait for server.
        await createGigTask(gigId, formData);

        const form = document.getElementById("task-form") as HTMLFormElement;
        if (form) form.reset();

        setIsSubmitting(false);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`group flex items-center justify-between p-3 rounded-xl border transition-colors ${task.isCompleted
                                ? "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800"
                                : "bg-white border-zinc-200 hover:border-emerald-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-emerald-500/50"
                            }`}
                    >
                        <button
                            onClick={() => handleToggle(task.id, task.isCompleted)}
                            className="flex items-center gap-3 flex-1 text-left"
                        >
                            <div className={`${task.isCompleted ? "text-emerald-500" : "text-zinc-400 group-hover:text-emerald-400"}`}>
                                {task.isCompleted ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                            </div>
                            <span className={`text-sm ${task.isCompleted ? "text-zinc-400 line-through" : "text-foreground font-medium"}`}>
                                {task.description}
                            </span>
                        </button>
                        <button
                            onClick={() => handleDelete(task.id)}
                            className="p-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <p className="text-sm text-zinc-500 italic text-center py-4">
                        Nenhuma tarefa pendente para este show.
                    </p>
                )}
            </div>

            <form id="task-form" action={handleCreate} className="flex gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <input
                    name="description"
                    type="text"
                    placeholder="Adicionar nova tarefa..."
                    required
                    className="flex-1 rounded-xl bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </form>
        </div>
    );
}
