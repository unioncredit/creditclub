import { request, gql } from "graphql-request";

import { CREDITCLUB_GRAPH_URL } from "@/constants";
import { objectToWhere } from "@/fetchers/utils.ts";
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
  const whereQuery = objectToWhere(where);
  const query = gql`
      query ($first: Int!) {
          invitations (
              first: $first,
              orderBy:timestamp,
              orderDirection: desc,
              ${whereQuery}
          ) {
              id
              sender {
                  id
              }
              receiver {
                  id
              }
              timestamp
              block
          }
      }
  `;

  const variables = {
    first: 50,
  };

  const resp: any = await request(CREDITCLUB_GRAPH_URL[chainId], query, variables);

  // @ts-ignore
  const flattened: IInvitation[] = resp.invitations.map(item => ({
    id: item.id,
    sender: item.sender.id,
    receiver: item.receiver.id,
    timestamp: Number(item.timestamp),
    block: BigInt(item.block),
  }));

  return flattened;
}
