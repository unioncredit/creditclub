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

  // Track if any data is still loading
  const isDataLoading = clubDataLoading || memberNftDataLoading || clubMemberLoading;
  
  // If any data is still loading, show loading state
  if (isDataLoading) {
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

  // Additional safety check - if critical data is missing, don't render
  if (!clubData || !memberNftData || !clubMember) {
    return (
      <div className="p-4 border rounded-2xl bg-slate-50">
        <div className="text-center text-gray-500">
          Loading member data...
        </div>
      </div>
    );
  }

  // Debug logging to identify React Error #310 source
  if (process.env.NODE_ENV === 'development') {
    console.log('ClubActions Debug:', {
      clubData: typeof clubData,
      memberNftData: typeof memberNftData,
      clubMember: typeof clubMember,
      token: typeof token,
      tokenValue: token
    });
  }

  // Extract values using the established wagmi pattern - hooks already provide safe values
  const {
    name = "",
    isActivated = false,
    startingPercentTrust = 0n,
  } = clubData || {};

  const {
    isInviteEnabled = false,
  } = memberNftData || {};

  const {
    owed = 0n,
    vouch = 0n,
    tokenId = 0n,
    active = false,
    isMember = false,
    badDebt = 0n,
    memberNftBalance = 0n,
    percentVested = 0n,
    baseTrust = 0n,
  } = clubMember || {};

  const {
    enabled: vestingEnabled = false,
    duration: vestingDuration = 0,
    vestedDays = 0,
  } = vestingData || {};

  // Ensure all values are safe primitives
  const safeName = String(name || "");
  const safeTokenId = typeof tokenId === 'bigint' ? tokenId : 0n;
  const safeVestedDays = Number(vestedDays || 0);
  const safeVestingDuration = Number(vestingDuration || 0);
  const safeVouch = typeof vouch === 'bigint' ? vouch : 0n;
  const safeOwed = typeof owed === 'bigint' ? owed : 0n;
  const safeToken = token || "USDC";

  // Calculate claimable credit amount using established pattern
  const WAD = 10n ** 18n;
  const startingAmount = baseTrust > 0n && startingPercentTrust > 0n
    ? (baseTrust * startingPercentTrust) / WAD 
    : 0n;
  
  const additionalVested = baseTrust > startingAmount && percentVested > 0n
    ? ((baseTrust - startingAmount) * percentVested) / WAD 
    : 0n;
  
  const totalVested = startingAmount + additionalVested;
  const claimableAmount = totalVested > vouch ? totalVested - vouch : 0n;
  
  // Ensure claimableAmount is a safe bigint
  const safeClaimableAmount = typeof claimableAmount === 'bigint' ? claimableAmount : 0n;

  const claimCreditButtonProps = useWrite({
    address: creditVaultContract.address,
    abi: creditVaultContract.abi,
    functionName: "claimCredit",
    args: [safeTokenId],
    onComplete: refetchClubMember,
  });

  // Determine if claim credit should be disabled and why
  const cannotClaimReason = !isActivated ? "Vault is not activated"
    : !isMember ? "You must be a member to claim credit"
    : memberNftBalance === 0n ? "You don't own a member NFT"
    : safeTokenId === 0n ? "Unable to find your member NFT token ID"
    : !active ? "Your membership is not active - you may need to activate it first"
    : badDebt > 0n ? "Cannot claim with outstanding bad debt"
    : safeClaimableAmount === 0n ? "No credit available to claim (already claimed or not vested yet)"
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
          {getInitials(safeName)}
        </TextCube>
        <p className="text-lg">{safeName} Member #{safeTokenId.toString()}</p>
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
              <p className="text-sm font-medium">${format(safeVouch, safeToken)}</p>
              <p className="text-xs text-stone-400">+${format(safeClaimableAmount, safeToken)}</p>
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
              <p className="text-sm font-medium">${format(safeOwed, safeToken)}</p>
            </div>
          </div>

          <RoundedButton
            onClick={() => openModal(REPAY_MODAL)}
            disabled={safeOwed === 0n}
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
            title={safeOwed === 0n ? "No debt to repay" : undefined}
          >
            Repay
          </RoundedButton>
        </div>
      </div>
    </div>
  )
};