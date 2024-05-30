import { formattedNumber } from "@/utils/format.ts";
import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";
import { useContacts } from "@/providers/CreditClubContactsProvider.tsx";

export const useCreditPerMember = () => {
  const { data: creditClub } = useCreditClub();
  const { data: contacts } = useContacts();

  const { stakedBalance } = creditClub;

  return {
    data: formattedNumber(stakedBalance / (contacts.length > 0 ? BigInt(contacts.length) : 1n))
  }
}