import { useLazyQuery } from "@airstack/airstack-react";
import { useEffect } from "react";
import { Address } from "viem";

const query = `
query RetrieveFarcasterData ($address: Address!) {
  Socials(
    input: {blockchain: ethereum, filter: {userAssociatedAddresses: {_eq: $address}, dappName: {_eq: farcaster}}}
  ) {
    Social {
      name: profileName
      bio: profileBio
    }
  }
}
`;

export const useFarcasterData = (address: Address) => {
  // We have to use lazy loading and manual fetching because of a bug in the useQuery function that doesn't detect changes in our addresses variable
  const [fetch, { data: response, loading, error }] = useLazyQuery(
    query,
    { address: address.toLowerCase() },
    { cache: true }
  );

  useEffect(() => {
    fetch();
  }, [fetch, address]);

  const data = response?.Socials?.Social?.[0] || {
    name: null,
    bio: null,
  };

  return { data, error, loading };
};
