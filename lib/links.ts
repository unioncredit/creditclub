import { Address } from "viem";

export const getEtherscanAddressLink = (address: Address) => `https://sepolia.basescan.org/address/${address}`;