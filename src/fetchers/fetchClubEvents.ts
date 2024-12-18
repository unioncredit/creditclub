import { request, gql } from "graphql-request";

import { ActivityTypes, CREDITCLUB_GRAPH_URL } from "@/constants";
import { Address, Hash } from "viem";

export type IClubEventType = keyof typeof ActivityTypes;

export interface IClubEvent {
  type: IClubEventType;
  amount: bigint;
  address: Address;
  hash: Hash;
}

export const fetchClubEvents = async (chainId: number) =>{
  const query = gql`
      query ($first: Int!) {
          clubEvents (first: $first, orderBy:timestamp, orderDirection: desc) {
              type
              timestamp
              amount
              hash
              account {
                  id
              }
          }
      }
  `;

  const variables = {
    first: 4,
  };

  const resp: any = await request(CREDITCLUB_GRAPH_URL[chainId], query, variables);

  const flattened: IClubEvent[] = resp.clubEvents.map((item: any) => ({
    type: item.type,
    amount: item.amount,
    address: item.account.id,
    hash: item.hash,
  }));

  return flattened;
}
