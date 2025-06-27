import chunk from "lodash/chunk";
import { Address } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import useRelatedAddresses from "@/hooks/useRelatedAddresses";
import { usePopulateEns } from "@/hooks/usePopulateEns";
import { useContract } from "@/hooks/useContract";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";

interface ClubContact {
  address: Address;
  locking: bigint;
  trust: bigint;
  vouch: bigint;
  isMember: boolean;
  isOverdue: boolean;
  lastRepay: bigint;
  numShares: bigint;
  ens?: string | null;
}

interface UseClubContactsReturn {
  data: ClubContact[];
  refetch: () => Promise<void>;
  isLoading?: boolean;
  isError?: boolean;
}

export const useClubContacts = (clubAddress: Address): UseClubContactsReturn => {
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
  const chunked = chunk(results, 5) as any[];

  const data: ClubContact[] = chunked.map((d, i) => ({
    address: borrowerAddresses[i]!,
    locking: d[0].voucher.locked,
    trust: d[0].voucher.trust,
    vouch: d[0].voucher.vouch,
    isMember: d[1],
    isOverdue: d[2],
    lastRepay: d[3],
    numShares: d[4],
  }));

  const refetch = async () => {
    await refetchAddresses();
    await result.refetch();
  };

  const ensPopulated = usePopulateEns(data);

  return {
    ...result,
    refetch,
    data: ensPopulated as ClubContact[]
  }
}