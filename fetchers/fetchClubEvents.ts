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

  const ponderUrl = process.env.NEXT_PUBLIC_PONDER_URL;
  if (!ponderUrl) {
    console.error("NEXT_PUBLIC_PONDER_URL is not defined");
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

  try {
    // @ts-ignore
    const resp: any = await request(ponderUrl, query, variables);

    if (!resp?.events?.items) {
      console.error("Invalid response structure from Ponder API");
      return [];
    }

    const flattened: IClubEvent[] = resp.events.items.map((item: any) => ({
      type: item.type || ActivityTypes.LOADING,
      amount: BigInt(item.amount || 0),
      address: item.account || "0x0",
      hash: item.hash || "0x0",
    }));

    return flattened;
  } catch (error) {
    console.error("Error fetching club events:", error);
    return [];
  }
}
