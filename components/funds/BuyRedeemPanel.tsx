// @ts-ignore
import { ChartIcon, ConfettiIcon, AddIcon, LinkOutIcon } from "@unioncredit/ui";
import { useAccount, useWatchAsset } from "wagmi";
import { Address, formatUnits } from "viem";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { useClubData } from "@/hooks/useClubData";
import { useModals } from "@/providers/ModalManagerProvider";
import { MINT_REDEEM_MODAL } from "@/components/modals/MintRedeemModal";
import { formatDecimals, commify } from "@/lib/format";
import { useTokenPriceData } from "@/hooks/useTokenPriceData";
import { useClubMember } from "@/hooks/useClubMember";
import { PoolMarketData } from "@/components/funds/PoolMarketData";
import { BUY_SELL_MODAL } from "@/components/modals/BuySellModal";
import { ShadowButton } from "@/components/ui/ShadowButton";
import { STAKE_UNSTAKE_MODAL } from "@/components/modals/StakeUnstakeModal";

export const BuyRedeemPanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { address, isConnected } = useAccount();
  const { open: openModal } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubMember } = useClubMember(address, clubAddress);
  const { data: priceData } = useTokenPriceData(clubAddress);
  const { watchAsset } = useWatchAsset();

  const {
    clubTokenBalance,
  } = clubMember;

  const {
    symbol,
    decimals,
    totalSupply,
    stakedBalance,
  } = clubData;

  const { price: tokenPrice } = priceData;

  const totalSupplyFormatted = commify((tokenPrice * Number(formatUnits(totalSupply, decimals))), 0);

  const footerStats = [
    {
      title: "Balance",
      value: formatDecimals(clubTokenBalance, decimals, 2),
    },
    {
      title: "Staked",
      value: formatDecimals(stakedBalance, decimals, 2),
    },
    {
      title: "Market value",
      value: `~$${commify((Number(formatUnits(clubTokenBalance, decimals)) * tokenPrice), 2)}`
    },
  ];

  // Drop symbol from button labels if it's too long to prevent layout issues
  const buyLabel = symbol && symbol.length > 8 ? "Buy" : `Buy $${symbol}`;
  const sellLabel = symbol && symbol.length > 8 ? "Sell" : `Sell $${symbol}`;
  const redeemLabel = symbol && symbol.length > 20 ? "Redeem" : `Redeem $${symbol}`;
  const addTokenLabel = symbol && symbol.length > 8 ? "" : `$${symbol}`;

  return (
    <div className="mb-4 p-4 border rounded-2xl">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm font-mono">Market cap</h3>

          <div className="flex">
            <p className="text-sm font-mono font-medium">${totalSupplyFormatted}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:flex-col">
          <RoundedButton size="small" className="pointer-events-none">
            <ChartIcon width={24}/>
            Activated
          </RoundedButton>

          {isConnected && (
            <RoundedButton
              size="small"
              onClick={() => watchAsset({
                type: 'ERC20',
                options: {
                  address: clubAddress,
                  symbol: symbol,
                  decimals: decimals,
                },
              })}
            >
              <AddIcon width={24} />
              {addTokenLabel}
            </RoundedButton>
          )}
        </div>
      </header>

      <ul className="mt-4 flex flex-col items-center justify-between border-b">
        <li className="flex items-center justify-between gap-2 w-full border-t py-2 text-zinc-800">
          <h3 className="font-medium text-lg">Your Holdings</h3>
          <ShadowButton
            size="pill"
            onClick={() => openModal(STAKE_UNSTAKE_MODAL, {
              activeTab: "stake",
              clubAddress,
            })}
          >
            Stake
          </ShadowButton>
        </li>

        {footerStats.map(({ title, value }, index) => (
          <li key={index} className="px-2 flex items-center justify-between gap-2 w-full border-t py-2">
            <h3 className="font-medium text-lg text-stone-500">{title}</h3>
            <p className="text-lg font-mono font-medium flex gap-1 items-center">
              {value}
            </p>
          </li>
        ))}
      </ul>

      <p className="my-2 rounded-lg font-mono text-blue-600 bg-blue-50 text-xs p-2">Raise Over. To acquire ${symbol} you
        will need to buy it on secondary markets.</p>

      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <RoundedButton
            size="medium"
            variant="blue"
            className="flex-1 text-sm"
            onClick={() => openModal(BUY_SELL_MODAL, {
              initialTab: "buy",
              clubAddress,
            })}
          >
            {buyLabel}
          </RoundedButton>

          <RoundedButton
            size="medium"
            variant="light"
            className="flex-1 text-sm"
            onClick={() => openModal(BUY_SELL_MODAL, {
              initialTab: "sell",
              clubAddress,
            })}
          >
            {sellLabel}
          </RoundedButton>
        </div>

        <RoundedButton
          size="medium"
          variant="dark"
          className="w-full text-sm"
          onClick={() => openModal(MINT_REDEEM_MODAL, {
            activeTab: "redeem",
            clubAddress,
          })}
        >
          {redeemLabel}
        </RoundedButton>
      </div>

      <PoolMarketData clubAddress={clubAddress} className="mt-2" />
    </div>
  );
}
