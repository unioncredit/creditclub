import { Abi, ContractEventName, Hash } from "viem";

import { useEventLogs } from "@/hooks/useEventLogs.ts";

export const useEventLog = <
  const abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi> | undefined = undefined
>({
  eventName,
  hash,
  abi,
}: {
  eventName: eventName,
  hash: Hash,
  abi: abi,
}) => {
  const { data: logs, isLoading, isFetched } = useEventLogs({
    hash,
    abi,
  })

  const eventLogs = logs.filter(
    log => log?.eventName === eventName
  );

  return {
    data: eventLogs.length > 0 ? eventLogs[0] : null,
    isLoading,
    isFetched,
  };
}