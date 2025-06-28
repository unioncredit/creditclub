import { UseReadContractsReturnType } from "wagmi";
import { Address } from "viem";

export type IConnectedMemberContext = {
  data: {
    tokenBalance: bigint;
  };
  isLoading: boolean;
  isRefetching: boolean;
  refetch: UseReadContractsReturnType['refetch'];
}

export type IUnionMemberContext = {
  data: {
    isOverdue: boolean;
    creditLimit: bigint;
    owed: bigint;
    daiBalance: bigint;
    interest: bigint;
    minPayment: bigint;
    unionBalance: bigint;
  };
  isLoading: boolean;
  isRefetching: boolean;
  refetch: UseReadContractsReturnType['refetch'];
}

export type IUnionDataContext = {
  data: {
    minBorrow: bigint;
    originationFee: bigint;
    overdueTime: bigint;
    borrowRatePerSecond: bigint;
  };
  isLoading: boolean;
  isRefetching: boolean;
  refetch: UseReadContractsReturnType['refetch'];
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

export interface IContact {
  ens?: string;
  address: Address;
  locking: bigint;
  trust: bigint;
  vouch: bigint;
  isMember: boolean;
  isOverdue: boolean;
  lastRepay: bigint;
  numShares: bigint;
}