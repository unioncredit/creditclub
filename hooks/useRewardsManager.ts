import { Address, zeroAddress } from "viem";
import { useAccount, useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useContract } from "@/hooks/useContract";
import { useClubData } from "@/hooks/useClubData";
import { useRewardsManagerContract } from "@/hooks/useRewardsManagerContract";

export const useRewardsManager = (clubAddress: Address) => {
  const { address = zeroAddress } = useAccount();
  const { data: clubData } = useClubData(clubAddress);

  const { rewardsManagerAddress } = clubData;

  const chainId = DEFAULT_CHAIN_ID;
  const unionContract = useContract("union");
  const tokenContract = useContract("token");
  const rewardsManagerContract = useRewardsManagerContract(rewardsManagerAddress);

  const result = useReadContracts({
    contracts: [
      {
        ...unionContract,
        functionName: "allowance",
        args: [address, rewardsManagerContract.address],
      },
      {
        ...rewardsManagerContract,
        functionName: "unionPer",
      },
      {
        ...rewardsManagerContract,
        functionName: "invitePrice",
      },
      {
        ...tokenContract,
        functionName: 'balanceOf',
        args: [rewardsManagerContract.address],
      },
    ].map(c => ({ ...c, chainId })),
    query: {
      enabled: address !== zeroAddress,
    }
  });

  const [
    allowance = 0n,
    unionPer = 0n,
    invitePrice = 0n,
    contractDaiBalance = 0n,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    address: rewardsManagerAddress,
    allowance,
    unionPer,
    invitePrice,
    contractDaiBalance,
  };

  return { ...result, data };
};