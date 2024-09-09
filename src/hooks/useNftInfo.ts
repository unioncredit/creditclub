import { useClubData } from "@/providers/CreditClubDataProvider.tsx";

export const useNftInfo = () => {
  const { data: creditClub } = useClubData();
  const { contractURI } = creditClub;

  const jsonPart = contractURI.replace('data:application/json;utf8,', '');
  const decodedJson = decodeURIComponent(jsonPart);

  return JSON.parse(decodedJson || "{}");
}