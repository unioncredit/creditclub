import "./MobileNav.scss";

// @ts-ignore
import { Box, Button, ProfileIcon } from "@unioncredit/ui";

import { format, toPercent } from "@/utils/format.ts";
import { formatUnits } from "viem";
import { BLOCKS_PER_YEAR } from "@/constants.ts";
import { useMember } from "@/providers/ConnectedMemberProvider.tsx";
import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";
import { useAccount } from "wagmi";

export const MobileNav = () => {
  const { address, isConnected } = useAccount();
  const { data: member } = useMember();
  const { data: creditClub } = useCreditClub();

  const { unionCreditLimit } = member;
  const { borrowRatePerSecond } = creditClub;

  return isConnected && (
    <Box className="MobileNav !hidden md:!flex">
      <Button
        size="small"
        className="CreditButton mr-2 lg:px-2"
        label={
          <p className="inline-flex items-center">
            Available Credit · <span className="ml-1 text-black">${format(unionCreditLimit)}</span>
          </p>
        }
        color="secondary"
        variant="light"
        onClick={() => open(`https://app.union.finance/`)}
      />

      <Button
        size="small"
        className="BorrowRateButton mr-2 lg:px-2"
        label={
          <p className="inline-flex items-center">
            Rate · <span className="ml-1 text-black">{toPercent(formatUnits(borrowRatePerSecond * BLOCKS_PER_YEAR, 18))}</span>
          </p>
        }
        color="secondary"
        variant="light"
        onClick={() => open(`https://data.union.finance/optimism`)}
      />

      <Button
        size="small"
        className="ProfileButton mr-2"
        icon={ProfileIcon}
        label="Your profile"
        color="secondary"
        variant="light"
        onClick={() => open(`https://app.union.finance/profile/opt:${address}`)}
      />
    </Box>
  )
};