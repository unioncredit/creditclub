import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { TalentPassportSocial } from "@/pages/api/[address]/socials";

export const useTalentSocials = (address: Address) => {
  return useQuery<TalentPassportSocial[]>({
    enabled: !!address,
    staleTime: 120_000,
    queryKey: ["useTalentSocials", address],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/${address}/socials`);

      if (response.status === 200 || response.status === 304) {
        return response.json();
      }

      return [];
    },
    initialDataUpdatedAt: -1,
    initialData: [],
  });
};