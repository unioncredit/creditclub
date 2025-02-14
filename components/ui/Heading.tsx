import React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva(
  "text-foreground font-sans font-medium",
  {
    variants: {
      type: {
        h1: "text-2xl",
        h2: "font-normal",
        h3: "text-sm",
      },
    },
  }
)

export const Heading = ({
  type,
  children,
  className,
}: {
  type: "h1" | "h2" | "h3";
  children: React.ReactNode;
  className?: string;
}) => {
  const Component = type;

  return (
    <Component className={cn(headingVariants({ type }), className)}>
      {children}
    </Component>
  )
};