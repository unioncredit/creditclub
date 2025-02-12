import { UseReadContractsReturnType } from "wagmi";
import { Address } from "viem";

export type IConnectedMemberContext = Omit<UseReadContractsReturnType, "data"> & {
  data: {
    tokenBalance: bigint;
  }
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
}