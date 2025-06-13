// @ts-ignore
import { Box, Toggle, Text, Skeleton } from "@unioncredit/ui";
import { Address, maxUint256 } from "viem";

import { useWrite } from "@/hooks/useWrite";
import { useContract } from "@/hooks/useContract";
import { useRewardsManager } from "@/hooks/useRewardsManager";
import { useRewardsManagerContract } from "@/hooks/useRewardsManagerContract";

export const ActivateRewardsToggle = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { data: rewards, refetch, isLoading } = useRewardsManager(clubAddress);

  const { allowance } = rewards;

  const unionContract = useContract("union");
  const rewardsManagerContract = useRewardsManagerContract();

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