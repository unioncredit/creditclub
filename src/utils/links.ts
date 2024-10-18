import { clubNftContract } from "@/contracts/optimism.ts";

const SHARE_MESSAGE = `Please vouch for me on Union!`;

export const generateTwitterLink = (url: string, message = SHARE_MESSAGE) =>
  `https://twitter.com/intent/tweet?text=${message}&url=${encodeURIComponent(
    url
  )}&via=unionprotocol`;

export const generateTelegramLink = (url: string, message = SHARE_MESSAGE) =>
  `https://telegram.me/share/url?text=${message}&url=${encodeURIComponent(url)}`;

export const generateCreditClubLink = (tokenId: bigint | string | undefined) => `https://opensea.io/assets/optimism/${clubNftContract.address}/${tokenId}`;
