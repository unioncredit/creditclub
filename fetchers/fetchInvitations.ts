import { request, gql } from "graphql-request";
import { Address } from "viem";

export interface IInvitation {
  id: string;
  sender: Address;
  receiver: Address;
  timestamp: number;
  block: bigint;
}

export const fetchInvitations = async (
  vaultAddress: Address,
  where: Record<string, string> = {}
) => {
  if (!vaultAddress) {
    return [];
  }

  const query = gql`
      query ($limit: Int!, $where: invitationFilter!) {
          invitations (
              limit: $limit,
              where: $where,
          ) {
              items {
                  id,
                  sender,
                  receiver,
                  timestamp,
                  block,
              }
          }
      }
  `;

  const variables = {
    limit: 50,
    where: {
      ...where,
      vaultAddress: vaultAddress.toLowerCase(),
    }
  };

  // @ts-ignore
  const resp: any = await request(process.env.NEXT_PUBLIC_PONDER_URL, query, variables);

  // @ts-ignore
  const flattened: IInvitation[] = resp.invitations.items.map(item => ({
    id: item.id,
    sender: item.sender,
    receiver: item.receiver,
    timestamp: Number(item.timestamp),
    block: BigInt(item.block),
  }));

  return flattened;
}
