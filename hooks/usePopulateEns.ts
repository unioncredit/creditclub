import { useReadContract } from "wagmi";
import { mainnet } from "wagmi/chains";

import { IContact } from "@/providers/types";

export const usePopulateEns = (contacts: IContact[]) => {
  const ensNamesQuery = useReadContract({
    chainId: mainnet.id,
    address: "0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c",
    abi: [
      {
        inputs: [{ internalType: "contract ENS", name: "_ens", type: "address" }],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [{ internalType: "address[]", name: "addresses", type: "address[]" }],
        name: "getNames",
        outputs: [{ internalType: "string[]", name: "r", type: "string[]" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getNames",
    args: [contacts?.map(({ address }) => address)],
    query: {
      staleTime: Infinity,
    }
  });

  const ensNames: string[] = (ensNamesQuery.data as string[]) ?? [];

  return contacts?.map((row, i) => ({
    ...row,
    ens: ensNames?.[i],
  }));
}
