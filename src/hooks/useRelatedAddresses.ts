import { Address } from "viem";
import { useReadContracts } from "wagmi";

import { userManagerContract } from "@/contracts/optimism.ts";
import { useContactCounts } from "@/hooks/useContactCounts.ts";

export default function useRelatedAddresses(address: Address) {
  const { voucherCount, voucheeCount, refetch: refetchCounts } = useContactCounts(address);

  const { data: voucherData, refetch: refetchVouchers } = useReadContracts({
    contracts: Array(Number(voucherCount))
      .fill(null)
      .map((_, i) => ({
        ...userManagerContract,
        functionName: "vouchers",
        args: [address, i],
      })),
  });

  const { data: voucheeData, refetch: refetchVouchees } = useReadContracts({
    contracts: Array(Number(voucheeCount))
      .fill(null)
      .map((_, i) => ({
        ...userManagerContract,
        functionName: "vouchees",
        args: [address, i],
      })),
  });

  // @ts-ignore
  const stakerAddresses: Address[] = voucherData?.map(d => d.result[0].toLowerCase()) || [];

  // @ts-ignore
  const borrowerAddresses: Address[] = voucheeData?.map(d => d.result[0].toLowerCase()) || [];

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