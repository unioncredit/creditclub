import { Address, Hash } from "viem";

import { ActivityTypes } from "@/constants";

export type IClubEventType = keyof typeof ActivityTypes;

export interface IClubEvent {
  type: IClubEventType;
  amount: bigint;
  address: Address;
  hash: Hash;
}

export const fetchClubEvents = async (_: number) =>{
  return [];
}
