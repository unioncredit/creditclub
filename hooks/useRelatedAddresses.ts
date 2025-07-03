import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { useContactCounts } from "@/hooks/useContactCounts";
import { useContract } from "@/hooks/useContract";
import { DEFAULT_CHAIN_ID } from "@/constants";

export default function useRelatedAddresses(address: Address) {
  const userManagerContract = useContract("userManager");

  const { voucherCount, voucheeCount, refetch: refetchCounts } = useContactCounts(address);

  const safeArrayLength = (value: bigint | number): number => {
    try {
      const num = typeof value === 'bigint' ? Number(value) : value;
      if (isNaN(num) || num < 0 || num > 10000) return 0; // Cap at reasonable limit
      return Math.floor(num);
    } catch {
      return 0;
    }
  };

  const { data: voucherData, refetch: refetchVouchers } = useReadContracts({
    contracts: Array(safeArrayLength(voucherCount))
      .fill(null)
      .map((_, i) => ({
        ...userManagerContract,
        functionName: "vouchers",
        args: [address, i],
        chainId: DEFAULT_CHAIN_ID,
      })),
  });

  const { data: voucheeData, refetch: refetchVouchees } = useReadContracts({
    contracts: Array(safeArrayLength(voucheeCount))
      .fill(null)
      .map((_, i) => ({
        ...userManagerContract,
        functionName: "vouchees",
        args: [address, i],
        chainId: DEFAULT_CHAIN_ID,
      })),
  });

  // Extract related addresses with proper destructuring
  const stakerAddresses: Address[] = voucherData?.map(d => {
    const voucherResult = d?.result as any;
    return voucherResult?.[0]?.toLowerCase() || zeroAddress;
  }) || [];

  const borrowerAddresses: Address[] = voucheeData?.map(d => {
    const voucheeResult = d?.result as any;
    return voucheeResult?.[0]?.toLowerCase() || zeroAddress;
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