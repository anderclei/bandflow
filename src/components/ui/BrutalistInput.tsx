import React from "react";

interface BrutalistInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
  variant?: "default" | "neon" | "dim";
}

export const BrutalistInput = React.forwardRef<HTMLInputElement, BrutalistInputProps>(
  ({ label, id, error, variant = "default", className = "", ...props }, ref) => {
    const variantStyles = {
      default: "text-white border-white/10 focus:border-[#ccff00]/50",
      neon: "text-[#ccff00] border-[#ccff00]/20 focus:border-[#ccff00]",
      dim: "text-zinc-500 border-white/5 focus:border-zinc-400"
    };

    return (
      <div className="space-y-2 group">
        {label && (
          <label 
            htmlFor={id} 
            className="text-[11px] font-bold text-zinc-500 ml-1 group-focus-within:text-[#ccff00] transition-colors"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {/* Decorative Corner L-shapes */}
          <div className="absolute -top-[1px] -left-[1px] w-1 h-1 border-t border-l border-transparent group-focus-within:border-[#ccff00] transition-all" />
          <div className="absolute -bottom-[1px] -right-[1px] w-1 h-1 border-b border-r border-transparent group-focus-within:border-[#ccff00] transition-all" />

          <input
            ref={ref}
            id={id}
            className={`
              w-full h-14 bg-black border px-6 
              text-[14px] font-medium outline-none 
              transition-all placeholder:text-zinc-800 
              ${variantStyles[variant]}
              ${error ? "border-red-500/50" : ""}
              ${className}
            `}
            {...props}
          />
          
          {/* Scanning Line Effect on focus */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-focus-within:opacity-10">
            <div className="w-full h-[1px] bg-[#ccff00] animate-scanline" />
          </div>
        </div>
        {error && <p className="text-[9px] font-black uppercase text-red-500 ml-1 mt-1">{error}</p>}
      </div>
    );
  }
);

BrutalistInput.displayName = "BrutalistInput";
