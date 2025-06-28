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

  const [
    allowance = 0n,
    unitOfCreditPerUnionClub = 0n,
    unitOfCreditPerUnionPublic = 0n,
    contractDaiBalance = 0n,
  ] = result.data?.map(d => d.result as never) || [];

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
    isError: result.isError,
    isFetching: result.isFetching,
    isSuccess: result.isSuccess,
    refetch: result.refetch,
  };
};