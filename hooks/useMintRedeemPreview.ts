import { Address } from "viem";
import { useReadContract } from "wagmi";

import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";

export const useMintRedeemPreview = ({
  action,
  shares,
  erc4626Address,
}: {
  action: "mint" | "redeem";
  shares: bigint;
  erc4626Address: Address;
}) => {
  const creditVaultContract = useCreditVaultContract(erc4626Address);

  const result = useReadContract({
    ...creditVaultContract,
    functionName: action == "mint" ? "previewDeposit" : "previewRedeem",
    args: [shares],
  })

  return {
    data: result?.data || 0n,
    isLoading: result.isLoading,
    isError: result.isError,
    isFetching: result.isFetching,
    isSuccess: result.isSuccess,
    refetch: result.refetch,
  }
};