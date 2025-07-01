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
  // Safety check: ensure contact is a valid object
  if (!contact || typeof contact !== 'object') {
    return <Badge label="Unknown" className="bg-slate-300" />;
  }

  const {
    isOverdue,
    isMember,
    locking,
  } = contact;

  // Safety check: ensure locking is a valid bigint
  const safeLocking = typeof locking === 'bigint' ? locking : 0n;

  return (
    <>
      {isOverdue ? (
        <Badge label="Overdue" className="bg-red-600 text-white" />
      ) : safeLocking > 0n ? (
        <Badge label="Borrowing" className="bg-green-600" />
      ) : isMember ? (
        <Badge label="Member" className="bg-blue-600 text-white" />
      ) : (
        <Badge label="Not-member" className="bg-slate-300" />
      )}
    </>
  );
}