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

  const decimals = clubData?.decimals || 18;
  const { lockedWithdrawals } = withdrawBucketData;

  return (
    <div>
      <p className="mt-8">Pending withdrawals:</p>
      <ul className="mt-2 p-3 bg-zinc-100 border rounded-lg">
        {lockedWithdrawals.length <= 0 ? (
          <li>None</li>
        ) : (
          lockedWithdrawals.map(({ amount, end }, index) => (
            <li className="flex gap-2" key={index}>
              <p className="bg-white border p-2 w-1/2 text-center rounded-lg">{formatDecimals(amount, decimals, 2)}</p>
              <p className="bg-white border p-2 w-1/2 text-center rounded-lg">{formatDurationUntil(end)}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}