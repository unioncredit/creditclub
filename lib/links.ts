import { Address } from "viem";

export const getEtherscanAddressLink = (address: Address) => `https://basescan.org/address/${address}`;

export const createClubUrl = (clubAddress: Address) => `${process.env.NEXT_PUBLIC_URL}/club/${clubAddress}`;

export const createIpfsImageUrl = (path: string ) => {
  if (!path) {
    return "";
  }

  // path = ipfs://abcd1234...
  const cid = path.split('/');
  if (cid.length < 2) {
    throw new Error("Invalid IPFS path provided: " + path);
  }

  return `https://ipfs.io/ipfs/${cid[cid.length - 1]}`
}