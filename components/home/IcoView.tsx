import { ProgressBar } from "@/components/shared/ProgressBar";
import { IcoFundOverview } from "@/components/home/IcoFundOverview";
import { IcoCreditTrustees } from "@/components/home/IcoCreditTrustees";
import { ShadowButton } from "@/components/ui/ShadowButton";
import { Address } from "viem";
import { useIcoStats } from "@/hooks/useIcoStats";
import { useClubData } from "@/hooks/useClubData";
import { useRouter } from "next/router";
import { createClubUrl } from "@/lib/links";
import { getInitials } from "@/lib/utils";

export const IcoView = ({
  clubAddress,
  className,
}: {
  clubAddress: Address;
  className?: string;
}) => {
  const router = useRouter();
  const { data: clubData } = useClubData(clubAddress);
  const { data: icoStats } = useIcoStats(clubAddress);

  const name: string = clubData?.name ?? "";
  const current: string = icoStats?.current ?? "0";
  const goal: string = icoStats?.goal ?? "0";
  const percentage: number = icoStats?.percentage ?? 0;

  return (
    <section className={className}>
      <header className="flex items-center border-b border-black pb-3">
        <p className="text-xl py-1 px-2 border border-black sm:hidden">ICO-{getInitials(name)}</p>

        <div className="pl-4 flex-1 sm:pl-0">
          <h2 className="font-medium text-lg">Initial Credit Offering: {name}</h2>

          <div className="flex">
            <p className="text-stone-500">Progress: ${current} of ${goal} ~</p>
            <ProgressBar value={percentage} className="flex-1 ml-2" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-1">
        <IcoFundOverview clubAddress={clubAddress} />

        <div>
          <IcoCreditTrustees clubAddress={clubAddress} />

          <div className="flex flex-col gap-2 mt-2">
            <ShadowButton variant="blue" onClick={() => router.push(createClubUrl(clubAddress))}>
              [More Details]
            </ShadowButton>
          </div>
        </div>
      </div>
    </section>
  )
};