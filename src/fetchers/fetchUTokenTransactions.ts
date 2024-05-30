import { request, gql } from "graphql-request";

import { TransactionTypes, GRAPH_URL } from "@/constants";
import { Address } from "viem";

export const fetchUTokenTransactions = async (
  address: Address
) =>{
  const query = gql`
      query ($first: Int, $account: Bytes) {
          ${TransactionTypes.BORROW}: borrows(first: $first, where: { account: $account }) {
              id
              account
              amount
              fee
              timestamp
          }
          ${TransactionTypes.REPAY}: repays(first: $first, where: { account: $account }) {
              id
              account
              amount
              timestamp
          }
      }
  `;

  const variables = {
    first: 100,
    account: address,
  };

  const resp: any = await request(GRAPH_URL, query, variables);

  // @ts-ignore
  const flattened: any[] = Object.keys(resp).reduce((acc, key) => {
    // @ts-ignore
    const parsed = resp[key].map((item) => {
      return {
        ...item,
        address: item.account,
        type: key,
      };
    });

    return [...acc, ...parsed];
  }, []);

  const sorted = flattened.sort((a, b) => {
    return Number(b.timestamp) - Number(a.timestamp);
  });

  return sorted;
}
