"use client";

import { cn } from "@/lib/utils";
import { createRef, useCallback, useEffect, useState } from "react";

export const ProgressBar = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const [width, setWidth] = useState(0);
  const ref = createRef<HTMLDivElement>();

  if (value < 0 || value > 100) {
    throw "Invalid progress value, must be between 0-100: " + value;
  }

  const getCharacterPixelSize = useCallback(() => {
    if (typeof window !== "undefined") {
      const testElement = document.createElement("span");
      testElement.style.fontFamily = "Berkeley Mono";
      testElement.style.fontSize = "1rem";
      testElement.style.visibility = "hidden";
      testElement.appendChild(document.createTextNode("M"));
      document.body.appendChild(testElement);
      const size = testElement.offsetWidth;
      document.body.removeChild(testElement);
      return size;
    }

    return 1;
  }, [ref])

  const handleResize = useCallback(() => {
    if (ref.current) {
      setWidth(ref.current.getBoundingClientRect().width);
    }
  }, [ref]);

  useEffect(() => {
    handleResize();

    if (ref.current) {
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [ref]);

  const totalCharacters = Math.max(Math.floor(width / getCharacterPixelSize()) - 2, 2);

  const numBars = Math.round(totalCharacters * (value / 100));
  const numEmpty = totalCharacters - numBars;

  const barString = Array(numBars).fill("|").join("");
  const emptyString = Array(numEmpty).fill(".").join("");

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <p className="w-auto">
        [{barString}{emptyString}]
      </p>
    </div>
  )
};