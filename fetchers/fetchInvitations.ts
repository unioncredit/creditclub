import { Address } from "viem";

export interface IInvitation {
  id: string;
  sender: Address;
  receiver: Address;
  timestamp: number;
  block: bigint;
}

export const fetchInvitations = async (
  chainId: number,
  where: Record<string, string> = {}
) => {
  console.log({ chainId, where });

  return [];
}
