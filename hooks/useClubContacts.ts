import { chunk } from "lodash";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import useRelatedAddresses from "@/hooks/useRelatedAddresses";
import { usePopulateEns } from "@/hooks/usePopulateEns";
import { usePopulateFnames } from "@/hooks/usePopulateFnames";
import { useContract } from "@/hooks/useContract";
import { Address } from "viem";

export const useClubContacts = (clubAddress: Address) => {
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
  ]), [] as any[]);

  const result = useReadContracts(({
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
  }));

  const results = result.data?.map(d => d.result) || [];
  const chunked = chunk(results, 4) as any[];

  const data = chunked.map((d, i) => ({
    address: borrowerAddresses[i]!,
    locking: d[0].voucher.locked,
    trust: d[0].voucher.trust,
    vouch: d[0].voucher.vouch,
    isMember: d[1],
    isOverdue: d[2],
    lastRepay: d[3],
    unionWon: 0n,
    unionEarned: 0n,
  }));

  const refetch = async () => {
    await refetchAddresses();
    await result.refetch();
  };

  const ensPopulated = usePopulateEns(data);
  const fnamePopulated = usePopulateFnames(ensPopulated);

  return {
    ...result,
    refetch,
    data: fnamePopulated
  }
}