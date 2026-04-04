import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-zinc-800 selection:bg-[#ccff00] selection:text-black bg-black/40 border-white/10 h-14 w-full min-w-0 rounded-none border px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30",
        "focus:border-[#ccff00]/50 focus:ring-0",
        className
      )}
      {...props}
    />
  )
}

export { Input }
