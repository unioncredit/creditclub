import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "font-sans rounded-[10px] border inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        light: "bg-white text-black border-stone-200 hover:bg-slate-100",
        dark: "bg-primary text-white hover:opacity-90",
        rainbow: "!px-0.5 !py-0.5 [background-image:linear-gradient(white,white),linear-gradient(to_left,#FBC224,#E879F9,#4338CA,#60A5FA)] [background-origin:border-box] [background-clip:content-box,border-box] border-double border-2 rounded-xl hover:scale-[101%] transition-transform hover:shadow",
        blue: "text-white bg-blue-600"
      },
      size: {
        pill: "h-[26px] text-xs px-1",
        small: "h-[32px] text-sm px-1.5",
        default: "h-[48px] text-base px-4",
        medium: "h-[52px] text-base px-6",
        large: "h-[64px] text-base px-8"
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

export const RoundedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
