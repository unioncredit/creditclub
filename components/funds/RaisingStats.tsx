// @ts-ignore
import { ConfettiIcon, ChartIcon, LinkOutIcon } from "@unioncredit/ui";
import { useAccount } from "wagmi";
import { Address, formatUnits } from "viem";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { DistributionBarItem, DistributionBarValues } from "@/components/shared/DistributionBarValues";
import { useClubData } from "@/hooks/useClubData";
import { useModals } from "@/providers/ModalManagerProvider";
import { MINT_REDEEM_MODAL } from "@/components/modals/MintRedeemModal";
import { formatDecimals } from "@/lib/format";
import { formatDuration } from "@/lib/utils";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import { useClubMember } from "@/hooks/useClubMember";
import { useErc20Token } from "@/hooks/useErc20Token";

export const RaisingStats = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { address } = useAccount();
  const { open: openModal } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubMember } = useClubMember(address, clubAddress);
  const { data: tokenPrice } = useTokenPrice(clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);

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
      title: "Lockup period",
      value: formatDuration(Number(lockupPeriod)),
    }
  ];

  return (
    <div className="mb-4 p-4 border rounded-2xl">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm text-stone-500">Raising</h3>
          <p className="text-3xl font-mono">${raisedFormatted}</p>
        </div>

        <RoundedButton size="small">
          <ChartIcon width={24}/>
          ICO: Open
        </RoundedButton>
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
        Mint {symbol} Token
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
