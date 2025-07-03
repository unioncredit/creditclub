import { useBlockTime } from "@/hooks/useBlockTime";
import { useUnionData } from "@/providers/UnionDataProvider";
import { formatDuration } from "@/lib/utils";

export const useLastRepay = (lastRepay: bigint) => {
  const { data: unionData } = useUnionData();
  const overdueTime: bigint = unionData?.overdueTime ?? 0n;

  const today = new Date();
  const lastRepayData = useBlockTime(lastRepay);
  const overdueInMilliseconds = Number(overdueTime * 1000n);

  const paymentDueTimestamp =
    lastRepayData.timestamp && lastRepayData.timestamp + overdueInMilliseconds;

  return {
    ...lastRepayData,
    formatted: lastRepayData.formatted || "N/A",
    paymentDue: {
      overdue: paymentDueTimestamp ? today.getTime() > paymentDueTimestamp : false,
      timestamp: paymentDueTimestamp,
      formatted: paymentDueTimestamp
        ? formatDuration(Math.abs(today.getTime() - paymentDueTimestamp) / 1000)
        : "N/A",
    },
  };
}
