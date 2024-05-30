import { useState } from "react";
import { IContact } from "@/providers/types.ts";

export const useContactFilters = (contacts: IContact[]) => {
  const FilterFns: Record<string, (item: IContact) => boolean> = {
    borrowing: (item: IContact) => item.locking > 0n,
    notMember: (item: IContact) => !item.isMember,
    member: (item: IContact) => item.isMember,
    inactive: (item: IContact) => !item.isOverdue && item.locking <= 0n && item.isMember,
    overdue: (item: IContact) => item.isOverdue,
  };

  const [filters, setFilters] = useState<string[]>([]);

  const hasFilters = filters.length > 0;
  const filtered = contacts.filter(c => filters.map(f => FilterFns[f](c)).every(x => x));

  return {
    filters, setFilters, data: hasFilters ? filtered : contacts,
  };
};