import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";
import { useMember } from "@/providers/ConnectedMemberProvider.tsx";
import { PRO_RATA_DENOMINATOR, PRO_RATA_MIN_MEMBER_NUM } from "@/constants.ts";
import { format } from "@/utils/format.ts";

export const useMemberCredit = () => {
  const { data: creditClub } = useCreditClub();
  const { data: member } = useMember();

  const { vouch } = member;
  const {
    proRataAmount,
    percentageFull,
    stakedBalance,
    totalSupply
  } = creditClub;

  const proRataStakedAmount = stakedBalance * PRO_RATA_DENOMINATOR;
  const proRataTotalSupply = totalSupply < PRO_RATA_MIN_MEMBER_NUM
    ? PRO_RATA_MIN_MEMBER_NUM
    : totalSupply + 1n;
  const newMemberProRataAmount = percentageFull && proRataTotalSupply
    ? proRataStakedAmount / BigInt(percentageFull) / proRataTotalSupply
    : 0n;

  const difference = newMemberProRataAmount - vouch;

  return {
    new: newMemberProRataAmount, // the pro rata amount for a new member
    active: proRataAmount, // the active pro rata amount
    current: vouch, // the existing members vouch amount from the club
    difference:  `${difference < 0n ? `-$${format(difference * -1n)}` : `+$${format(difference)}`}`
  }
}