import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

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
  } = clubData;

  const memberNftContract = useMemberNftContract(memberNftAddress);
  const creditVaultContract = useCreditVaultContract(clubAddress);

  const contracts = [
    {
      ...creditVaultContract,
      functionName: "previewCreditClaim",
      args: [userAddress],
    },
    {
      ...memberNftContract,
      functionName: "totalSupply"
    }
  ];

  const result = useReadContracts({
    // @ts-ignore
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress && !!userAddress && memberNftAddress !== zeroAddress,
    }
  });

  const [
    totalTrustAmount = 0n,
    tokenId = 0n,
  ] = result.data?.map(d => d.result as never) || [];

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

  return { ...result, data };
};