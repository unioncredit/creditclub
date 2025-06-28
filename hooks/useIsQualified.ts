import { Address } from "viem";
import { useGatingToken } from "@/hooks/useGatingToken";
import { useInvites } from "@/hooks/useInvites";

export const useIsQualified = (clubAddress: Address) => {
  const { data: gatingTokenData, refetch: refetchGatingToken } = useGatingToken(clubAddress);
  const { data: inviteData, refetch: refetchInvites } = useInvites(clubAddress);

  const {
    enabled: inviteEnabled = false,
    qualified: inviteQualified = false
  } = inviteData || {};

  const {
    enabled: tokenEnabled = false,
    qualified: tokenQualified = false,
  } = gatingTokenData || {};

  // Ensure we return a boolean, not undefined
  const isQualified = Boolean(
    (inviteEnabled && inviteQualified) && (!tokenEnabled || tokenQualified)
  );

  return {
    data: isQualified,
    refetch: () => {
      refetchGatingToken();
      refetchInvites();
    }
  }
};