import { format } from "@/utils/format.ts";
import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";

export const useCreditPerMember = () => {
  const { data: creditClub } = useCreditClub();

  const { proRataAmount } = creditClub;

  return {
    data: format(proRataAmount)
  }
}