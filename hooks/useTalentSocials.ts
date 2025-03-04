import { useQuery } from "@tanstack/react-query";
import { Address, zeroAddress } from "viem";
import { TalentPassportSocial } from "@/pages/api/[address]/socials";

export const useTalentSocials = (address: Address) => {
  return useQuery<TalentPassportSocial[]>({
    enabled: !!address && address !== zeroAddress,
    staleTime: 120_000,
    queryKey: ["useTalentSocials", address],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${address}/socials`);

      if (response.status === 200 || response.status === 304) {
        return response.json();
      }

      return [];
    },
    initialDataUpdatedAt: -1,
    initialData: [],
  });
};