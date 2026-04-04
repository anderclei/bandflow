import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-none border border-transparent px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[#ccff00] text-black border-[#ccff00]/10",
        secondary:
          "bg-zinc-800 text-white border-white/5",
        destructive:
          "bg-red-600 text-white border-red-500/10",
        outline:
          "border-white/10 text-white bg-transparent hover:bg-white/5",
        ghost: "hover:bg-white/5 text-zinc-400",
        link: "text-[#ccff00] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
