import { useEffect, useState } from "react";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export default function useResponsive() {
  const { width } = useWindowSize();

  const isWidth = (targetWidth: number) => {
    return width <= targetWidth;
  };

  return {
    isWidth,
    isMicro: !width || width <= 480,
    isMobile: !width || width <= 580,
    isTablet: !width || width <= 767,
  };
}
