import { Address, zeroAddress } from "viem";
import { useAccount, useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useContract } from "@/hooks/useContract";
import { useRewardsManagerContract } from "@/hooks/useRewardsManagerContract";

// @ts-ignore - clubAddress kept for API consistency
export const useRewardsManager = (clubAddress: Address) => {
  const { address = zeroAddress } = useAccount();

  const chainId = DEFAULT_CHAIN_ID;
  const unionContract = useContract("union");
  const tokenContract = useContract("token");
  const rewardsManagerContract = useRewardsManagerContract();

  const result = useReadContracts({
    contracts: [
      {
        ...unionContract,
        functionName: "allowance",
        args: [address, rewardsManagerContract.address],
      },
      {
        ...rewardsManagerContract,
        functionName: "unitOfCreditPerUnionClub",
      },
      {
        ...rewardsManagerContract,
        functionName: "unitOfCreditPerUnionPublic",
      },
      {
        ...tokenContract,
        functionName: 'balanceOf',
        args: [rewardsManagerContract.address],
      },
    ].map(c => ({ ...c, chainId })),
    query: {
      enabled: address !== zeroAddress && !!clubAddress,
    }
  });

  const safeBigInt = (value: any): bigint => {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(value);
    if (typeof value === 'string') return BigInt(value || 0);
    return 0n;
  };

  const extractedResults = result.data?.map((d: any) => {
    if (d?.status === 'success' && d?.result !== undefined) return d.result;
    if (d?.result !== undefined) return d.result;
    return null;
  }) || [];

  const allowance = safeBigInt(extractedResults[0]);
  const unitOfCreditPerUnionClub = safeBigInt(extractedResults[1]);
  const unitOfCreditPerUnionPublic = safeBigInt(extractedResults[2]);
  const contractDaiBalance = safeBigInt(extractedResults[3]);

  // Debug logging can be removed since invitePrice no longer exists
  // if (result.data) {
  //   console.log("RewardsManager debug:", {
  //     contractAddress: rewardsManagerContract.address,
  //     rawResults: result.data,
  //     allData: result.data?.map(d => d.result),
  //   });
  // }

  const data = {
    address: rewardsManagerContract.address,
    allowance,
    unionPer: unitOfCreditPerUnionClub, // Keep for backwards compatibility
    unitOfCreditPerUnionClub,
    unitOfCreditPerUnionPublic,
    contractDaiBalance,
  };

  return { 
    data,
    isLoading: result.isLoading,
    isRefetching: result.isRefetching,
    refetch: result.refetch,
  };
};