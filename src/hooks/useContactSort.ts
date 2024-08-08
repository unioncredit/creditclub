import { useCallback, useState } from "react";
import { IContact } from "@/providers/types.ts";
import { SortOrder } from "@/constants.ts";
import { COLUMNS } from "@/components/table/ContactsTable.tsx";

const score = (bools: boolean[]) => {
  return bools.reduce((acc, item) => acc + (item ? 1 : -1), 0);
};

export const useContactSort = (contacts: IContact[]) => {
  const sortFns = {
    [COLUMNS.CLUB_CREDIT.id]: {
      [SortOrder.ASC]: (a: IContact, b: IContact) => Number(a.trust - b.trust),
      [SortOrder.DESC]: (a: IContact, b: IContact) => Number(b.trust - a.trust),
    },
    [COLUMNS.CLUB_DEBT.id]: {
      [SortOrder.ASC]: (a: IContact, b: IContact) => Number(a.locking - b.locking),
      [SortOrder.DESC]: (a: IContact, b: IContact) => Number(b.locking - a.locking),
    },
    [COLUMNS.UNION_WON.id]: {
      [SortOrder.ASC]: (a: IContact, b: IContact) => Number(a.unionWon - b.unionWon),
      [SortOrder.DESC]: (a: IContact, b: IContact) => Number(b.unionWon - a.unionWon),
    },
    [COLUMNS.UNION_EARNED.id]: {
      [SortOrder.ASC]: (a: IContact, b: IContact) => Number(a.unionEarned - b.unionEarned),
      [SortOrder.DESC]: (a: IContact, b: IContact) => Number(b.unionEarned - a.unionEarned),
    },
    [COLUMNS.LAST_PAYMENT.id]: {
      [SortOrder.ASC]: (a: IContact, b: IContact) => Number(a.lastRepay - b.lastRepay),
      [SortOrder.DESC]: (a: IContact, b: IContact) => Number(b.lastRepay - a.lastRepay),
    },
    [COLUMNS.LOAN_STATUS.id]: {
      [SortOrder.ASC]: (a: IContact, b: IContact) =>
        score([a.locking > 0n && a.isOverdue, a.isMember, a.locking > 0n]) -
        score([b.locking > 0n && b.isOverdue, b.isMember, b.locking > 0n]),
      [SortOrder.DESC]: (a: IContact, b: IContact) =>
        score([
          b.isOverdue && b.locking > 0n,
          b.isOverdue && b.locking > 0n && b.lastRepay < a.lastRepay,
          b.isMember,
          b.locking > 0n,
        ]) -
        score([
          a.isOverdue && a.locking > 0n,
          a.isOverdue && a.locking > 0n && a.lastRepay < b.lastRepay,
          a.isMember,
          a.locking > 0n,
        ]),
    },
  };

  const [sort, setSort] = useState({
    type: COLUMNS.LOAN_STATUS.id,
    order: SortOrder.DESC,
  });

  const setSortType = useCallback((sortType: string) => {
    if (sort.type !== sortType) {
      const newSort = {
        type: sortType,
        order: SortOrder.DESC,
      };
      setSort(newSort);
      return;
    }

    const newSort = {
      ...sort,
      order: !sort.order ? SortOrder.DESC : sort.order === SortOrder.DESC ? SortOrder.ASC : "",
    };
    setSort(newSort);
  }, [sort]);

  return {
    sort, setSortType, data: sort.type ? contacts.sort(sortFns[sort.type][sort.order]) : contacts,
  }
}