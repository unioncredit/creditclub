// @ts-ignore
import { ConfettiIcon, AddIcon, LinkOutIcon } from "@unioncredit/ui";
import { useAccount } from "wagmi";
import { Address, formatUnits } from "viem";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { useClubData } from "@/hooks/useClubData";
import { useModals } from "@/providers/ModalManagerProvider";
import { MINT_REDEEM_MODAL } from "@/components/modals/MintRedeemModal";
import { formatDecimals } from "@/lib/format";
import { formatDuration } from "@/lib/utils";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import { useClubMember } from "@/hooks/useClubMember";
import { UNISWAP_SWAP_MODAL } from "@/components/modals/UniswapSwapModal";

export const BuyRedeemPanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { address } = useAccount();
  const { open: openModal } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubMember } = useClubMember(address, clubAddress);
  const { data: tokenPrice } = useTokenPrice(clubAddress);

  const {
    clubTokenBalance,
  } = clubMember;

  const {
    symbol,
    decimals,
    totalSupply,
    lockupPeriod,
  } = clubData;

  const totalSupplyFormatted = formatDecimals(totalSupply, decimals, 2);

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
          <h3 className="font-medium text-sm font-mono">Market cap</h3>

          <div className="flex">
            <p className="text-sm font-mono font-medium">${totalSupplyFormatted}</p>
          </div>
        </div>

        <RoundedButton size="small">
          <AddIcon width={24}/>
          ${symbol}
        </RoundedButton>
      </header>

      <ul className="mt-4 flex flex-col items-center justify-between border-b">
        {footerStats.map(({ title, value }, index) => (
          <li key={index} className="flex items-center justify-between gap-2 w-full border-t py-2">
            <h3 className="font-medium text-lg text-stone-500">{title}</h3>
            <p className="text-lg font-mono font-medium flex gap-1 items-center">
              {value}
            </p>
          </li>
        ))}
      </ul>

      <p className="my-2 rounded-lg font-mono text-blue-600 bg-blue-50 text-xs p-2">Raise Over. To acquire ${symbol} you will need to buy it on secondary markets.</p>

      <div className="flex gap-1">
        <RoundedButton
          size="medium"
          variant="blue"
          className="w-full text-sm"
          onClick={() => openModal(UNISWAP_SWAP_MODAL, {
            clubAddress,
          })}
        >
          Buy {symbol}
        </RoundedButton>

        <RoundedButton
          size="medium"
          variant="dark"
          className="w-full text-sm"
          onClick={() => openModal(MINT_REDEEM_MODAL, {
            activeTab: "redeem",
            clubAddress,
          })}
        >
          Redeem {symbol}
        </RoundedButton>
      </div>
    </div>
  );
}
