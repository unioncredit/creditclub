// @ts-ignore
import { BadgeIndicator } from "@unioncredit/ui";

import { IContact } from "@/providers/types.ts";

export const StatusBadge = ({
  contact,
}: {
  contact: IContact;
}) => {
  const {
    isOverdue,
    isMember,
    locking,
  } = contact;

  return (
    <>
      {isOverdue ? (
        <BadgeIndicator color="red500" label="Overdue" textColor="red500" />
      ) : locking > 0n ? (
        <BadgeIndicator color="green500" label="Borrowing" />
      ) : isMember ? (
        <BadgeIndicator color="blue500" label="Member" />
      ) : (
        <BadgeIndicator label="Not-member" />
      )}
    </>
  );
}