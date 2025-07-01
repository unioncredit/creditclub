// @ts-ignore
import { AddIcon, ConfettiIcon, ChartIcon, LinkOutIcon, WalletIcon, CalendarIcon, Text } from "@unioncredit/ui";
import { useAccount } from "wagmi";
import { Address, formatUnits, maxUint256, zeroAddress } from "viem";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { DistributionBarItem, DistributionBarValues } from "@/components/shared/DistributionBarValues";
import { useClubData } from "@/hooks/useClubData";
import { useModals } from "@/providers/ModalManagerProvider";
import { formatDecimals, formatDurationUntil } from "@/lib/format";
import { useTokenPriceData } from "@/hooks/useTokenPriceData";
import { useClubMember } from "@/hooks/useClubMember";
import { useErc20Token } from "@/hooks/useErc20Token";
import { useClubAuction } from "@/hooks/useClubAuction";
import { PRESALE_MODAL } from "@/components/modals/PresaleModal";
import { useClubActivation } from "@/hooks/useClubActivation";
import { useWrite } from "@/hooks/useWrite";
import { useAuctionContract } from "@/hooks/useAuctionContract";

export const RaisingStats = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { address } = useAccount();
  const { open: openModal } = useModals();
  const { data: clubData, refetch: refetchClubData, isLoading: isClubDataLoading } = useClubData(clubAddress);
  const { data: auctionData, refetch: refetchAuctionData } = useClubAuction(clubAddress);
  const { data: clubMember } = useClubMember(address, clubAddress);
  const { data: priceData } = useTokenPriceData(clubAddress);
  const { data: assetToken } = useErc20Token(isClubDataLoading ? zeroAddress : clubData.assetAddress);
  const { readyToSettle } = useClubActivation(clubAddress);

  const auctionContract = useAuctionContract(isClubDataLoading ? zeroAddress : clubData.auctionAddress);

  if (isClubDataLoading) {
    return <div>Loading...</div>;
  }

  const {
    stakedBalance,
    clubTokenBalance,
  } = clubMember || {};

  const {
    symbol,
    decimals,
    isPublic,
  } = clubData || {};

  const {
    minTarget,
    maxTarget,
    totalDeposits,
    end,
    isKilled,
    isFailed,
    hasMaxTarget,
  } = auctionData || {};

  const { price: tokenPrice = 0 } = priceData || {};

  const { decimals: assetDecimals = 18 } = assetToken;

  const markValue = (minTarget && minTarget > 0n) && (maxTarget && maxTarget == maxUint256) ? Number(minTarget) : undefined;

  const activateClubButtonProps = useWrite({
    ...auctionContract,
    functionName: "settle",
    onComplete: async () => {
      refetchClubData();
      refetchAuctionData();
    }
  });

  const barValues: DistributionBarItem[] = [
    ...((minTarget && minTarget > 0n) && !hasMaxTarget ? [
      {
        value: Number(totalDeposits || 0n),
        label: `$${formatDecimals(totalDeposits || 0n, assetDecimals, 2)}`,
        color: "green600",
        title: "Min",
      },
      {
        value: Number(totalDeposits || 0n),
        label: `$${formatDecimals(totalDeposits || 0n, assetDecimals, 2)}`,
        color: "green600",
        title: "Raised",
      },
    ] : []),
    ...((minTarget && minTarget == 0n) && hasMaxTarget && (maxTarget && maxTarget > 0n) ? [
      {
        value: Number(totalDeposits || 0n),
        label: `$${formatDecimals(totalDeposits || 0n, assetDecimals, 2)}`,
        color: "green600",
        title: "Raised",
      },
      {
        value: Number((maxTarget || 0n) - (totalDeposits || 0n)),
        label: `$${formatDecimals(maxTarget || 0n, assetDecimals, 2)}`,
        color: "blue50",
        title: "Max",
      }
    ] : []),
    ...((minTarget && minTarget > 0n) && hasMaxTarget && (maxTarget && maxTarget > 0n) ? [
      {
        value: Number(totalDeposits || 0n),
        label: `$${formatDecimals(totalDeposits || 0n, assetDecimals, 2)}`,
        color: "green600",
        title: "Min",
      },
      {
        value: Number((maxTarget || 0n) - (totalDeposits || 0n)),
        label: `$${formatDecimals(maxTarget || 0n, assetDecimals, 2)}`,
        color: "blue50",
        title: "Max",
      }
    ] : []),
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
      value: `~$${(Number(formatUnits(clubTokenBalance + stakedBalance, decimals || 18)) * (tokenPrice || 0)).toFixed(2)}`
    },
  ];

  return (
    <div className="mb-4 p-4 border rounded-2xl">
      <header className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-sm text-zinc-500">Amount raised</h3>
          <p className="text-3xl font-mono">${formatDecimals(totalDeposits || 0n, assetDecimals, 2)}</p>
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

      {readyToSettle ? (
        <>
          <p className="bg-blue-50 border border-blue-600 text-blue-600 text-sm rounded-lg p-2 mt-4 text-center">
            The club has reached the required targets to be activated!
          </p>

          <RoundedButton
            size="large"
            variant="dark"
            className="w-full mt-4"
            {...activateClubButtonProps}
          >
            Activate Club
          </RoundedButton>
        </>
      ) : (
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
      )}

      <footer className="mt-4 px-2 flex flex-col items-center justify-between">
        <div className="flex items-center justify-between gap-2 w-full border-t py-2 text-zinc-800">
          <h3 className="font-medium text-lg">Your Holdings</h3>
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
