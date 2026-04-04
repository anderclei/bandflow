import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-none text-[10px] font-black uppercase tracking-[0.3em] transition-all disabled:pointer-events-none disabled:opacity-30 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-[#ccff00] text-black hover:bg-white shadow-[0_0_40px_rgba(204,255,0,0.1)]",
        destructive:
          "bg-red-600 text-white hover:bg-white hover:text-black shadow-[0_0_40px_rgba(220,38,38,0.2)]",
        outline:
          "border border-white/10 bg-transparent hover:bg-white hover:text-black",
        secondary:
          "bg-zinc-900 text-white border border-white/5 hover:bg-white hover:text-black",
        ghost:
          "hover:bg-white/5 hover:text-white",
        link: "text-[#ccff00] underline-offset-8 hover:underline",
      },
      size: {
        default: "h-14 px-10",
        xs: "h-6 px-3 text-[8px] tracking-widest",
        sm: "h-10 px-6",
        lg: "h-20 px-16 text-[12px] tracking-[0.5em]",
        icon: "size-14",
        "icon-xs": "size-6",
        "icon-sm": "size-10",
        "icon-lg": "size-20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
