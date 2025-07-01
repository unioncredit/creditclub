import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "font-mono shadow border shadow-flat inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        text: "shadow-none border-none",
        light: "bg-white text-black border-black hover:bg-black hover:text-white",
        dark: "bg-[#2A2736] text-white hover:opacity-90",
        blue: "text-white bg-blue-600 border-black hover:bg-blue-700",
      },
      size: {
        pill: "h-6 px-2 text-sm",
        small: "h-8 px-3 text-base",
        default: "h-9 px-3 py-2 text-lg",
        large: "h-14 px-8 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "light",
      size: "default",
    },
  }
)


export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
  asChild?: boolean;
}

export const ShadowButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    className,
    icon,
    variant,
    size,
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Filter out non-DOM props that might cause React errors
    const { loading, label, ...domProps } = props as any;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...domProps}
      >
        {icon || null}

        {label || children}
      </Comp>
    )
  }
)
