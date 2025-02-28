import useResponsive from "@/hooks/useResponsive";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export const useNativeShare = () => {
  const { isMobile } = useResponsive();
  const { copy, copied } = useCopyToClipboard();

  const share = ({
    url,
    title,
    text,
  }: {
    url: string;
    title: string;
    text: string;
  }) => {
    if (isMobile && navigator.share) {
      navigator.share({ url, title, text });
    } else {
      copy(url);
    }
  };

  return {
    share,
    copied,
  };
};