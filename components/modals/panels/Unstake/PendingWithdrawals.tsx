// @ts-ignore
import { Button } from "@unioncredit/ui";
import { Address } from "viem";

import { useClubWithdrawBucket } from "@/hooks/useClubWithdrawBucket";
import { useClubData } from "@/hooks/useClubData";
import { useWrite } from "@/hooks/useWrite";
import { useAccount } from "wagmi";
import { formatDecimals } from "@/lib/format";
import { useClubMember } from "@/hooks/useClubMember";

const WithdrawButton = ({
  userAddress,
  withdrawalId,
  withdrawBucketAddress,
  onComplete,
}: {
  userAddress: Address | undefined;
  withdrawalId: number;
  withdrawBucketAddress: Address;
  onComplete: (hash: string) => Promise<void>;
}) => {
  const withdrawBucketContract = useClubWithdrawBucket(withdrawBucketAddress);
  const withdrawButtonProps = useWrite({
    ...withdrawBucketContract,
    functionName: "withdraw",
    args: [userAddress, [withdrawalId]],
    onComplete,
  });

  return (
    <Button
      fluid
      className="w-1/2"
      color="primary"
      label="Start withdraw"
      {...withdrawButtonProps}
    />
  )
}

export const PendingWithdrawals = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { address: connectedAddress } = useAccount();
  const { data: clubData } = useClubData(clubAddress);
  const { refetch: refetchClubMember } = useClubMember(connectedAddress, clubAddress);
  const { data: withdrawBucketData, refetch: refetchWithdrawBucket } = useClubWithdrawBucket(clubAddress);

  const { decimals } = clubData;
  const { withdrawBucketAddress, pendingWithdrawals } = withdrawBucketData;

  if (pendingWithdrawals.length <= 0) {
    return null;
  }

  return (
    <div>
      <p className="mt-8">Ready to withdraw:</p>
      <ul className="mt-2">
        {pendingWithdrawals.map(({ id, amount }) => (
          <li className="flex gap-2">
            <p className="bg-white border p-2 w-1/2 text-center rounded-xl flex justify-center items-center">
              {formatDecimals(amount, decimals, 2)}
            </p>
            <WithdrawButton
              userAddress={connectedAddress}
              withdrawalId={id}
              withdrawBucketAddress={withdrawBucketAddress}
              onComplete={async () => {
                refetchWithdrawBucket();
                refetchClubMember();
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}