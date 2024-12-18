import { Address } from "viem";
import { useAccount, useReadContracts } from "wagmi";

import { useContactCounts } from "@/hooks/useContactCounts.ts";
import { useContract } from "@/hooks/useContract.ts";
import { DEFAULT_CHAIN } from "@/constants.ts";

export default function useRelatedAddresses(address: Address) {
  const { chain: connectedChain = DEFAULT_CHAIN } = useAccount();

  const chainId = connectedChain.id;
  const userManagerContract = useContract("userManager");

  const { voucherCount, voucheeCount, refetch: refetchCounts } = useContactCounts(address);

  const { data: voucherData, refetch: refetchVouchers } = useReadContracts({
    contracts: Array(Number(voucherCount))
      .fill(null)
      .map((_, i) => ({
        ...userManagerContract,
        functionName: "vouchers",
        args: [address, i],
        chainId,
      })),
  });

  const { data: voucheeData, refetch: refetchVouchees } = useReadContracts({
    contracts: Array(Number(voucheeCount))
      .fill(null)
      .map((_, i) => ({
        ...userManagerContract,
        functionName: "vouchees",
        args: [address, i],
        chainId,
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