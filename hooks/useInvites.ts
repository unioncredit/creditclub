import { Address } from "viem";
import { useAccount, useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";

export const useInvites = (clubAddress: Address) => {
  const { address } = useAccount();

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const contracts = [
    {
      ...creditVaultContract,
      functionName: "inviteEnabled",
    },
    {
      ...creditVaultContract,
      functionName: "invited",
      args: [address]
    },
    {
      ...creditVaultContract,
      functionName: "initialInvitedLength"
    }
  ];

  const result = useReadContracts({
    // @ts-ignore
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
    }
  });

  const [
    inviteEnabled = false,
    invited = false,
    initialInvitedLength = 0n,
    // @ts-ignore
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    enabled: inviteEnabled || initialInvitedLength > 0n,
    creatorInvitesEnabled: initialInvitedLength > 0n,
    memberInvitesEnabled: inviteEnabled,
    qualified: invited
  };

  return { ...result, data };
};