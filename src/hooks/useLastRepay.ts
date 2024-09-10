import { useBlockTime } from "@/hooks/useBlockTime.ts";
import { useClubData } from "@/providers/CreditClubDataProvider.tsx";
import { formatTimestamp } from "@/utils/format.ts";

export const useLastRepay = (lastRepay: bigint) => {
  const { data: creditClub } = useClubData();
  const { overdueTime } = creditClub;

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
