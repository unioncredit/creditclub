import { useState } from "react"
import html2canvas from "html2canvas";

export const useScreenshot = () => {
  const [image, setImage] = useState<string | null>(null)
  const [error, setError] = useState(null)

  const takeScreenShot = async (
    node: HTMLElement,
    options: any = {},
    customStyles: (style: HTMLStyleElement) => void = () => {
    },
  ) => {
    if (!node) {
      throw new Error("You should provide correct html node.");
    }

    const style = document.createElement("style");
    document.head.appendChild(style);
    customStyles(style);

    try {
      const canvas = await html2canvas(node, options);
      const croppedCanvas = document.createElement("canvas");
      const croppedCanvasContext = croppedCanvas.getContext("2d");
      const cropPositionTop = 0;
      const cropPositionLeft = 0;
      const cropWidth = canvas.width;
      const cropHeight = canvas.height;

      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;

      croppedCanvasContext?.drawImage(
        canvas,
        cropPositionLeft,
        cropPositionTop,
      );

      const base64Image = croppedCanvas.toDataURL();
      setImage(base64Image);
      style.remove();
      return base64Image;
    } catch (e: any) {
      setError(e);
      style.remove();
    }
  }

  return {
    image,
    takeScreenShot,
    clearImage: () => setImage(null),
    error,
  };
}

export const createFileName = (extension = '', ...names: any[]) => {
  if (!extension) {
    return ''
  }

  return `${names.join('')}.${extension}`
}