import { Address } from "viem";
import { useAccount } from "wagmi";
import {
  ClaimIcon,
  CalendarIcon,
  VouchIcon,
  RepayIcon,
// @ts-ignore
} from "@unioncredit/ui";

import { TextCube } from "@/components/shared/TextCube";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { IconCube } from "@/components/shared/IconCube";
import { useClubMember } from "@/hooks/useClubMember";
import { useToken } from "@/hooks/useToken";
import { format } from "@/lib/format";
import { useClubData } from "@/hooks/useClubData";
import { getInitials } from "@/lib/utils";
import { useVesting } from "@/hooks/useVesting";
import { useWrite } from "@/hooks/useWrite";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useModals } from "@/providers/ModalManagerProvider";
import { REPAY_MODAL } from "@/components/modals/RepayModal";
import { INVITE_MODAL } from "@/components/modals/InviteModal";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";

export const ClubActions = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { token } = useToken();
  const { address } = useAccount();
  const { open: openModal } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { data: memberNftData } = useClubMemberNft(clubAddress);
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(address, clubAddress);
  const { data: vestingData } = useVesting(clubAddress);

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const { name = "", isActivated = false, startingPercentTrust = 0n } = clubData || {};
  const { isInviteEnabled = false } = memberNftData || {};
  const { 
    owed = 0n, 
    vouch = 0n, 
    tokenId = 0n, 
    active = false, 
    isMember = false, 
    badDebt = 0n, 
    memberNftBalance = 0n, 
    percentVested = 0n, 
    baseTrust = 0n 
  } = clubMember || {};
  const {
    enabled: vestingEnabled = false,
    duration: vestingDuration = 0,
    vestedDays = 0,
  } = vestingData || {};

  // Calculate claimable credit amount
  const WAD: bigint = 10n ** 18n;
  const baseTrustBigInt: bigint = baseTrust || 0n;
  const startingPercentTrustBigInt: bigint = startingPercentTrust || 0n;
  const percentVestedBigInt: bigint = percentVested || 0n;
  const vouchBigInt: bigint = vouch || 0n;
  
  const startingAmount: bigint = baseTrustBigInt && startingPercentTrustBigInt 
    ? (baseTrustBigInt * startingPercentTrustBigInt) / WAD 
    : 0n;
  
  const additionalVested: bigint = baseTrustBigInt && baseTrustBigInt > startingAmount 
    ? ((baseTrustBigInt - startingAmount) * percentVestedBigInt) / WAD 
    : 0n;
  
  const totalVested: bigint = startingAmount + additionalVested;
  const claimableAmount: bigint = totalVested > vouchBigInt ? totalVested - vouchBigInt : 0n;

  // Debug logging
  console.log("ClubActions debug:", {
    tokenId: tokenId?.toString(),
    memberNftBalance: memberNftBalance?.toString(),
    isMember,
    active,
    badDebt: badDebt?.toString(),
    owed: owed?.toString(),
    vouch: vouchBigInt?.toString(),
    baseTrust: baseTrustBigInt?.toString(),
    startingPercentTrust: startingPercentTrustBigInt?.toString(),
    percentVested: percentVestedBigInt?.toString(),
    startingAmount: startingAmount?.toString(),
    additionalVested: additionalVested?.toString(),
    totalVested: totalVested?.toString(),
    claimableAmount: claimableAmount?.toString(),
    clubAddress,
    userAddress: address,
    isVaultActivated: isActivated,
    vestingEnabled,
    vestedDays,
  });

  const claimCreditButtonProps = useWrite({
    ...creditVaultContract,
    functionName: "claimCredit",
    args: [tokenId],
    onComplete: refetchClubMember,
    onError: (error: any) => {
      console.error("claimCredit failed:", error);
      if (error.message) {
        console.error("Error message:", error.message);
      }
      if (error.cause) {
        console.error("Error cause:", error.cause);
      }
    },
  });

  // Determine if claim credit should be disabled and why
  const cannotClaimReason = !isActivated ? "Vault is not activated"
    : !isMember ? "You must be a member to claim credit"
    : memberNftBalance === 0n ? "You don't own a member NFT"
    : tokenId === 0n ? "Unable to find your member NFT token ID"
    : !active ? "Your membership is not active - you may need to activate it first"
    : badDebt && badDebt > 0n ? "Cannot claim with outstanding bad debt"
    : claimableAmount === 0n ? "No credit available to claim (already claimed or not vested yet)"
    : null;

  return (
    <div className="p-4 border rounded-2xl bg-slate-50">
      <header className="flex items-center justify-between gap-2 border-b pb-4">
        <h2 className="text-xl text-stone-500 font-medium">Club Member Actions</h2>

        {isInviteEnabled && (
          <RoundedButton
            size="small"
            className="p-3 h-10"
            icon={<VouchIcon width={24} />}
            onClick={() => openModal(INVITE_MODAL, { clubAddress })}
          >
            Invite
          </RoundedButton>
        )}
      </header>

      <div className="mt-4 flex items-center justify-center gap-3 py-3 px-5 bg-slate-100 rounded-2xl border">
        <TextCube width={48} height={48} background="#1F1D29" foreground="white">
          {getInitials(name)}
        </TextCube>
        <p className="text-lg">{name} Member #{tokenId.toString()}</p>
      </div>

      {vestingEnabled && (
        <div className="flex items-center justify-center gap-0.5 mt-2">
          <CalendarIcon width={24} height={24} />
          <p className="text-xs text-blue-600">Vesting: {vestedDays} of {vestingDuration} days vested</p>
        </div>
      )}

      <div className="flex flex-col mt-4 gap-2">
        <div className="flex gap-2">
          <div className="flex flex-1 items-center justify-between bg-white py-2 px-3 border rounded-lg">
            <p>Club Credit</p>

            <div className="text-right">
              <p className="text-sm font-medium">${format(vouch, token)}</p>
              <p className="text-xs text-stone-400">+${format(claimableAmount, token)}</p>
            </div>
          </div>

          <RoundedButton
            {...claimCreditButtonProps}
            disabled={!!cannotClaimReason}
            className="bg-[#E3F6EC] hover:bg-[#E3F6EC] hover:opacity-90 h-[54px] text-[#1C9451] w-[156px] justify-start"
            icon={(
              <IconCube
                width={18}
                height={18}
                icon={ClaimIcon}
                color="#C4EBD5"
                className="p-1"
              />
            )}
            title={cannotClaimReason || undefined}
          >
            Claim Credit
          </RoundedButton>
        </div>

        <div className="flex gap-2">
          <div className="flex flex-1 items-center justify-between bg-white py-2 px-3 border rounded-lg">
            <p>Club Debt</p>

            <div>
              <p className="text-sm font-medium">${format(owed, token)}</p>
            </div>
          </div>

          <RoundedButton
            disabled={owed === 0n}
            icon={(
              <IconCube
                width={18}
                height={18}
                icon={RepayIcon}
                color="#CEDCFF"
                className="p-1"
              />
            )}
            className="bg-[#EEF2FF] hover:bg-[#EEF2FF] hover:opacity-90 h-[54px] text-[#5F85FF] w-[156px] justify-start"
            onClick={() => openModal(REPAY_MODAL)}
          >
            Repay
          </RoundedButton>
        </div>
      </div>
    </div>
  )
};