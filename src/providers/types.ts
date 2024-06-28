import { Address } from "viem";
import { UseReadContractsReturnType } from "wagmi";

export type ICreditClubDataProviderContext = Omit<UseReadContractsReturnType, "data"> & {
  data: {
    totalLockedStake: bigint;
    stakedBalance: bigint;
    costToCall: bigint;
    costToMint: bigint;
    proRataAmount: bigint;
    memberBidPrice: bigint;
    publicBidPrice: bigint;
    bidBucketBalance: bigint;
    bidBucketPercent: number;
    callerPercent: number;
    winnerPercent: number;
    totalPercent: number;
    percentageFull: number;
    overdueTime: bigint;
    unclaimedRewards: bigint;
    totalSupply: bigint;
    checkpoint: bigint;
    cooldown: number;
    contractURI: string;
    borrowRatePerSecond: bigint;
  },
};

export interface IContact {
  ens?: string;
  address: Address;
  locking: bigint;
  trust: bigint;
  vouch: bigint;
  isMember: boolean;
  isOverdue: boolean;
  lastRepay: bigint;
}

export type ICreditClubContactsProviderReturnType = Omit<UseReadContractsReturnType, "data"|"refetch"> & {
  refetch: () => Promise<void>;
  data: IContact[]
};

export type IConnectedMemberContext = Omit<UseReadContractsReturnType, "data"> & {
  data: {
    isMember: boolean;
    tokenBalance: bigint;
    tokenId: bigint | undefined;
    owed: bigint;
    vouch: bigint;
    unionCreditLimit: bigint;
  },
}

export interface IModalManagerContext {
  open: (key: string, props?: any) => void;
  close: () => void;
}

export type IToastStatus = "error" | "success" | "pending";

export interface IToast {
  id: string;
  title: string;
  content: string;
  link: string | null;
  variant: IToastStatus;
}

export interface IToastsContext {
  toasts: IToast[];
  addToast: (toast: IToast, autoClear?: boolean) => string;
  closeToast: (id: string) => void;
}

export interface ICacheContext {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
}

export interface ISettingsContext {
  settings: Record<string, string>;
  setSetting: (key: string, value: string) => void;
}