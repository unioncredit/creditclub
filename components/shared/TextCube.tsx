import React from "react";

export const TextCube = ({
  foreground,
  background,
  width,
  height,
  children,
}: {
  foreground: string;
  background: string;
  width: number;
  height: number;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className="p-2 rounded-lg inline-flex items-center justify-center"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        color: foreground,
        backgroundColor: background
      }}
    >
      {children}
    </div>
  )
};