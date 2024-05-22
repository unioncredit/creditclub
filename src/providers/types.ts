import { Address } from "viem";
import { UseReadContractsReturnType } from "wagmi";

export type ICreditClubDataProviderReturnType = Omit<UseReadContractsReturnType, "data"> & {
  data: {
    totalLockedStaked: bigint;
    stakedBalance: bigint;
  },
}

export type ICreditClubContactsProviderReturnType = Omit<UseReadContractsReturnType, "data"|"refetch"> & {
  refetch: () => Promise<void>;
  data: {
    address: Address;
    locking: bigint;
    trust: bigint;
    vouch: bigint;
    isMember: boolean;
    isOverdue: boolean;
    lastRepay: bigint;
  }[]
};