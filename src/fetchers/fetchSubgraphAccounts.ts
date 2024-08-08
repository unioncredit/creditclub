import { request, gql } from "graphql-request";

import { CREDITCLUB_GRAPH_URL } from "@/constants";
import { Address } from "viem";

interface ISubgraphAccountsResponse {
  accounts: {
    address: Address;
    unionWon: string;
    unionEarned: string;
  }[];
}

export interface SubgraphAccount {
  unionWon: bigint;
  unionEarned: bigint;
}

export const fetchSubgraphAccounts = async () =>{
  const first = 1000;
  let count = 0;
  let skip = 0;
  const result: Record<Address, SubgraphAccount> = {};

  do {
    const { accounts } = (await request<ISubgraphAccountsResponse>(
        CREDITCLUB_GRAPH_URL,
        gql`
            query ($first: Int!, $skip: Int!) {
                accounts (first: $first, skip: $skip) {
                    address: id
                    unionWon
                    unionEarned
                }
            }
        `, {
          "first": first,
          "skip": skip,
        })
    );

    count = accounts.length;
    if (count === 0) {
      return {};
    }

    accounts.forEach(account => {
      result[account.address] = {
        unionWon: BigInt(account.unionWon),
        unionEarned: BigInt(account.unionEarned),
      };
    });

    skip += first;
  } while (count >= first);

  return result;
}
