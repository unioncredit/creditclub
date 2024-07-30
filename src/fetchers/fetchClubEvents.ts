import { request, gql } from "graphql-request";

import { CREDITCLUB_GRAPH_URL } from "@/constants";

export const fetchClubEvents = async () =>{
  const query = gql`
      query ($first: Int!) {
          clubEvents (first: $first, orderBy:timestamp, orderDirection: desc) {
              type
              timestamp
              amount
              account {
                  id
              }
          }
      }
  `;

  const variables = {
    first: 4,
  };

  const resp: any = await request(CREDITCLUB_GRAPH_URL, query, variables);

  // @ts-ignore
  const flattened: any[] = resp.clubEvents.map(item => ({
    type: item.type,
    amount: item.amount,
    address: item.account.id,
  }));

  return flattened;
}
