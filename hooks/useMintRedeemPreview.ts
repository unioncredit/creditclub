import { Address } from "viem";
import { useReadContract } from "wagmi";

import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";

export const useMintRedeemPreview = ({
  action,
  shares,
  clubAddress,
}: {
  action: "mint" | "redeem";
  shares: bigint;
  clubAddress: Address;
}) => {
  const creditVaultContract = useCreditVaultContract(clubAddress);

  const result = useReadContract({
    ...creditVaultContract,
    functionName: action == "mint" ? "previewMint" : "previewRedeem",
    args: [shares],
  })

  return {
    ...result,
    data: result?.data || 0n
  }
};