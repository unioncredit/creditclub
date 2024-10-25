// @ts-ignore
import { Box, Toggle, Text, Skeleton } from "@unioncredit/ui";
import { maxUint256 } from "viem";

import { useWrite } from "@/hooks/useWrite.ts";
import { rewardsManagerContract, unionContract } from "@/contracts/optimism.ts";
import { useRewardsManager } from "@/providers/RewardsManagerDataProvider.tsx";


export const ActivateRewardsToggle = () => {
  const { data: rewards, refetch, isLoading } = useRewardsManager();

  const { allowance } = rewards;

  const transactionApproveProps = useWrite({
    ...unionContract,
    functionName: "approve",
    args: [rewardsManagerContract.address, maxUint256],
    onComplete: async () => {
      await refetch();
    },
  });

  return isLoading ? (
    <Box align="center">
      <Text m="0 6px 0 0" grey={500}>Activate Rewards</Text>
      <Skeleton width={32} height={20} grey={200} shimmer />
    </Box>
  ) : (
    <Toggle
      label="Activate Rewards"
      labelPosition="start"
      active={allowance > 0n}
      onChange={() => transactionApproveProps.onClick()}
    />
  )
}