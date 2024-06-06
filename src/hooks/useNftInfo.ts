import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";

export const useNftInfo = () => {
  const { data: creditClub } = useCreditClub();
  const { contractURI } = creditClub;

  const jsonPart = contractURI.replace('data:application/json;utf8,', '');
  const decodedJson = decodeURIComponent(jsonPart);

  return JSON.parse(decodedJson || "{}");
}