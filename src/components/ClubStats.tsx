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
import { useCreditPerMember } from "@/hooks/useCreditPerMember.ts";

export const ClubStats = () => {
  const { open } = useModals();
  const { isConnected } = useAccount();
  const { data: contacts } = useContacts();
  const { data: stats } = useCreditClub();
  const { data: member } = useMember();
  const { data: creditPerMember } = useCreditPerMember();

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
          />

          <ButtonRow>
            {!isMember && (
              <Button
                size="large"
                label="Public Bid"
                color="secondary"
                variant="light"
                icon={DepositIcon}
                disabled={!isConnected}
                onClick={() => open(BID_BUCKET_MODAL)}
              />
            )}
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
              size="regular"
              title="Available"
              dotColor="blue500"
              value={format(availableAmount)}
            />

            <p className="ClubStats__pill">${creditPerMember} per Member</p>
          </Box>

          <Box fluid className="ClubStats__item" pr="8px">
            <NumericalBlock
              fluid
              align="left"
              token="dai"
              size="regular"
              title="Utilized"
              dotColor="violet500"
              value={format(totalLockedStake)}
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
              size="regular"
              title="Defaulting"
              dotColor="red500"
              value={format(defaultedAmount)}
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
        />

        <Button
          size="large"
          label="Daily Distribution"
          color="secondary"
          variant="light"
          icon={ConfettiIcon}
          onClick={() => open(FEELING_LUCKY_MODAL)}
          disabled={!isConnected}
        />
      </Card.Footer>
    </Card>
  );
}
