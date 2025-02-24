// @ts-ignore
import { ConfettiIcon, UnionIcon } from "@unioncredit/ui";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { DistributionBarItem, DistributionBarValues } from "@/components/shared/DistributionBarValues";
import { FormattedValue } from "@/components/shared/FormattedValue";
import { useClubData } from "@/hooks/useClubData";
import { useToken } from "@/hooks/useToken";
import { format, formattedNumber } from "@/lib/format";
import { useModals } from "@/providers/ModalManagerProvider";
import { FIXED_BID_MODAL } from "@/components/modals/FixedBidModal";
import { REWARDS_RAFFLE_MODAL } from "@/components/modals/RewardsRaffleModal";
import { TOKENS } from "@/constants";
import { useClubContacts } from "@/hooks/useClubContacts";

export const ClubStats = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubContacts } = useClubContacts(clubAddress);
  const { open: openModal } = useModals();
  const { isConnected } = useAccount();
  const { token } = useToken();

  const { stakedBalance, totalLockedStake, unclaimedRewards } = clubData;

  const defaultedContacts = clubContacts.filter((v) => v.isOverdue);
  const defaultedAmount = defaultedContacts.reduce((acc, c) => acc + c.locking, 0n);
  const availableAmount = stakedBalance - totalLockedStake;

  const barValues: DistributionBarItem[] = [
    {
      value: formattedNumber(availableAmount, token),
      label: `$${format(availableAmount, token)}`,
      color: "blue900",
      title: "Available",
    },
    {
      value: formattedNumber(totalLockedStake, token),
      label: `$${format(totalLockedStake, token)}`,
      color: "blue500",
      title: "Utilized",
    },
    {
      value: 0,
      label: `$${format(defaultedAmount, token)}`,
      color: "amber500",
      title: "Defaulting",
    }
  ];

  return (
    <div className="mt-8 p-4 border rounded-2xl">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm text-stone-500">Club Stake</h3>
          <p className="text-3xl font-mono">${format(stakedBalance, token)}</p>
        </div>

        {isConnected && (
          <RoundedButton size="small" onClick={() => openModal(FIXED_BID_MODAL, { clubAddress: clubAddress })}>
            <UnionIcon width={24}/>
            Fixed BID
          </RoundedButton>
        )}
      </header>

      <DistributionBarValues items={barValues}/>

      <footer className="mt-4 pt-4 border-t flex items-center gap-4 justify-between sm:flex-col">
        <div>
          <h3 className="font-medium text-sm text-stone-500">Rewards to Distribute</h3>
          <FormattedValue
            value={format(unclaimedRewards, TOKENS.UNION, 4)}
            className="text-3xl font-medium"
            smallDecimals={true}
          />
        </div>

        <RoundedButton
          size="large"
          variant="rainbow"
          icon={<ConfettiIcon width={24} height={24} />}
          className="w-[200px] sm:w-full"
          onClick={() => openModal(REWARDS_RAFFLE_MODAL, { clubAddress: clubAddress })}
        >
          Daily Distribution
        </RoundedButton>
      </footer>
    </div>
  );
}
