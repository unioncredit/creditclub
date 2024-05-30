import "./ContactsTableRow.scss";
// @ts-ignore
import { Box, TableCell, TableRow, Text } from "@unioncredit/ui";
import { DimmableTableCell } from "@/components/table/DimmableTableCell.tsx";
import { Avatar } from "@/components/shared/Avatar.tsx";
import { format, truncateAddress, truncateEns } from "@/utils/format.ts";
import { COLUMNS } from "@/components/table/ContactsTable.tsx";
import { IContact } from "@/providers/types.ts";
import { useLastRepay } from "@/hooks/useLastRepay.ts";
import { StatusBadge } from "@/components/table/StatusBadge.tsx";

export const ContactsTableRow = ({
  contact,
}: {
  contact: IContact;
}) => {
  const {
    address,
    ens,
    vouch,
    locking,
    lastRepay,
  } = contact;

  const { formatted: lastRepayFormatted, paymentDue } = useLastRepay(lastRepay);

  const columns = [
    {
      ...COLUMNS.CLUB_CREDIT,
      value: (
        <DimmableTableCell
          key={COLUMNS.CLUB_CREDIT.id}
          dimmed={vouch <= 0n}
          value={`${format(vouch)} DAI`}
        />
      ),
    },
    {
      ...COLUMNS.CLUB_DEBT,
      value: (
        <DimmableTableCell
          key={COLUMNS.CLUB_DEBT.id}
          dimmed={locking <= 0n}
          value={`${format(locking)} DAI`}
        />
      ),
    },
    {
      ...COLUMNS.LAST_PAYMENT,
      value: (
        <TableCell key={COLUMNS.LAST_PAYMENT.id} align="right" weight="medium">
          <Box direction="vertical" align="flex-end">
            <Text grey={800} m={0} size="medium" weight="medium">
              {lastRepayFormatted ?? "---"}
            </Text>

            <Text size="small" grey={400} m={0}>
              {locking > 0n
                ? paymentDue.overdue
                  ? `${paymentDue.formatted} overdue`
                  : `Next due in ${paymentDue.formatted}`
                : "Nothing due"}
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
            <StatusBadge contact={contact} />
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
              {ens ? truncateEns(ens) : truncateAddress(address)}
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
