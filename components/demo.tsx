import { useAccount, useBalance } from "wagmi";
import { useConnectedMember } from "../providers/ConnectedMemberProvider";

export const Demo = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
  });

  const { data } = useConnectedMember();

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