import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex font-mono items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        flat:
          "bg-white text-black shadow border border-black hover:bg-black hover:text-white",
        shadow:
          "bg-white text-black shadow border border-black shadow-flat hover:bg-black hover:text-white",
        text:
          "text-black disabled:text-muted-foreground",
        highlight:
          "bg-highlight text-white hover:font-medium hover:underline",
      },
      size: {
        default: "h-9 px-3 py-2 text-lg",
        small: "h-8 px-3 text-base",
        large: "h-14 px-8 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "flat",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
