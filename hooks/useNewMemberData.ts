import { Address, zeroAddress } from "viem";
import { useReadContract } from "wagmi";

import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubData } from "@/hooks/useClubData";
import { useMemberNftContract } from "@/hooks/useMemberNftContract";

export const useNewMemberData = (userAddress: Address | undefined, clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);

  const {
    memberNftAddress,
    vestingDurationInSeconds,
    startingPercentTrust,
    baseTrust,
  } = clubData;

  const memberNftContract = useMemberNftContract(memberNftAddress);
  const creditVaultContract = useCreditVaultContract(clubAddress);

  const totalSupplyQuery = useReadContract({
    ...memberNftContract,
    functionName: "totalSupply",
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress && memberNftAddress !== zeroAddress,
    }
  });

  const tokenId = totalSupplyQuery.data || 0n;
  
  // Since previewCreditClaim doesn't exist, we'll use baseTrust as the total trust amount
  const totalTrustAmount = baseTrust || 0n;

  const initialTrustAmount = vestingDurationInSeconds > 0n
    ? totalTrustAmount * startingPercentTrust / 1000000000000000000n
    : totalTrustAmount;

  const data = {
    initialTrustAmount,
    totalTrustAmount,
    vestingDurationInSeconds,
    startingPercentTrust,
    tokenId: tokenId + 1n,
  };

  const isLoading = totalSupplyQuery.isLoading;
  const isRefetching = totalSupplyQuery.isRefetching;
  const refetch = totalSupplyQuery.refetch;

  return { 
    data, 
    isLoading,
    isRefetching,
    refetch,
  };
};