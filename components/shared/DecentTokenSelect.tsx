// @ts-ignore
import { Select, Skeleton, Union } from "@unioncredit/ui";
import { useUsersBalances } from "@decent.xyz/box-hooks";
import { useAccount } from "wagmi";
import { base, optimism } from "viem/chains";
import { zeroAddress } from "viem";
import { UserTokenInfo } from "@decent.xyz/box-common";

import { DEFAULT_CHAIN_ID } from "@/constants";

export const DecentTokenSelect = ({
  onChange,
}:{
  onChange: (token: UserTokenInfo) => void;
}) => {
  const { address } = useAccount();

  const { tokens: allTokens = [], isLoading } = useUsersBalances({
    address,
    chainId: DEFAULT_CHAIN_ID,
    selectChains: [base.id, optimism.id],
  });

  const tokens = allTokens.filter(t => t.balance > 0n || t.address === zeroAddress);

  return isLoading ? (
    <Skeleton width={100} height={38} shimmer />
  ) : (
    <div className="DecentTokenSelect">
      <Select
        onChange={(row: any) => {
          const token = tokens.find((t) => t.address === row.value);
          if (token) {
            // @ts-ignore
            onChange(token);
          } else {
            throw new Error("Invalid token selected");
          }
        }}
        menuPlacement="auto"
        maxMenuHeight={150}
        options={tokens.map(token => ({
          value: token.address,
          label: token.symbol,
          imageSrc: `${process.env.NEXT_PUBLIC_URL}/api/token-image?logo=${token.logo}&chainId=${token.chainId}`,
        }))}
      />
    </div>
  )
};