import { useAccount, useBalance } from "wagmi";
import { useTestData } from "../providers/TestProvider";

export const Demo = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
  });

  const { data } = useTestData();

  const { totalLockedStake, stakedBalance } = data;

  console.log({ totalLockedStake, stakedBalance });

  return (
    <>
      <h2>{address}</h2>
      <h2>Symbol: {balance?.symbol}</h2>
      <h2>{totalLockedStake.toString()}</h2>
      <h2>{stakedBalance.toString()}</h2>
      <p>Test</p>
    </>
  )
};