// @ts-ignore
import { Select, Skeleton, Union } from "@unioncredit/ui";
import { useUsersBalances } from "@decent.xyz/box-hooks";
import { useAccount } from "wagmi";
import { base, optimism } from "viem/chains";
import { Address, zeroAddress } from "viem";
import { UserTokenInfo } from "@decent.xyz/box-common";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { usdcContract } from "@/contracts/base";
import { useEffect } from "react";

export const DecentTokenSelect = ({
  onChange,
  initialToken,
}:{
  onChange: (token: UserTokenInfo) => void;
  initialToken?: Address;
}) => {
  const { address } = useAccount();
  const { tokens: allTokens = [], isLoading } = useUsersBalances({
    address,
    chainId: DEFAULT_CHAIN_ID,
    selectChains: [base.id, optimism.id],
  });

  const tokens = allTokens.filter(
    t => t.balance > 0n
      || t.address === zeroAddress
      || t.address === usdcContract.address
      || t.address === initialToken
  );

  const options = tokens.map(token => ({
    value: token.address,
    label: token.symbol,
    imageSrc: `${process.env.NEXT_PUBLIC_URL}/api/token-image?logo=${token.logo}&chainId=${token.chainId}`,
  }));

  useEffect(() => {
    if (initialToken && onChange) {
      const token = tokens.find(t => t.address === initialToken);
      if (token) {
        onChange(token)
      }
    }
  }, [initialToken, JSON.stringify(tokens, (_, value) => (typeof value === "bigint" ? value.toString() : value))]);

  return isLoading ? (
    <Skeleton width={100} height={38} shimmer />
  ) : (
    <div className="DecentTokenSelect">
      <Select
        defaultValue={options.find(t => t.value === initialToken)}
        onChange={(row: any) => {
          const token = tokens.find((t) => t.address === row.value);
          if (token) {
            // @ts-ignore
            onChange(token);
          }
        }}
        menuPlacement="auto"
        maxMenuHeight={150}
        options={options}
      />
    </div>
  )
};