import React from "react";
import { cn } from "@/lib/utils";

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <article className={cn("bg-white p-6 border border-stone-100 rounded-xl sm:p-3 lg:p-4", className)}>
    {children}
  </article>
);