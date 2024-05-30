import "./ContactsTableRow.scss";

import { BadgeIndicator, Box, TableCell, TableRow, Text } from "@unioncredit/ui";
import { DimmableTableCell } from "@/components/table/DimmableTableCell.tsx";
import { Avatar } from "@/components/shared/Avatar.tsx";
import { Address } from "viem";
import { useEns } from "@/hooks/useEns.ts";
import { truncateAddress, truncateEns } from "@/utils/format.ts";

export const COLUMNS = {
  CLUB_CREDIT: {
    id: "club-credit",
    label: "Club Credit",
  },
  CLUB_DEBT: {
    id: "club-debt",
    label: "Club Debt",
  },
  LAST_PAYMENT: {
    id: "last-payment",
    label: "Last payment",
  },
  LOAN_STATUS: {
    id: "loan-status",
    label: "Loan status",
  },
};

export const ContactsTableRow = ({
  address,
}: {
  address: Address;
}) => {
  const { name } = useEns(address);

  const columns = [
    {
      ...COLUMNS.CLUB_CREDIT,
      value: (
        <DimmableTableCell
          key={COLUMNS.CLUB_CREDIT.id}
          dimmed={true}
          value={`0.00 DAI`}
        />
      ),
    },
    {
      ...COLUMNS.CLUB_DEBT,
      value: (
        <DimmableTableCell
          key={COLUMNS.CLUB_DEBT.id}
          dimmed={true}
          value={`0.00 DAI`}
        />
      ),
    },
    {
      ...COLUMNS.LAST_PAYMENT,
      value: (
        <TableCell key={COLUMNS.LAST_PAYMENT.id} align="right" weight="medium">
          <Box direction="vertical" align="flex-end">
            <Text grey={800} m={0} size="medium" weight="medium">
              {"---"}
            </Text>

            <Text size="small" grey={400} m={0}>
              Nothing due
            </Text>
          </Box>
        </TableCell>
      ),
    },
    {
      ...COLUMNS.LOAN_STATUS,
      value: (
        <TableCell key={COLUMNS.LOAN_STATUS.id} align="right">
          <Box justify="flex-end" minw="120px">
            <BadgeIndicator label="Inactive" />
          </Box>
        </TableCell>
      ),
    },
  ];

  return (
    <TableRow className="ContactsTableRow">
      <TableCell fixedSize>
        <Avatar size={24} address={address} />
      </TableCell>

      <TableCell>
        <Box direction="vertical">
          <Box align="center">
            <Text grey={800} m={0} size="medium" weight="medium">
              {name ? truncateEns(name) : truncateAddress(address)}
            </Text>
          </Box>

          <Text size="small" grey={500} m={0} weight="medium">
            {truncateAddress(address)}
          </Text>
        </Box>
      </TableCell>

      {columns.map(({ value }) => value)}
    </TableRow>
  );
}
