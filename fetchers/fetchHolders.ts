import { request, gql } from "graphql-request";
import { Address } from "viem";

export interface Holder {
  id: Address;
  amount: bigint;
}

export const fetchHolders = async () => {
  const query = gql`
      query ($first: Int!) {
          holders (first: $first) {
              id
              amount
          }
      }
  `;

  const variables = {
    first: 1000,
  };

  // @ts-ignore
  const resp: any = await request(process.env.NEXT_PUBLIC_SUBGRAPH_URL, query, variables);

  // @ts-ignore
  const flattened: Holder[] = resp.holders.map(item => ({
    id: item.id,
    amount: BigInt(item.amount),
  }));

  return flattened;
}
