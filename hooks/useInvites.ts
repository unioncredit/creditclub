import { Address } from "viem";
import { useAccount } from "wagmi";

import { useClubMember } from "@/hooks/useClubMember";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";

export const useInvites = (clubAddress: Address) => {
  const { address } = useAccount();
  const { data: memberNftData, refetch: refetchClubMemberNft } = useClubMemberNft(clubAddress);
  const { data: memberData, refetch: refetchClubMember } = useClubMember(address, clubAddress);

  const isInviteEnabled: boolean = memberNftData?.isInviteEnabled ?? false;
  const isInvited: boolean = memberData?.isInvited ?? false;

  const data = {
    enabled: isInviteEnabled,
    memberInvitesEnabled: isInviteEnabled,
    qualified: isInvited
  };

  const refetch = () => {
    refetchClubMemberNft();
    refetchClubMember();
  }

  return { refetch, data };
};