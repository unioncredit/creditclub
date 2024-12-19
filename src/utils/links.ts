import { clubNftContract } from "@/contracts/base.ts";

const SHARE_MESSAGE = `Please vouch for me on Union!`;

export const generateTwitterLink = (url: string, message = SHARE_MESSAGE) =>
  `https://twitter.com/intent/tweet?text=${message}&url=${encodeURIComponent(
    url
  )}&via=unionprotocol`;

export const generateTelegramLink = (url: string, message = SHARE_MESSAGE) =>
  `https://telegram.me/share/url?text=${message}&url=${encodeURIComponent(url)}`;

export const generateCreditClubLink = (tokenId: bigint | string | undefined) => `https://opensea.io/assets/base/${clubNftContract.address}/${tokenId}`;

export const generateIpfsLink = (path: string ) => {
  // path = ipfs://abcd1234...
  const cid = path.split('/');
  if (cid.length < 2) {
    throw new Error("Invalid IPFS path provided: " + path);
  }

  return `https://ipfs.io/ipfs/${cid[cid.length - 1]}`
}
