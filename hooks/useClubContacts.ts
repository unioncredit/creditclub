import chunk from "lodash/chunk";
import { Address } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import useRelatedAddresses from "@/hooks/useRelatedAddresses";
import { usePopulateEns } from "@/hooks/usePopulateEns";
import { useContract } from "@/hooks/useContract";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { IContact } from "@/providers/types";

export const useClubContacts = (clubAddress: Address) => {
  const creditVaultContract = useCreditVaultContract(clubAddress);
  const unionLensContract = useContract("unionLens");
  const userManagerContract = useContract("userManager");
  const uTokenContract = useContract("uToken");
  const tokenContract = useContract("token");

  const {
    borrowerAddresses,
    refetch: refetchAddresses,
  } = useRelatedAddresses(clubAddress);

  const contracts = borrowerAddresses.reduce((curr, borrower) => ([
    ...curr,
    {
      ...unionLensContract,
      functionName: "getRelatedInfo",
      args: [tokenContract.address, clubAddress, borrower],
    },
    {
      ...userManagerContract,
      functionName: "checkIsMember",
      args: [borrower],
    },
    {
      ...uTokenContract,
      functionName: "checkIsOverdue",
      args: [borrower],
    },
    {
      ...uTokenContract,
      functionName: "getLastRepay",
      args: [borrower],
    },
    {
      ...creditVaultContract,
      functionName: "balanceOf",
      args: [borrower]
    }
  ]), [] as any[]);

  const result = useReadContracts(({
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  }));

  const results = result.data?.map(d => d.result) || [];

  // note: make sure to update this when added a contract call
  const chunked = chunk(results, 5);

  // Helper functions for safe data extraction
  const safeBigInt = (value: any): bigint => {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(value);
    if (typeof value === 'string') return BigInt(value || 0);
    return 0n;
  };

  const safeBoolean = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    return Boolean(value);
  };

  const data: IContact[] = chunked.map((d, i) => {
    // Safety check: ensure d is an array with expected length
    if (!Array.isArray(d) || d.length < 5) {
      return {
        address: borrowerAddresses[i]!,
        locking: 0n,
        trust: 0n,
        vouch: 0n,
        isMember: false,
        isOverdue: false,
        lastRepay: 0n,
        numShares: 0n,
      };
    }

    // Safety check: ensure voucher object exists
    const voucherData = d[0] && typeof d[0] === 'object' && d[0].voucher ? d[0].voucher : {};

    return {
      address: borrowerAddresses[i]!,
      locking: safeBigInt(voucherData.locked),
      trust: safeBigInt(voucherData.trust),
      vouch: safeBigInt(voucherData.vouch),
      isMember: safeBoolean(d[1]),
      isOverdue: safeBoolean(d[2]),
      lastRepay: safeBigInt(d[3]),
      numShares: safeBigInt(d[4]),
    };
  });

  const refetch = async () => {
    await refetchAddresses();
    await result.refetch();
  };

  const ensPopulated = usePopulateEns(data);

  return {
    data: ensPopulated || [] as IContact[],
    isLoading: result.isLoading,
    isRefetching: result.isRefetching,
    refetch,
  }
}