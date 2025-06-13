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

  console.log('fetchHolders - Request variables:', variables);
  console.log('fetchHolders - Ponder URL:', process.env.NEXT_PUBLIC_PONDER_URL);

  try {
    if (!process.env.NEXT_PUBLIC_PONDER_URL) {
      console.error('fetchHolders - NEXT_PUBLIC_PONDER_URL environment variable not set');
      return [];
    }

    // @ts-ignore
    const resp: any = await request(process.env.NEXT_PUBLIC_PONDER_URL, query, variables);
    
    console.log('fetchHolders - Raw response:', resp);
    console.log('fetchHolders - vaultHolders in response:', resp.vaultHolders);

    if (!resp.vaultHolders || !resp.vaultHolders.items) {
      console.log('fetchHolders - No vaultHolders data found in response');
      return [];
    }

    // @ts-ignore
    const flattened: Holder[] = resp.vaultHolders.items.map(item => ({
      address: item.address,
      amount: BigInt(item.amount),
    }));

    console.log('fetchHolders - Processed holders:', flattened);
    
    // Additional debugging: Let's also check what other vault-related data exists
    console.log('fetchHolders - Checking for any vault-related data in Ponder...');
    
    // Try a broader query to see what's available
    const debugQuery = gql`
      query ($vaultAddress: String!) {
        vaultHolders(where: { vaultAddress: $vaultAddress }, limit: 5) {
          items {
            address: accountAddress
            amount
            vaultAddress
          }
        }
      }
    `;
    
    try {
      if (process.env.NEXT_PUBLIC_PONDER_URL) {
        const debugResp: any = await request(process.env.NEXT_PUBLIC_PONDER_URL, debugQuery, { vaultAddress: clubAddress.toLowerCase() });
        console.log('fetchHolders - Debug query response:', debugResp);
      } else {
        console.log('fetchHolders - NEXT_PUBLIC_PONDER_URL not defined, skipping debug query');
      }
    } catch (debugError) {
      console.log('fetchHolders - Debug query failed:', debugError);
    }
    
    return flattened;
  } catch (error) {
    console.error('fetchHolders - Error:', error);
    return [];
  }
}
