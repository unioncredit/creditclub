import { Address } from "viem";
import { ShadowButton } from "@/components/ui/ShadowButton";
import { cn } from "@/lib/utils";
import { useTokenPriceData } from "@/hooks/useTokenPriceData";
import { useClubData } from "@/hooks/useClubData";
import { DEFAULT_CHAIN } from "@/constants";

export const PoolMarketData = ({
  clubAddress,
  className,
}: {
  clubAddress: Address;
  className?: string;
}) => {
  const { data: clubData } = useClubData(clubAddress);
  const { data: priceData } = useTokenPriceData(clubAddress);

  const { symbol } = clubData;
  const { price, volume_24h } = priceData;

  return (
    <div className={cn("flex items-center justify-between border border-black py-2 px-3 font-mono", className)}>
      <div>
        <h3 className="font-semibold">{symbol}/USDC Pool:</h3>
        <p className="text-sm">24hr Volume: <span className="font-medium">${volume_24h}</span></p>
        <p className="text-sm">Price: <span className="font-medium">${(price || 0).toFixed(2)}</span></p>
      </div>

      <ShadowButton
        size="small"
        onClick={() => open(`https://app.uniswap.org/positions/create/v3?currencyA=NATIVE&currencyB=${clubAddress}&chain=${DEFAULT_CHAIN.name.toLowerCase()}`)}
      >
        +join pool
      </ShadowButton>
    </div>
  );
};