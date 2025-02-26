// @ts-ignore
import { Badge, Box, TableCell, TableRow, Text, Skeleton } from "@unioncredit/ui";
import { format as dateFormat } from "date-fns";

import { Avatar } from "@/components/shared/Avatar";
import { Address } from "viem";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel";
import { useClubMember } from "@/hooks/useClubMember";

export const InviteesTableRow = ({
  receiver,
  timestamp,
  clubAddress,
}: {
  receiver: Address;
  timestamp: number;
  clubAddress: Address;
}) => {
  const { data: member, isLoading } = useClubMember(receiver, clubAddress);
  const { isMember } = member;

  return (
    <TableRow>
      <TableCell fixedSize>
        <Avatar size={32} address={receiver} />
      </TableCell>

      <TableCell>
        <Box direction="vertical">
          <Text size="medium" weight="medium" grey={800} m={0}>
            <PrimaryLabel address={receiver} />
          </Text>
          <Text size="small" grey={500} m={0}>
            {dateFormat(new Date(timestamp * 1000), "dd LLL yyyy HH:mm")}
          </Text>
        </Box>
      </TableCell>

      <TableCell align="right">
        {isLoading ? (
          <Skeleton width={80} height={30} grey={100} shimmer />
        ) : (
          <Text grey={800} size="medium">
            {isMember ? (
              <Badge label="Accepted" color="green" />
            ) : (
              <Badge label="Invited" color="blue" />
            )}
          </Text>
        )}
      </TableCell>
    </TableRow>
  );
}
