import { useClubData } from "@/providers/CreditClubDataProvider.tsx";
import { useClubMember } from "@/providers/CreditClubMemberProvider.tsx";
import { PRO_RATA_DENOMINATOR, PRO_RATA_MIN_MEMBER_NUM, TOKENS, WAD } from "@/constants.ts";
import { format } from "@/utils/format.ts";
import { useToken } from "@/hooks/useToken.ts";

export const useMemberCredit = () => {
  const { data: creditClub } = useClubData();
  const { data: member } = useClubMember();
  const { token } = useToken();

  const { vouch, percentVested } = member;
  const {
    proRataAmount,
    percentageFull,
    stakedBalance,
    totalSupply,
  } = creditClub;

  const proRataStakedAmount = stakedBalance * PRO_RATA_DENOMINATOR;
  const proRataTotalSupply = totalSupply < PRO_RATA_MIN_MEMBER_NUM
    ? PRO_RATA_MIN_MEMBER_NUM
    : totalSupply;
  const newMemberProRataAmount = percentageFull && proRataTotalSupply
    ? proRataStakedAmount / BigInt(percentageFull) / (proRataTotalSupply + 1n)
    : 0n;
  const maxVestedAmount = (proRataAmount * (percentVested || 0n)) / WAD[TOKENS.DAI];
  const difference = maxVestedAmount - vouch;

  console.log({ newMemberProRataAmount });

  return {
    new: newMemberProRataAmount, // the pro rata amount for a new member
    max: maxVestedAmount, // the maximum vouch this user can receive based on the vesting percentage
    active: proRataAmount, // the active pro rata amount
    current: vouch, // the existing members vouch amount from the club
    difference:  `${difference < 0n ? `-$${format(difference * -1n, token)}` : `+$${format(difference, token)}`}`
  }
}