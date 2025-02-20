import { useRouter } from "next/router";
import { Address } from "viem";

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
  const router = useRouter();
  const { data: clubData } = useClubData(clubAddress);
  const { data: icoStats } = useIcoStats(clubAddress);

  const { name } = clubData;
  const { current, goal, percentage } = icoStats;

  return (
    <div className="mt-4 bg-blue-50 p-4 rounded-xl flex items-center justify-between">
      <div className="flex-1">
        <h2 className="font-mono">Initial Credit Offering: {name}</h2>
        <div className="flex">
          <p className="font-mono text-sm">Progress: ${current} of ${goal} ~ </p>
          <ProgressBar value={percentage} className="flex-1 ml-1 max-w-[200px]" />
        </div>
      </div>

      <ShadowButton onClick={() => router.push(createClubUrl(clubAddress))}>
        Check eligibility
      </ShadowButton>
    </div>
  )
};