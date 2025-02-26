// @ts-ignore
import { Text, Table, Pagination, Modal } from "@unioncredit/ui";

import { InviteesTableRow } from "@/components/invites/InviteesTableRow";
import { IInvitation } from "@/fetchers/fetchInvitations";
import { usePagination } from "@/hooks/usePagination";
import { Address } from "viem";

export const InviteesTable = ({
  clubAddress,
  sentInvitations,
}: {
  clubAddress: Address;
  sentInvitations: IInvitation[];
}) => {
  const { data, maxPages, activePage, onChange } = usePagination(sentInvitations, 4);

  return (
    <Modal.Container className="InviteesTable" direction="vertical">
      {data.length <= 0 ? (
        <Text m="24px 0" align="center" w="100%" grey={500}>No invites sent.</Text>
      ) : (
        <>
          <Table>
            {sentInvitations.map(({ receiver, timestamp }) => (
              <InviteesTableRow
                clubAddress={clubAddress}
                key={receiver}
                receiver={receiver}
                timestamp={timestamp}
              />
            ))}
          </Table>
          <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
        </>
      )}
    </Modal.Container>
  );
};