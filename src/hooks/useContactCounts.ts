import { Address } from "viem";
import { useReadContracts } from "wagmi";
import { useContract } from "@/hooks/useContract.ts";

export const useContactCounts = (address: Address) => {
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
    ],
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