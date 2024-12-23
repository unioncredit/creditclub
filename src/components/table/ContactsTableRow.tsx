import "./ContactsTableRow.scss";
// @ts-ignore
import { Box, TableCell, TableRow, Text, LinkOutIcon, UnionIcon } from "@unioncredit/ui";
import { DimmableTableCell } from "@/components/table/DimmableTableCell.tsx";
import { Avatar } from "@/components/shared/Avatar.tsx";
import { format } from "@/utils/format.ts";
import { COLUMNS } from "@/components/table/ContactsTable.tsx";
import { IContact } from "@/providers/types.ts";
import { useLastRepay } from "@/hooks/useLastRepay.ts";
import { StatusBadge } from "@/components/table/StatusBadge.tsx";
import { usePrimaryLabel } from "@/hooks/usePrimaryLabel.ts";
import { useToken } from "@/hooks/useToken.ts";
import { TOKENS } from "@/constants.ts";

export const ContactsTableRow = ({
  contact,
}: {
  contact: IContact;
}) => {
  const {
    address,
    vouch,
    locking,
    lastRepay,
    unionWon,
    unionEarned,
  } = contact;

  const { token } = useToken();
  const { data: primaryLabel } = usePrimaryLabel({
    address,
  });

  const { formatted: lastRepayFormatted, paymentDue } = useLastRepay(lastRepay);

  const columns = [
    {
      ...COLUMNS.CLUB_CREDIT,
      value: (
        <DimmableTableCell
          key={COLUMNS.CLUB_CREDIT.id}
          dimmed={vouch <= 0n}
          value={`$${format(vouch, token)}`}
        />
      ),
    },
    {
      ...COLUMNS.CLUB_DEBT,
      value: (
        <DimmableTableCell
          key={COLUMNS.CLUB_DEBT.id}
          dimmed={locking <= 0n}
          value={`$${format(locking, token)}`}
        />
      ),
    },
    {
      ...COLUMNS.UNION_WON,
      value: (
        <DimmableTableCell
          key={COLUMNS.UNION_WON.id}
          dimmed={unionWon <= 0n}
          value={
            unionWon > 0n
              ? <Box>{`${format(unionWon, TOKENS.UNION, 0)}`} <UnionIcon /></Box>
              : `${format(unionWon, TOKENS.UNION, 0)}`
          }
        />
      ),
    },
    {
      ...COLUMNS.UNION_EARNED,
      value: (
        <DimmableTableCell
          key={COLUMNS.UNION_EARNED.id}
          dimmed={unionEarned <= 0n}
          value={
            unionEarned > 0n
              ? <Box>{`${format(unionEarned, TOKENS.UNION, 0)}`} <UnionIcon /></Box>
              : `${format(unionEarned, TOKENS.UNION, 0)}`
          }
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
            <Text grey={800} m="0 2px 0 0" size="medium" weight="medium">
              {primaryLabel}
            </Text>

            <a target="_blank" rel="noreferrer" href={`https://app.union.finance/profile/opt:${address}`}>
              <LinkOutIcon width={18} />
            </a>
          </Box>
        </Box>
      </TableCell>

      {columns.map(({ value }) => value)}
    </TableRow>
  );
}
