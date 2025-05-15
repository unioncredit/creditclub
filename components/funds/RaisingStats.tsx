// @ts-ignore
import { AddIcon, ConfettiIcon, ChartIcon, LinkOutIcon, WalletIcon, CalendarIcon, Text } from "@unioncredit/ui";
import { useAccount } from "wagmi";
import { Address, formatUnits, maxUint256 } from "viem";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { DistributionBarItem, DistributionBarValues } from "@/components/shared/DistributionBarValues";
import { useClubData } from "@/hooks/useClubData";
import { useModals } from "@/providers/ModalManagerProvider";
import { formatDecimals, formatDurationUntil } from "@/lib/format";
import { useTokenPriceData } from "@/hooks/useTokenPriceData";
import { useClubMember } from "@/hooks/useClubMember";
import { useErc20Token } from "@/hooks/useErc20Token";
import { useClubAuction } from "@/hooks/useClubAuction";
import { ShadowButton } from "@/components/ui/ShadowButton";
import { PRESALE_MODAL } from "@/components/modals/PresaleModal";

export const RaisingStats = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { address } = useAccount();
  const { open: openModal } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { data: auctionData } = useClubAuction(clubAddress);
  const { data: clubMember } = useClubMember(address, clubAddress);
  const { data: priceData } = useTokenPriceData(clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);

  const {
    stakedBalance,
    clubTokenBalance,
  } = clubMember;

  const {
    symbol,
    decimals,
    isPublic,
  } = clubData;

  const { minTarget, maxTarget, totalDeposits, end, isKilled, isFailed } = auctionData;

  const { price: tokenPrice } = priceData;

  const { decimals: assetDecimals } = assetToken;

  const markValue = minTarget > 0n && maxTarget == 0n ? Number(minTarget) : undefined;

  const barValues: DistributionBarItem[] = [
    ...(minTarget == 0n && maxTarget > 0n ? [
      {
        value: Number(totalDeposits),
        label: `$${formatDecimals(totalDeposits, assetDecimals, 2)}`,
        color: "green600",
        title: "Raised",
      },
      {
        value: Number(maxTarget - totalDeposits),
        label: `$${formatDecimals(maxTarget, assetDecimals, 2)}`,
        color: "blue50",
        title: "Max",
      }
    ] : []),
    ...(minTarget > 0n && maxTarget > 0n ? [
      {
        value: Number(totalDeposits),
        label: `$${formatDecimals(totalDeposits, assetDecimals, 2)}`,
        color: "green600",
        title: "Min",
      },
      {
        value: Number(maxTarget - totalDeposits),
        label: `$${formatDecimals(maxTarget, assetDecimals, 2)}`,
        color: "blue50",
        title: "Max",
      }
    ] : []),
    ...(minTarget > 0n && maxTarget == 0n ? [
      {
        value: Number(totalDeposits),
        label: `$${formatDecimals(totalDeposits, assetDecimals, 2)}`,
        color: "green600",
        title: "Raised",
      },
      {
        value: 0,
        label: `$${formatDecimals(maxTarget, assetDecimals, 2)}`,
        color: "blue50",
        title: "Max",
      }
    ] : [])
  ];

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
      value: `~$${(Number(formatUnits(clubTokenBalance + stakedBalance, decimals)) * tokenPrice).toFixed(2)}`
    },
  ];

  return (
    <div className="mb-4 p-4 border rounded-2xl">
      <header className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-sm text-zinc-500">Amount raised</h3>
          <p className="text-3xl font-mono">${formatDecimals(totalDeposits, assetDecimals, 2)}</p>
        </div>

        <div className="flex items-center gap-2 sm:flex-col">
          <RoundedButton size="small" className="pointer-events-none text-zinc-700">
            <ChartIcon width={24} />
            {
              !isPublic
                ? "Private Sale"
                : end < maxUint256
                  ? `ICO: ${formatDurationUntil(Number(end))}`
                  : "ICO: Open"
            }
          </RoundedButton>
        </div>
      </header>

      <DistributionBarValues items={barValues} mark={markValue} />

      <RoundedButton
        size="large"
        variant="dark"
        className="w-full mt-4"
        onClick={() => openModal(PRESALE_MODAL, {
          clubAddress,
        })}
      >
        {isKilled || isFailed ? "Refund" : "Mint"} ${symbol} Presale
      </RoundedButton>

      <footer className="mt-4 px-2 flex flex-col items-center justify-between">
        <div className="flex items-center justify-between gap-2 w-full border-t py-2 text-zinc-800">
          <h3 className="font-medium text-lg">Your Holdings</h3>
          <ShadowButton
            size="pill"
            onClick={() => alert(0)}
          >
            Stake
          </ShadowButton>
        </div>

        {footerStats.map(({ title, value }, index) => (
          <div key={index} className="flex items-center justify-between gap-2 w-full border-t py-2 px-3 text-zinc-500">
            <h3 className="font-medium text-lg">{title}</h3>
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
