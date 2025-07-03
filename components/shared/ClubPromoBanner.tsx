import { Address } from "viem";
import Link from "next/link";

import { ShadowButton } from "@/components/ui/ShadowButton";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { useClubData } from "@/hooks/useClubData";
import { createClubUrl } from "@/lib/links";
import { useIcoStats } from "@/hooks/useIcoStats";

export const ClubPromoBanner = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { data: clubData } = useClubData(clubAddress);
  const { data: icoStats } = useIcoStats(clubAddress);

  const name: string = clubData?.name ?? "";
  const current: string = icoStats?.current ?? "0";
  const goal: string = icoStats?.goal ?? "0";
  const percentage: number = icoStats?.percentage ?? 0;

  return (
    <div className="mt-4 bg-blue-50 p-4 rounded-xl flex items-center justify-between sm:flex-col">
      <div className="flex-1">
        <h2 className="font-mono font-medium">Initial Credit Offering: {name}</h2>
        <div className="flex">
          <p className="font-mono text-sm">Progress: ${current} of ${goal} ~ </p>
          <ProgressBar value={percentage} className="flex-1 ml-1 max-w-[200px]" />
        </div>
      </div>

      <Link href={createClubUrl(clubAddress)}>
        <ShadowButton className="sm:mt-4">
          View details
        </ShadowButton>
      </Link>
    </div>
  )
};