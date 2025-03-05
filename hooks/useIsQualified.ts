import { Address } from "viem";
import { useGatingToken } from "@/hooks/useGatingToken";
import { useInvites } from "@/hooks/useInvites";

export const useIsQualified = (clubAddress: Address) => {
  const { data: gatingTokenData, refetch: refetchGatingToken } = useGatingToken(clubAddress);
  const { data: inviteData, refetch: refetchInvites } = useInvites(clubAddress);

  const {
    enabled: inviteEnabled,
    qualified: inviteQualified
  } = inviteData;

  const {
    enabled: tokenEnabled,
    qualified: tokenQualified,
  } = gatingTokenData;

  return {
    data: (inviteEnabled && inviteQualified) && (!tokenEnabled || tokenQualified),
    refetch: () => {
      refetchGatingToken();
      refetchInvites();
    }
  }
};