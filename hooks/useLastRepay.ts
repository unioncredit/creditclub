import { useBlockTime } from "@/hooks/useBlockTime";
import { formatTimestamp } from "@/lib/format";
import { useUnionData } from "@/providers/UnionDataProvider";

export const useLastRepay = (lastRepay: bigint) => {
  const { data: unionData } = useUnionData();
  const { overdueTime } = unionData;

  const today = new Date();
  const lastRepayData = useBlockTime(lastRepay);
  const overdueInMilliseconds = Number(overdueTime * 1000n);

  const paymentDueTimestamp =
    lastRepayData.timestamp && lastRepayData.timestamp + overdueInMilliseconds;

  return {
    ...lastRepayData,
    paymentDue: {
      overdue: paymentDueTimestamp ? today.getTime() > paymentDueTimestamp : false,
      timestamp: paymentDueTimestamp,
      formatted: paymentDueTimestamp
        ? formatTimestamp(Math.abs(today.getTime() - paymentDueTimestamp))
        : "N/A",
    },
  };
}
