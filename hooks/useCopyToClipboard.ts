import { useRef, useEffect, useState } from "react";

const DELAY = 2000;

export const useCopyToClipboard = (delay = DELAY) => {
  const timers = useRef([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const copy = async (text: string): Promise<void> => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.warn("Copy failed", error);
      setCopied(false);
    }

    timers.current.push(
      // @ts-ignore
      setTimeout(() => {
        setCopied(false);
      }, delay)
    );
  };

  return { copied, copy };
}
