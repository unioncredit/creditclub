import "./ContactsFilterControls.scss";
// @ts-ignore
import { Box, Input, SearchIcon } from "@unioncredit/ui";
import { FiltersPopover } from "@/components/table/FiltersPopover.tsx";
import React, { Dispatch, SetStateAction } from "react";

export const ContactsFilterControls = ({
  filters,
  setQuery,
  setFilters
}: {
  filters: string[];
  setQuery: Dispatch<SetStateAction<string>>;
  setFilters: Dispatch<SetStateAction<string[]>>;
}) => {

  return (
    <Box className="ContactsFilterControls" align="center">
      <Input
        className="ContactsFilterControls__search"
        prefix={<SearchIcon width="15px" />}
        placeholder="Filter by address or ENS"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(event.target.value);
        }}
      />

      <FiltersPopover filters={filters} setFilters={setFilters} />
    </Box>
  );
};
