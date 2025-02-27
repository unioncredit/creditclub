import { Address } from "viem";
import { useAccount } from "wagmi";
import {
  ClaimIcon,
  CalendarIcon,
  ChevronIcon,
  ManageIcon,
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

export const ClubActions = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { token } = useToken();
  const { address } = useAccount();
  const { open: openModal } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(address, clubAddress);
  const { data: vestingData } = useVesting(clubAddress);

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const { name } = clubData;
  const { owed, vouch, tokenId, previewCreditClaim } = clubMember;
  const {
    enabled: vestingEnabled,
    duration: vestingDuration,
    vestedDays,
  } = vestingData;

  const claimCreditButtonProps = useWrite({
    ...creditVaultContract,
    functionName: "claimCredit",
    args: [address],
    onComplete: refetchClubMember,
  });

  return (
    <div className="p-4 border rounded-2xl bg-slate-50">
      <header className="flex justify-between gap-2 border-b pb-4">
        <h2 className="text-lg text-stone-500 font-medium">Club Member Actions</h2>

        <div className="flex items-center">
          <ManageIcon width={24} height={24} />
          <ChevronIcon width={24} height={24} className="-ml-1.5" />
        </div>
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
              <p className="text-xs text-stone-400">+${format(previewCreditClaim - vouch, token)}</p>
            </div>
          </div>

          <RoundedButton
            {...claimCreditButtonProps}
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