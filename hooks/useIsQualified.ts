import { Address } from "viem";
import { useGatingToken } from "@/hooks/useGatingToken";
import { useInvites } from "@/hooks/useInvites";

export const useIsQualified = (clubAddress: Address) => {
  const { data: gatingTokenData, refetch: refetchGatingToken } = useGatingToken(clubAddress);
  const { data: inviteData, refetch: refetchInvites } = useInvites(clubAddress);

  const inviteEnabled: boolean = inviteData?.enabled ?? false;
  const inviteQualified: boolean = inviteData?.qualified ?? false;

  const tokenEnabled: boolean = gatingTokenData?.enabled ?? false;
  const tokenQualified: boolean = gatingTokenData?.qualified ?? false;

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