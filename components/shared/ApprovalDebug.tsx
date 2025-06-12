import { useReadContract } from "wagmi";
import { Address, formatUnits } from "viem";
import { useErc20Token } from "@/hooks/useErc20Token";

export const ApprovalDebug = ({
  owner,
  spender,
  tokenAddress,
  amount,
}: {
  owner: Address | undefined;
  spender: Address;
  tokenAddress: Address;
  amount: bigint;
}) => {
  const { data: token } = useErc20Token(tokenAddress);
  const { data: allowance = 0n } = useReadContract({
    abi: [
      {
        name: "allowance",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
        ],
        outputs: [{ name: "", type: "uint256" }],
      },
    ],
    address: tokenAddress,
    functionName: "allowance",
    args: [owner || "0x0", spender],
  });

  const { data: balance = 0n } = useReadContract({
    abi: [
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
    ],
    address: tokenAddress,
    functionName: "balanceOf",
    args: [owner || "0x0"],
  });

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs font-mono">
      <div className="font-bold mb-1">Approval Debug Info:</div>
      <div>Owner: {owner?.slice(0, 8)}...{owner?.slice(-6)}</div>
      <div>Spender: {spender?.slice(0, 8)}...{spender?.slice(-6)}</div>
      <div>Token: {tokenAddress?.slice(0, 8)}...{tokenAddress?.slice(-6)} ({token?.symbol})</div>
      <div>Amount: {token?.decimals ? formatUnits(amount, token.decimals) : amount.toString()}</div>
      <div>Current Allowance: {token?.decimals ? formatUnits(allowance, token.decimals) : allowance.toString()}</div>
      <div>Balance: {token?.decimals ? formatUnits(balance, token.decimals) : balance.toString()}</div>
      <div>Needs Approval: {amount > allowance ? "YES" : "NO"}</div>
      <div>Has Sufficient Balance: {balance >= amount ? "YES" : "NO"}</div>
    </div>
  );
}; 