import { Address } from "viem";
import { useAccount, useReadContracts } from "wagmi";
import { useContract } from "@/hooks/useContract.ts";
import { DEFAULT_CHAIN } from "@/constants.ts";

export const useContactCounts = (address: Address) => {
  const { chain: connectedChain = DEFAULT_CHAIN } = useAccount();

  const chainId = connectedChain.id;
  const userManagerContract = useContract("userManager");

  const result = useReadContracts({
    contracts: [
      {
        ...userManagerContract,
        functionName: "getVoucherCount",
        args: [address],
      },
      {
        ...userManagerContract,
        functionName: "getVoucheeCount",
        args: [address],
      },
    ].map(c => ({ ...c, chainId })),
  });

  const [
    voucherCount= 0,
    voucheeCount = 0n,
  ] = result.data?.map(d => d.result) || [];

  return {
    voucherCount,
    voucheeCount,
    refetch: result.refetch,
  };
};