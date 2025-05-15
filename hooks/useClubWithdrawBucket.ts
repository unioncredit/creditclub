import { Address } from "viem";
import { useAccount, useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubStaking } from "@/hooks/useClubStaking";
import { useWithdrawBucketContract } from "@/hooks/useWithdrawBucketContract";
import { useCurrentTime } from "@/hooks/useCurrentTime";

export const useClubWithdrawBucket = (clubAddress: Address) => {
  const { address: connectedAddress } = useAccount();
  const { data: stakingData } = useClubStaking(clubAddress);
  const { hasPassed } = useCurrentTime();

  const { withdrawBucketAddress } = stakingData;

  const withdrawBucketContract = useWithdrawBucketContract(withdrawBucketAddress);

  const contracts = [
    {
      ...withdrawBucketContract,
      functionName: "getWithdrawals",
      args: [connectedAddress],
    },
  ];

  const result = useReadContracts({
    // @ts-ignore
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const [
    withdrawals = [],
  ] = result.data?.map(d => d.result as never) || [];

  const typedWithdrawals = withdrawals.map((w, id) => ({
    id,
    amount: w[0] as bigint,
    end: w[1] as bigint,
    isComplete: w[2] as boolean,
  }))

  const data = {
    withdrawBucketAddress,
    withdrawals: typedWithdrawals,
    lockedWithdrawals: typedWithdrawals.filter(w => !hasPassed(w.end)),
    pendingWithdrawals: typedWithdrawals.filter(w => hasPassed(w.end) && !w.isComplete),
    completedWithdrawals: typedWithdrawals.filter(w => w.isComplete),
  };

  return { ...result, data };
};