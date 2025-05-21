import { request, gql } from "graphql-request";

import { ActivityTypes } from "@/constants";
import { Address, Hash } from "viem";

export type IClubEventType = keyof typeof ActivityTypes;

export interface IClubEvent {
  type: IClubEventType;
  amount: bigint;
  address: Address;
  hash: Hash;
}

export const fetchClubEvents = async (vaultAddress: Address) =>{
  if (!vaultAddress) {
    return [];
  }

  const query = gql`
      query ($vaultAddress: String!, $limit: Int!) {
          events (
              limit: $limit,
              orderBy: "timestamp",
              orderDirection: "desc",
              where: { vaultAddress: $vaultAddress }
          ) {
              items {
                  type
                  timestamp
                  amount
                  hash
                  account
              }
          }
      }
  `;

  const variables = {
    limit: 4,
    vaultAddress: vaultAddress.toLowerCase(),
  };

  // @ts-ignore
  const resp: any = await request(process.env.NEXT_PUBLIC_PONDER_URL, query, variables);

  const flattened: IClubEvent[] = resp.events.items.map((item: any) => ({
    type: item.type,
    amount: item.amount,
    address: item.account,
    hash: item.hash,
  }));

  return flattened;
}
