import { useMemo, useState } from "react";
import { IContact } from "@/providers/types.ts";

export const useContactSearch = (contacts: IContact[]) => {
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    if (!query) return contacts;

    const queryLc = query.toLowerCase();

    return contacts.filter((item) => {
      const address = item.address.toLowerCase();
      const ens = item.ens ? item.ens.toLowerCase() : "";

      return (
        address.includes(queryLc) || ens.includes(queryLc)
      );
    });
  }, [JSON.stringify(contacts, (_, value) => (typeof value === "bigint" ? value.toString() : value)), query]);

  return {
    query, setQuery, data,
  }
}
