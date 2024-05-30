import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { format } from "date-fns";

dayjs.extend(relativeTime);

export const useBlockTime = (blockNumber: bigint | undefined, dateFormat = "dd LLL yyyy") => {
  const timestamp = blockNumber ? Number(blockNumber) * 1000 : null;

  return {
    timestamp,
    relative: timestamp ? dayjs(timestamp).fromNow() : "N/A",
    formatted: timestamp ? format(new Date(timestamp), dateFormat) : null,
  };
}
