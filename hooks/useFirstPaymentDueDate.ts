import { format } from "date-fns";
import { useUnionData } from "@/providers/UnionDataProvider";
import { BLOCK_SPEED } from "@/constants";

export const useFirstPaymentDueDate = () => {
  const { data: protocol } = useUnionData();
  const { overdueTime } = protocol;

  const milliseconds = overdueTime * BigInt(BLOCK_SPEED);

  const date = new Date();
  date.setMilliseconds(date.getMilliseconds() + Number(milliseconds));

  // we do the weird double formatting as the ' character causes the yy to not format ?!
  return `${format(date, "d LLL")} '${format(date, "yy")}`;
}
