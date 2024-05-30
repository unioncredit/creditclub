import "./ContactsTable.scss";

import { useContacts } from "@/providers/CreditClubContactsProvider.tsx";
import { Box, Card, Table, EmptyState, SegmentedControl, Pagination } from "@unioncredit/ui";
import { ContactsTableHead } from "@/components/table/ContactsTableHead.tsx";
import { ContactsTableRow } from "@/components/table/ContactsTableRow.tsx";
import { ContactsFilterControls } from "@/components/table/ContactsFilterControls.tsx";
import { useContactSearch } from "@/hooks/useContactSearch.ts";
import { usePagination } from "@/hooks/usePagination.ts";
import { useContactSort } from "@/hooks/useContactSort.ts";
import { useContactFilters } from "@/hooks/useContactFilters.ts";

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

export function ContactsTable() {
  const { data: contacts } = useContacts();
  const { data: searchedContacts, setQuery } = useContactSearch(contacts);
  const { data: filteredContacts, filters, setFilters } = useContactFilters(searchedContacts);
  const { data: sortedContacts, sort, setSortType } = useContactSort(filteredContacts);
  const { data: contactsPage, maxPages, activePage, onChange } = usePagination(sortedContacts);

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

      {sortedContacts.length <= 0 ? (
        <Card.Body>
          <EmptyState label="No contacts" />
        </Card.Body>
      ) : (
        <div className="ContactList__table">
          <Table>
            <ContactsTableHead
              sort={sort}
              setSortType={setSortType}
              items={
                [
                  COLUMNS.CLUB_CREDIT,
                  COLUMNS.CLUB_DEBT,
                  COLUMNS.LAST_PAYMENT,
                  COLUMNS.LOAN_STATUS,
                ]
              }
            />

            {contactsPage.map((contact) =>
              <ContactsTableRow
                key={contact.address}
                contact={contact}
              />
            )}
          </Table>

          <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
        </div>
      )}
    </Card>
  );
}
