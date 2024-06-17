import "./ClubStats.scss";

import {
  Box,
  Button,
  ButtonRow,
  Card,
  DepositIcon,
  ConfettiIcon,
  DistributionBar,
  NumericalBlock,
  PlayIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useContacts } from "@/providers/CreditClubContactsProvider.tsx";
import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";
import { format, formattedNumber } from "@/utils/format.ts";
import { AddressesAvatarBadgeRow } from "@/components/shared/AddressesAvatarBadgeRow.tsx";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { FEELING_LUCKY_MODAL } from "@/components/modals/FeelingLuckyModal.tsx";
import { useRewards } from "@/hooks/useRewards.ts";
import { useAccount } from "wagmi";
import { BID_BUCKET_MODAL } from "@/components/modals/BidBucketModal.tsx";
import { useMember } from "@/providers/ConnectedMemberProvider.tsx";
import { useMemberCredit } from "@/hooks/useMemberCredit.ts";
import { useFeelingLuckyCountdown } from "@/hooks/useFeelingLuckyCountdown.ts";
import { UNION_TOKEN_PRICE_USD } from "@/constants.ts";

export const ClubStats = () => {
  const { open } = useModals();
  const { isConnected } = useAccount();
  const { data: contacts } = useContacts();
  const { data: stats } = useCreditClub();
  const { data: member } = useMember();
  const { active: creditPerMember } = useMemberCredit();
  const { complete, hours, minutes, seconds } = useFeelingLuckyCountdown();

  const { stakedBalance, totalLockedStake } = stats;
  const { isMember } = member;

  const {
    rewardsToDistribute,
  } = useRewards();

  const borrowingContacts = contacts.filter((v) => v.locking > 0n);
  const defaultedContacts = contacts.filter((v) => v.isOverdue);

  const availableAmount = stakedBalance - totalLockedStake;
  const defaultedAmount = defaultedContacts.reduce((acc, c) => acc + c.locking, 0n);

  return (
    <Card className="ClubStats">
      <Card.Body>
        <Box fluid align="center" justify="space-between" className="ClubStats__top">
          <NumericalBlock
            token="dai"
            align="left"
            title="Total Club Stake"
            value={format(stakedBalance)}
            smallDecimals
          />

          <ButtonRow>
            <Button
              size="large"
              label={isMember ? "Member Bid" : "Public Bid"}
              color="secondary"
              variant="light"
              icon={DepositIcon}
              disabled={!isConnected}
              onClick={() => open(BID_BUCKET_MODAL)}
            />
          </ButtonRow>
        </Box>

        <DistributionBar
          m="24px 0"
          items={[
            {
              value: formattedNumber(availableAmount),
              color: "blue500",
            },
            {
              value: formattedNumber(totalLockedStake),
              color: "violet500",
            },
            {
              value: formattedNumber(defaultedAmount),
              color: "red500",
            },
          ]}
        />

        <Box align="center" justify="space-between" className="ClubStats__bottom">
          <Box fluid className="ClubStats__item" pr="8px">
            <NumericalBlock
              align="left"
              token="dai"
              size="medium"
              title="Available"
              dotColor="blue500"
              value={format(availableAmount)}
              smallDecimals
            />

            <p className="ClubStats__pill">~${format(creditPerMember, 0)} per Member</p>
          </Box>

          <Box fluid className="ClubStats__item" pr="8px">
            <NumericalBlock
              fluid
              align="left"
              token="dai"
              size="medium"
              title="Utilized"
              dotColor="violet500"
              value={format(totalLockedStake)}
              smallDecimals
            />

            <AddressesAvatarBadgeRow
              mt="8px"
              addresses={borrowingContacts.map((v) => v.address)}
              label={borrowingContacts.length ? `${borrowingContacts.length} Contacts Borrowing` : "No Borrowers"}
              showLabel={!borrowingContacts.length || borrowingContacts.length > 6}
            />
          </Box>

          <Box fluid className="ClubStats__item">
            <NumericalBlock
              fluid
              align="left"
              token="dai"
              size="medium"
              title="Defaulting"
              dotColor="red500"
              value={format(defaultedAmount)}
              smallDecimals
            />

            <AddressesAvatarBadgeRow
              mt="8px"
              addresses={defaultedContacts.map((v) => v.address)}
              label={`${defaultedContacts.length ? defaultedContacts.length : "No"} Defaulters`}
              showLabel={!defaultedContacts.length || defaultedContacts.length > 6}
            />
          </Box>
        </Box>
      </Card.Body>

      <Card.Footer>
        <NumericalBlock
          pr="12px"
          token="union"
          align="left"
          title="Rewards to Distribute"
          value={rewardsToDistribute.toFixed(2)}
          subtitle={`~$${(rewardsToDistribute * UNION_TOKEN_PRICE_USD).toFixed(2)}`}
          smallDecimals
          className="RewardsToDistribute"
        />

        <Button
          className="DailyDistributionButton"
          size="large"
          label={complete ? "Daily Distribution" : `Callable in ${hours}h:${minutes}m:${seconds}s`}
          color="secondary"
          variant="light"
          icon={complete ? ConfettiIcon : PlayIcon}
          onClick={() => open(FEELING_LUCKY_MODAL)}
          disabled={!isConnected}
        />
      </Card.Footer>
    </Card>
  );
}
