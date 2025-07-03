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

  const symbol: string = clubData?.symbol ?? "";
  const price: number = priceData?.price ?? 0;
  const volume_24h: number = priceData?.volume_24h ?? 0;

  return (
    <div className={cn("flex items-center justify-between border border-black py-2 px-3 font-mono", className)}>
      <div>
        <h3 className="font-semibold">{symbol}/USDC Pool:</h3>
        <p className="text-sm">24hr Volume: <span className="font-medium">${volume_24h.toFixed(2)}</span></p>
        <p className="text-sm">Price: <span className="font-medium">${price.toFixed(2)}</span></p>
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