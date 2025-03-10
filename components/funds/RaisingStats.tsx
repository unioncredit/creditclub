// @ts-ignore
import { AddIcon, ConfettiIcon, ChartIcon, LinkOutIcon, WalletIcon, CalendarIcon, Text } from "@unioncredit/ui";
import { useAccount, useWatchAsset } from "wagmi";
import { Address, formatUnits } from "viem";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { DistributionBarItem, DistributionBarValues } from "@/components/shared/DistributionBarValues";
import { useClubData } from "@/hooks/useClubData";
import { useModals } from "@/providers/ModalManagerProvider";
import { MINT_REDEEM_MODAL } from "@/components/modals/MintRedeemModal";
import { formatDecimals } from "@/lib/format";
import { formatDuration } from "@/lib/utils";
import { useTokenPriceData } from "@/hooks/useTokenPriceData";
import { useClubMember } from "@/hooks/useClubMember";
import { useErc20Token } from "@/hooks/useErc20Token";
import { useClubActivation } from "@/hooks/useClubActivation";

export const RaisingStats = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { address, isConnected } = useAccount();
  const { open: openModal } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubMember } = useClubMember(address, clubAddress);
  const { data: priceData } = useTokenPriceData(clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);
  const { activated, locked, remaining } = useClubActivation(clubAddress);
  const { watchAsset } = useWatchAsset();

  const {
    clubTokenBalance,
  } = clubMember;

  const {
    symbol,
    decimals,
    initialRaise,
    totalAssets,
    lockupPeriod,
  } = clubData;

  const { price: tokenPrice } = priceData;

  const { decimals: assetDecimals } = assetToken;

  const raisedFormatted = formatDecimals(totalAssets, assetDecimals, 2);
  const goalFormatted = formatDecimals(initialRaise, assetDecimals, 2);

  const barValues: DistributionBarItem[] = [
    {
      value: Number(totalAssets),
      label: `$${raisedFormatted}`,
      color: "green600",
      title: "Raised",
    },
    {
      value: Number(initialRaise),
      label: `$${goalFormatted}`,
      color: "blue50",
      title: "Goal",
    }
  ];

  const footerStats = [
    {
      title: "Your Holdings",
      value: formatDecimals(clubTokenBalance, decimals, 2),
    },
    {
      title: "Market value",
      value: `~$${(Number(formatUnits(clubTokenBalance, decimals)) * tokenPrice).toFixed(2)}`
    },
    {
      title: "Redeemable",
      value: activated
        ? locked
          ? formatDuration(remaining)
          : "Now"
        : formatDuration(Number(lockupPeriod)),
    }
  ];

  return (
    <div className="mb-4 p-4 border rounded-2xl">
      <header className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-sm text-stone-500">Raising</h3>
          <p className="text-3xl font-mono">${raisedFormatted}</p>
        </div>

        <div className="flex items-center gap-2 sm:flex-col">
          <RoundedButton size="small" className="pointer-events-none">
            <ChartIcon width={24}/>
            ICO: Open
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
              ${symbol}
            </RoundedButton>
          )}
        </div>
      </header>

      <DistributionBarValues items={barValues}/>

      <RoundedButton
        size="large"
        variant="dark"
        className="w-full mt-4"
        onClick={() => openModal(MINT_REDEEM_MODAL, {
          activeTab: "mint",
          clubAddress,
        })}
      >
        Mint ${symbol} Token
      </RoundedButton>

      <footer className="mt-4 px-2 flex flex-col items-center justify-between">
        {footerStats.map(({ title, value }, index) => (
          <div key={index} className="flex items-center justify-between gap-2 w-full border-t py-2">
            <h3 className="font-medium text-lg text-stone-500">{title}</h3>
            <p className="text-lg font-mono font-medium flex gap-1 items-center">
              {value}

              {/*{link && (*/}
              {/*  <Link href={link}>*/}
              {/*    <LinkOutIcon width={24} height={24} className="fill text-black" />*/}
              {/*  </Link>*/}
              {/*)}*/}
            </p>
          </div>
        ))}
      </footer>
    </div>
  );
}
