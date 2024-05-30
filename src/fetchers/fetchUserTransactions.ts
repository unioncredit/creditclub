import { request, gql } from "graphql-request";

import { TransactionTypes, GRAPH_URL } from "@/constants";
import { Address } from "viem";

const query = gql`
    query (
        $first: Int,
        $vouchCancellationsFilter: VouchCancellation_filter,
        $trustLinesFilter: TrustLine_filter,
        $trustLinesFilter_Vouch: TrustLine_filter
    ) {
        ${TransactionTypes.CANCEL}: vouchCancellations(first: $first, where: $vouchCancellationsFilter) {
            id
            borrower
            staker
            timestamp
        }
        ${TransactionTypes.TRUST}: trustLines(first: $first, where: $trustLinesFilter) {
            id
            amount
            borrower
            staker
            timestamp
        }
        ${TransactionTypes.TRUSTED}: trustLines(first: $first, where: $trustLinesFilter_Vouch) {
            id
            amount
            borrower
            staker
            timestamp
        }
    }
`;

export const fetchUserTransactions = async (
  staker: Address,
) => {
  const variables = {
    first: 100,
    vouchCancellationsFilter: {
      staker,
    },
    trustLinesFilter: {
      staker,
    },
    trustLinesFilter_Vouch: {
      borrower: staker,
    },
  };

  const resp = await request(GRAPH_URL, query, variables);

  // @ts-ignore
  const flattened: any[] = Object.keys(resp).reduce((acc, key) => {
    // @ts-ignore
    const parsed = resp[key].map((item) => {
      if (key === TransactionTypes.TRUST) {
        item.address = item.borrower;
      }

      return {
        ...item,
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
