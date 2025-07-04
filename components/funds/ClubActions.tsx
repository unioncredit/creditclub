import { Address } from "viem";
import { useAccount, useReadContract, useChainId, useConnectorClient } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
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
import { useProrata } from "@/hooks/useProrata";
import { DEFAULT_CHAIN_ID } from "@/constants";


export const ClubActions = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { token } = useToken();
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { data: connectorClient } = useConnectorClient();
  const { open: openModal } = useModals();
  const { user, ready, authenticated } = usePrivy();
  const { data: clubData, isLoading: clubDataLoading } = useClubData(clubAddress);
  const { data: memberNftData, isLoading: memberNftDataLoading } = useClubMemberNft(clubAddress);
  const { data: clubMember, refetch: refetchClubMember, isLoading: clubMemberLoading } = useClubMember(address, clubAddress);
  const { data: vestingData, isLoading: vestingDataLoading } = useVesting(clubAddress);
  const { data: prorataData, isLoading: prorataDataLoading } = useProrata(clubAddress);

  const creditVaultContract = useCreditVaultContract(clubAddress);

  // Get creditMultiple from contract - needed for accurate calculation
  const { data: creditMultiple, isLoading: creditMultipleLoading } = useReadContract({
    address: creditVaultContract.address,
    abi: creditVaultContract.abi,
    functionName: "creditMultiple",
  });

  // CRITICAL WALLET DEBUG - This could be the root cause!
  console.log("🚨 WALLET CONNECTION DEBUG:", {
    // Wagmi state
    wagmi: {
      address,
      isConnected,
      chainId,
      expectedChainId: DEFAULT_CHAIN_ID,
      chainMismatch: chainId !== DEFAULT_CHAIN_ID,
      connector: connector?.name || "none",
      connectorId: connector?.id || "none", 
      hasConnectorClient: !!connectorClient,
    },
    // Privy state  
    privy: {
      ready,
      authenticated,
      userId: user?.id || "none",
      walletAddress: user?.wallet?.address || "none",
      walletType: user?.wallet?.walletClientType || "none",
      connectorType: user?.wallet?.connectorType || "none",
    },
    // Mismatch detection
    addressMismatch: address !== user?.wallet?.address,
    bothConnected: isConnected && authenticated,
  });

  // Extract values with safe defaults - do this immediately after hooks
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
    tierPercentage = 0n,
  } = clubMember || {};

  const {
    enabled: vestingEnabled = false,
    duration: vestingDuration = 0,
    vestedDays = 0,
  } = vestingData || {};

  const {
    prorataAmount = 0n,
  } = prorataData || {};

  // Ensure all values are safe primitives
  const safeName = String(name || "");
  const safeTokenId = typeof tokenId === 'bigint' ? tokenId : 0n;
  const safeVestedDays = Number(vestedDays || 0);
  const safeVestingDuration = Number(vestingDuration || 0);
  const safeVouch = typeof vouch === 'bigint' ? vouch : 0n;
  const safeOwed = typeof owed === 'bigint' ? owed : 0n;
  const safeToken = token || "USDC";
  const safeProrataAmount = typeof prorataAmount === 'bigint' ? prorataAmount : 0n;
  const safeCreditMultiple = typeof creditMultiple === 'bigint' ? creditMultiple : 1000000000000000000n; // 1e18 as default
  const safeTierPercentage = typeof tierPercentage === 'bigint' ? tierPercentage : 0n;

  // Calculate claimable credit amount using the EXACT smart contract logic
  const WAD = 10n ** 18n;
  
  // Smart contract calculation replicates CreditMixin._claimCredit exactly
  const contractTrustAmount = (() => {
    // From contract: trustAmount = member.baseTrust
    let trustAmount = baseTrust;
    
    // From contract: if (member.isActive) { ... }
    if (active) {
      // From contract: uint256 proRataAmount = _calcProRataTrustAmount();
      const proRataAmount = safeProrataAmount;
      
      // From contract: uint256 vestedAmount = _calcVestedTrustAmount(member.updatedAt, proRataAmount);
      const currentPercentTrust = percentVested < WAD 
        ? ((WAD - startingPercentTrust) * percentVested) / WAD + startingPercentTrust
        : WAD;
      
      let vestedAmount = (proRataAmount * currentPercentTrust) / WAD;
      
      // From contract: if (tierPercent != 0) vestedAmount = vestedAmount * tierPercent / 100;
      if (safeTierPercentage !== 0n) {
        vestedAmount = (vestedAmount * safeTierPercentage) / 100n;
      }
      
      // From contract: vestedAmount = vestedAmount * creditMultiple / 1e18;
      vestedAmount = (vestedAmount * safeCreditMultiple) / WAD;
      
      // From contract: trustAmount += vestedAmount;
      trustAmount += vestedAmount;
    }
    
    return trustAmount;
  })();

  // Calculate what would be claimable (total trust - current vouch)
  const claimableAmount = contractTrustAmount > vouch ? contractTrustAmount - vouch : 0n;
  const safeClaimableAmount = typeof claimableAmount === 'bigint' ? claimableAmount : 0n;

  // Determine if claim credit should be disabled and why
  const cannotClaimReason = !isActivated ? "Vault is not activated"
    : !isMember ? "You must be a member to claim credit"
    : memberNftBalance === 0n ? "You don't own a member NFT"
    : safeTokenId === 0n ? "Unable to find your member NFT token ID"
    : !active ? "Your membership is not active - you may need to activate it first"
    : badDebt > 0n ? "Cannot claim with outstanding bad debt"
    : contractTrustAmount === 0n ? "No trust amount calculated by contract"
    : safeClaimableAmount === 0n ? "No credit available to claim (already claimed)"
    : null;

  // Ensure cannotClaimReason is always a string or null (never an object)
  const safeCannotClaimReason = typeof cannotClaimReason === 'string' ? cannotClaimReason : null;

  const claimCreditButtonProps = useWrite({
    address: creditVaultContract.address,
    abi: creditVaultContract.abi,
    functionName: "claimCredit",
    args: [safeTokenId],
    onComplete: refetchClubMember,
  });

  // Track if any data is still loading - moved after all hooks
  const isDataLoading = clubDataLoading || memberNftDataLoading || clubMemberLoading || vestingDataLoading || prorataDataLoading || creditMultipleLoading;

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

      {/* TEMP DEBUG: Transaction Status */}
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-medium text-red-800 mb-2">🚨 WALLET CONNECTION DEBUG</h3>
        <div className="text-xs text-red-700 space-y-1">
          <div><strong>WAGMI STATE:</strong></div>
          <div>• Connected: {isConnected ? "✅ Yes" : "❌ No"}</div>
          <div>• Address: {address || "❌ None"}</div>
          <div>• Chain ID: {chainId} (Expected: {DEFAULT_CHAIN_ID})</div>
          <div>• Chain Match: {chainId === DEFAULT_CHAIN_ID ? "✅ Yes" : "❌ NO - WRONG CHAIN!"}</div>
          <div>• Connector: {connector?.name || "❌ None"}</div>
          <div>• Has Signer: {connectorClient ? "✅ Yes" : "❌ NO - NO SIGNER!"}</div>
          
          <div className="pt-2"><strong>PRIVY STATE:</strong></div>
          <div>• Ready: {ready ? "✅ Yes" : "❌ No"}</div>
          <div>• Authenticated: {authenticated ? "✅ Yes" : "❌ No"}</div>
          <div>• User ID: {user?.id || "❌ None"}</div>
          <div>• Wallet Address: {user?.wallet?.address || "❌ None"}</div>
          
          <div className="pt-2"><strong>CRITICAL CHECKS:</strong></div>
          <div>• Address Match: {address === user?.wallet?.address ? "✅ Yes" : "❌ MISMATCH!"}</div>
          <div>• Both Connected: {isConnected && authenticated ? "✅ Yes" : "❌ NOT FULLY CONNECTED!"}</div>
          
          <div className="pt-2"><strong>TRANSACTION:</strong></div>
          <div>• Button Disabled: {claimCreditButtonProps.disabled ? "❌ Yes" : "✅ No"}</div>
          <div>• Contract Trust: {format(contractTrustAmount, safeToken)}</div>
        </div>
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
            disabled={claimCreditButtonProps.disabled || !!safeCannotClaimReason}
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
            title={safeCannotClaimReason || undefined}
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