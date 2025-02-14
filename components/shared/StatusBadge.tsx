import { cn } from "@/lib/utils";
import { IContact } from "@/providers/types";

const Badge = ({
  label,
  className
}: {
  label: string;
  className: string;
}) => (
  <div className={cn("p-1 border border-black w-[100px] mx-auto text-center", className)}>{label}</div>
);

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
        <Badge label="Overdue" className="bg-red-600 text-white" />
      ) : locking > 0n ? (
        <Badge label="Borrowing" className="bg-green-600" />
      ) : isMember ? (
        <Badge label="Member" className="bg-blue-600 text-white" />
      ) : (
        <Badge label="Not-member" className="bg-stone-300" />
      )}
    </>
  );
}