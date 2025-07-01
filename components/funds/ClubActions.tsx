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
  const { data: clubData, isLoading: clubDataLoading } = useClubData(clubAddress);
  const { data: memberNftData, isLoading: memberNftDataLoading } = useClubMemberNft(clubAddress);
  const { data: clubMember, refetch: refetchClubMember, isLoading: clubMemberLoading } = useClubMember(address, clubAddress);
  const { data: vestingData } = useVesting(clubAddress);

  const creditVaultContract = useCreditVaultContract(clubAddress);

  // If any data is still loading, show loading state
  if (clubDataLoading || memberNftDataLoading || clubMemberLoading) {
    return (
      <div className="p-4 border rounded-2xl bg-slate-50">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-16 bg-slate-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-14 bg-slate-200 rounded"></div>
            <div className="h-14 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to safely calculate claimable amount
  const calculateClaimableAmount = (total: bigint, vouched: bigint): bigint => {
    if (total > vouched) {
      return total - vouched;
    }
    return 0n;
  };

  // Create clean objects without prototype pollution
  const cleanClubData = clubData ? {
    name: clubData.name || "",
    isActivated: clubData.isActivated || false,
    startingPercentTrust: clubData.startingPercentTrust || 0n,
  } : {
    name: "",
    isActivated: false,
    startingPercentTrust: 0n,
  };

  const cleanMemberNftData = memberNftData ? {
    isInviteEnabled: memberNftData.isInviteEnabled || false,
  } : {
    isInviteEnabled: false,
  };

  // Safely extract values with defaults - use Object.create(null) to avoid prototype
  const cleanClubMember = Object.create(null);
  if (clubMember) {
    cleanClubMember.owed = clubMember.owed || 0n;
    cleanClubMember.vouch = clubMember.vouch || 0n;
    cleanClubMember.tokenId = clubMember.tokenId || 0n;
    cleanClubMember.active = clubMember.active || false;
    cleanClubMember.isMember = clubMember.isMember || false;
    cleanClubMember.badDebt = clubMember.badDebt || 0n;
    cleanClubMember.memberNftBalance = clubMember.memberNftBalance || 0n;
    cleanClubMember.percentVested = clubMember.percentVested || 0n;
    cleanClubMember.baseTrust = clubMember.baseTrust || 0n;
  } else {
    cleanClubMember.owed = 0n;
    cleanClubMember.vouch = 0n;
    cleanClubMember.tokenId = 0n;
    cleanClubMember.active = false;
    cleanClubMember.isMember = false;
    cleanClubMember.badDebt = 0n;
    cleanClubMember.memberNftBalance = 0n;
    cleanClubMember.percentVested = 0n;
    cleanClubMember.baseTrust = 0n;
  }

  const {
    name,
    isActivated,
    startingPercentTrust,
  } = cleanClubData;

  const {
    isInviteEnabled,
  } = cleanMemberNftData;

  const {
    owed,
    vouch,
    tokenId,
    active,
    isMember,
    badDebt,
    memberNftBalance,
    percentVested,
    baseTrust,
  } = cleanClubMember;

  const cleanVestingData = vestingData ? {
    enabled: vestingData.enabled || false,
    duration: vestingData.duration || 0,
    vestedDays: vestingData.vestedDays || 0,
  } : {
    enabled: false,
    duration: 0,
    vestedDays: 0,
  };

  const {
    enabled: vestingEnabled,
    duration: vestingDuration,
    vestedDays,
  } = cleanVestingData;
  
  // Ensure vesting values are primitives
  const safeVestingDuration = typeof vestingDuration === 'number' ? vestingDuration : 0;
  const safeVestedDays = typeof vestedDays === 'number' ? vestedDays : 0;

  // Calculate claimable credit amount
  const WAD = 10n ** 18n;
  
  // Ensure all values are bigints before calculations
  const safeBigInt = (value: any): bigint => {
    try {
      return BigInt(value || 0);
    } catch {
      return 0n;
    }
  };
  
  const safeBaseTrust = safeBigInt(baseTrust);
  const safeStartingPercentTrust = safeBigInt(startingPercentTrust);
  const safePercentVested = safeBigInt(percentVested);
  const safeVouch = safeBigInt(vouch);
  
  const startingAmount = safeBaseTrust > 0n && safeStartingPercentTrust > 0n
    ? (safeBaseTrust * safeStartingPercentTrust) / WAD 
    : 0n;
  
  const additionalVested = safeBaseTrust > startingAmount && safePercentVested > 0n
    ? ((safeBaseTrust - startingAmount) * safePercentVested) / WAD 
    : 0n;
  
  const totalVested = startingAmount + additionalVested;
  const claimableAmount = calculateClaimableAmount(totalVested, safeVouch);

  const claimCreditButtonProps = useWrite({
    address: creditVaultContract.address,
    abi: creditVaultContract.abi,
    functionName: "claimCredit",
    args: [tokenId],
    onComplete: refetchClubMember,
  });

  // Determine if claim credit should be disabled and why
  const cannotClaimReason = !isActivated ? "Vault is not activated"
    : !isMember ? "You must be a member to claim credit"
    : memberNftBalance === 0n ? "You don't own a member NFT"
    : tokenId === 0n ? "Unable to find your member NFT token ID"
    : !active ? "Your membership is not active - you may need to activate it first"
    : badDebt > 0n ? "Cannot claim with outstanding bad debt"
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
          {getInitials(String(name || ""))}
        </TextCube>
        <p className="text-lg">{String(name || "")} Member #{tokenId?.toString() || "0"}</p>
      </div>

      {vestingEnabled && (
        <div className="flex items-center justify-center gap-0.5 mt-2">
          <CalendarIcon width={24} height={24} />
          <p className="text-xs text-blue-600">Vesting: {safeVestedDays} of {safeVestingDuration} days vested</p>
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
            onClick={claimCreditButtonProps.onClick}
            disabled={claimCreditButtonProps.disabled || !!cannotClaimReason}
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
            {claimCreditButtonProps.loading ? "Claiming..." : "Claim Credit"}
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
            onClick={() => openModal(REPAY_MODAL)}
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
          >
            Repay
          </RoundedButton>
        </div>
      </div>
    </div>
  )
};