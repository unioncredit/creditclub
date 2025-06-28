import { useTransactionReceipt } from "wagmi";
import { Abi, decodeEventLog, Hash } from "viem";

export const useEventLogs = <const abi extends Abi | readonly unknown[]>({
  hash,
  abi,
}: {
  hash: Hash,
  abi: abi,
}) => {
  const result = useTransactionReceipt({
    hash,
  })

  const data = result.data?.logs.map(({ data, topics }) => {
    try {
      return decodeEventLog({
        abi,
        data,
        topics,
      })
    } catch {
      return null;
    }
  }).filter(l => !!l) || [];

  return { 
    data,
    isLoading: result.isLoading,
    isError: result.isError,
    isFetching: result.isFetching,
    isSuccess: result.isSuccess,
    refetch: result.refetch,
    isFetched: result.isFetched,
  };
}