import { Address } from "viem";
import { useAccount, useReadContract, useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubStaking } from "@/hooks/useClubStaking";
import { useWithdrawBucketContract } from "@/hooks/useWithdrawBucketContract";
import { useCurrentTime } from "@/hooks/useCurrentTime";

export const useClubWithdrawBucket = (clubAddress: Address) => {
  const { address: connectedAddress } = useAccount();
  const { data: stakingData } = useClubStaking(clubAddress);
  const { hasPassed } = useCurrentTime();

  const withdrawBucketAddress: Address = stakingData?.withdrawBucketAddress ?? "0x0";

  const withdrawBucketContract = useWithdrawBucketContract(withdrawBucketAddress);

  const numWithdrawalsQuery = useReadContract({
    ...withdrawBucketContract,
    functionName: "getWithdrawalsLen",
    // @ts-ignore
    args: [connectedAddress],
    query: {
      enabled: !!connectedAddress && !!clubAddress,
      staleTime: 30_000,
    }
  });

  const numWithdrawals: bigint = (numWithdrawalsQuery.data as bigint) ?? 0n;

  const contracts = Array(Number(numWithdrawals)).fill(0).map((_, i) => ({
    ...withdrawBucketContract,
    functionName: "getWithdrawals",
    args: [connectedAddress, i],
  }));

  const result = useReadContracts({
    // @ts-ignore
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
      staleTime: 30_000,
    }
  });

  // Extract withdrawal data with proper destructuring
  const withdrawals = result.data || [];

  const typedWithdrawals = withdrawals.map((w, id) => {
    const withdrawalData = w?.result as any;
    return {
      id,
      amount: (withdrawalData?.[0] as bigint) || 0n,
      end: (withdrawalData?.[1] as bigint) || 0n,
      isComplete: (withdrawalData?.[2] as boolean) || false,
    };
  })

  const data = {
    withdrawBucketAddress,
    numWithdrawals,
    withdrawals: typedWithdrawals,
    lockedWithdrawals: typedWithdrawals.filter(w => !hasPassed(w.end)),
    pendingWithdrawals: typedWithdrawals.filter(w => hasPassed(w.end) && !w.isComplete),
    completedWithdrawals: typedWithdrawals.filter(w => w.isComplete),
  };

  return { 
    data,
    isLoading: result.isLoading || numWithdrawalsQuery.isLoading,
    isRefetching: result.isRefetching || numWithdrawalsQuery.isRefetching,
    refetch: async () => {
      await result.refetch();
      await numWithdrawalsQuery.refetch();
    },
  };
};