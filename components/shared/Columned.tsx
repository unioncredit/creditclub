import React from "react";

export const Columned = ({
  width,
  children,
  className,
}: {
  width: number;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={className}
    style={{
      width: "95%",
      maxWidth: width,
      marginLeft: "auto",
      marginRight: "auto",
    }}
  >
    {children}
  </div>
)