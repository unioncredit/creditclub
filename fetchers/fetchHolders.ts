import { request, gql } from "graphql-request";
import { Address } from "viem";

export interface Holder {
  address: Address;
  amount: bigint;
}

export const fetchHolders = async (clubAddress: Address) => {
  if (!clubAddress) {
    return [];
  }

  const query = gql`
      query ($vaultAddress: String!, $limit: Int!) {
          vaultHolders (
              limit: $limit,
              where: { vaultAddress: $vaultAddress },
          ) {
              items {
                  address: accountAddress
                  amount
              }
          }
      }
  `;

  const variables = {
    limit: 1000,
    vaultAddress: clubAddress.toLowerCase(),
  };

  // @ts-ignore
  const resp: any = await request(process.env.NEXT_PUBLIC_PONDER_URL, query, variables);

  // @ts-ignore
  const flattened: Holder[] = resp.holders.items.map(item => ({
    address: item.address,
    amount: BigInt(item.amount),
  }));

  return flattened;
}
