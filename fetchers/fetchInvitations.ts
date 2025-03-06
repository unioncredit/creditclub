import { request, gql } from "graphql-request";
import { Address } from "viem";

import { objectToWhere } from "@/lib/utils";


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

  // @ts-ignore
  const resp: any = await request(process.env.NEXT_PUBLIC_SUBGRAPH_URL, query, variables);

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
