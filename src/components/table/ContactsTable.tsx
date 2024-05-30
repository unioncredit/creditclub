import "./ContactsTable.scss";

import { useContacts } from "@/providers/CreditClubContactsProvider.tsx";
import { Box, Card, Table, EmptyState, SegmentedControl } from "@unioncredit/ui";
import { ContactsTableHead } from "@/components/table/ContactsTableHead.tsx";
import { useState } from "react";
import { COLUMNS, ContactsTableRow } from "@/components/table/ContactsTableRow.tsx";
import { ContactsFilterControls } from "@/components/table/ContactsFilterControls.tsx";

export function ContactsTable() {
  const { data: contacts } = useContacts();

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [sort, setSort] = useState({
    type: null,
    order: null,
  });

  return (
    <Card className="ContactList" overflow="visible">
      <Box className="ContactList__header" p="24px" align="center">
        <SegmentedControl
          value="members"
          className="ContactList__toggle"
          initialActive={0}
          items={[
            {
              id: "members",
              label: `Members (${contacts.length})`,
            },
          ]}
        />

        <ContactsFilterControls
          filters={filters}
          setQuery={setQuery}
          setFilters={setFilters}
        />
      </Box>

      {contacts.length <= 0 ? (
        <Card.Body>
          <EmptyState label="No contacts" />
        </Card.Body>
      ) : (
        <Table>
          <ContactsTableHead
            sort={sort}
            setSortType={setSort}
            items={
              [
                COLUMNS.CLUB_CREDIT,
                COLUMNS.CLUB_DEBT,
                COLUMNS.LAST_PAYMENT,
                COLUMNS.LOAN_STATUS,
              ]
            }
          />

          {contacts.map((row) =>
            <ContactsTableRow
              key={row.address}
              address={row.address}
            />
          )}
        </Table>
      )}
    </Card>
  );
}
