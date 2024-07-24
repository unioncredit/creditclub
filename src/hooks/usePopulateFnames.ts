import { IContact } from "@/providers/types.ts";
import { useLazyQuery } from "@airstack/airstack-react";

export const usePopulateFnames = (contacts: IContact[]) => {
  const addresses = contacts.map(c => c.address);
  const query = `
query MyQuery ($addresses: [Identity!]) {
  Socials(
    input: {filter: {identity: {_in: $addresses}, dappName: {_eq: farcaster}}, blockchain: ethereum}
  ) {
    Social {
      profileName
      fid: userId
      addresses: userAssociatedAddresses
      avatar: profileImage
    }
  }
}
`;

  // We have to use lazy loading and manual fetching because of a bug in the useQuery function that doesn't detect changes in our addresses variable
  const [fetch, { data, loading }] = useLazyQuery(query, { addresses }, { cache: false });
  if (contacts.length > 0 && !loading && !data) {
    fetch();
  }

  return data ? contacts.map(c => ({
    ...c,
    ens: c.ens || data.Socials?.Social?.find((s: any) => s.addresses.includes(c.address.toLowerCase()))?.profileName || null
  })) : contacts;
}
