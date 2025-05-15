import { Address } from "viem";
import { useClubWithdrawBucket } from "@/hooks/useClubWithdrawBucket";
import { useClubData } from "@/hooks/useClubData";
import { formatDecimals, formatDurationUntil } from "@/lib/format";

export const LockedWithdrawals = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { data: clubData } = useClubData(clubAddress);
  const { data: withdrawBucketData } = useClubWithdrawBucket(clubAddress);

  const { decimals } = clubData;
  const { pendingWithdrawals } = withdrawBucketData;

  return (
    <div>
      <p className="mt-8">Pending withdrawals:</p>
      <ul className="mt-2 p-3 bg-zinc-100 border rounded-lg">
        {pendingWithdrawals.length <= 0 ? (
          <li>None</li>
        ) : (
          pendingWithdrawals.map(({ amount, end }) => (
            <li className="flex gap-2">
              <p className="bg-white border p-2 w-1/2 text-center rounded-lg">{formatDecimals(amount, decimals, 2)}</p>
              <p className="bg-white border p-2 w-1/2 text-center rounded-lg">{formatDurationUntil(end)}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}