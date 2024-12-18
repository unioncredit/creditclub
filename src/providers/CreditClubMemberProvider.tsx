import { useAccount, useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { ICreditClubMemberContext } from "@/providers/types";
import { Address, zeroAddress } from "viem";
import { CREDITCLUB_SAFE_ADDRESS, DEFAULT_CHAIN } from "@/constants.ts";
import { useContract } from "@/hooks/useContract.ts";

const CreditClubMemberContext = createContext({} as ICreditClubMemberContext);

export const useClubMember = () => useContext(CreditClubMemberContext);

export const useClubMemberData = ({ address }: { address: Address }) => {
  const { chain: connectedChain = DEFAULT_CHAIN } = useAccount();
  const userManagerContract = useContract("userManager");
  const clubPluginContract = useContract("clubPlugin");
  const clubNftContract = useContract("clubNft");

  const chainId = connectedChain.id;
  const safeAddress = CREDITCLUB_SAFE_ADDRESS[chainId];

  const resultOne = useReadContracts({
    contracts: [
      {
        ...clubNftContract,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...clubNftContract,
        functionName: 'tokenOfOwnerByIndex',
        args: [address, 0n],
      },
      {
        ...userManagerContract,
        functionName: 'getLockedStake',
        args: [safeAddress, address],
      },
      {
        ...userManagerContract,
        functionName: 'getVouchingAmount',
        args: [safeAddress, address],
      },
    ].map(c => ({ ...c, chainId })),
  });

  const [
    balanceOf = 0n,
    tokenId= undefined,
    owed = 0n,
    vouch = 0n,
  ] = resultOne.data?.map(d => d.result as never) || [];

  const resultTwo = useReadContracts({
    contracts: [
      {
        ...clubPluginContract,
        functionName: "percentVested",
        args: [tokenId],
      },
      {
        ...clubNftContract,
        functionName: "nftCreditStatus",
        // @ts-ignore
        args: [tokenId],
      }
    ].map(c => ({ ...c, chainId })),
    query: {
      enabled: tokenId !== undefined,
    }
  });

  const [
    percentVested = undefined,
    nftCreditStatus = undefined,
  ] = resultTwo.data?.map(d => d.result as never) || [];

  const data = {
    isMember: balanceOf > 0n,
    tokenBalance: balanceOf,
    tokenId,
    owed,
    vouch,
    percentVested,
    baseTrust: nftCreditStatus?.[0] || 0n,
    active: nftCreditStatus?.[1] || false,
    badDebt: nftCreditStatus?.[2] || 0n,
    tier: nftCreditStatus?.[3] || 0,
    inviteCount: nftCreditStatus?.[4] || 0,
  };

  const {
    refetch: refetchOne,
    isLoading: isLoadingOne,
    isRefetching: isRefetchingOne,
  } = resultOne;

  const {
    refetch: refetchTwo,
    isLoading: isLoadingTwo,
    isRefetching: isRefetchingTwo,
  } = resultTwo;

  const refetch = async () => {
    await refetchOne();
    await refetchTwo();
  };

  return {
    ...resultTwo,
    isLoading: isLoadingOne || isLoadingTwo || isRefetchingOne || isRefetchingTwo,
    refetch,
    data,
  };
};

export const CreditClubMemberProvider = ({ children }: { children: React.ReactNode; }) => {
  const { address = zeroAddress } = useAccount();

  const data = useClubMemberData({ address });

  return (
    <CreditClubMemberContext.Provider value={data}>
      {children}
    </CreditClubMemberContext.Provider>
  )
}