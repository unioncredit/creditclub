import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { useContactCounts } from "@/hooks/useContactCounts";
import { useContract } from "@/hooks/useContract";
import { DEFAULT_CHAIN_ID } from "@/constants";

export default function useRelatedAddresses(address: Address) {
  const userManagerContract = useContract("userManager");

  const { voucherCount, voucheeCount, refetch: refetchCounts } = useContactCounts(address);

  const { data: voucherData, refetch: refetchVouchers } = useReadContracts({
    contracts: Array(Number(voucherCount))
      .fill(null)
      .map((_, i) => ({
        ...userManagerContract,
        functionName: "vouchers",
        args: [address, i],
        chainId: DEFAULT_CHAIN_ID,
      })),
  });

  const { data: voucheeData, refetch: refetchVouchees } = useReadContracts({
    contracts: Array(Number(voucheeCount))
      .fill(null)
      .map((_, i) => ({
        ...userManagerContract,
        functionName: "vouchees",
        args: [address, i],
        chainId: DEFAULT_CHAIN_ID,
      })),
  });

  const extractResult = (contractResult: any): any => {
    if (contractResult?.status === 'success' && contractResult?.result !== undefined) {
      return contractResult.result;
    }
    if (contractResult?.result !== undefined) {
      return contractResult.result;
    }
    return null;
  };

  const stakerAddresses: Address[] = voucherData?.map(d => {
    const result = extractResult(d);
    return result?.[0]?.toLowerCase() || zeroAddress;
  }) || [];

  const borrowerAddresses: Address[] = voucheeData?.map(d => {
    const result = extractResult(d);
    return result?.[0]?.toLowerCase() || zeroAddress;
  }) || [];

  return {
    stakerAddresses,
    borrowerAddresses,
    refetch: async () => {
      await refetchCounts();
      await refetchVouchees();
      await refetchVouchers();
    },
  };
}
23;