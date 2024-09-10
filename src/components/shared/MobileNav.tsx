import "./MobileNav.scss";

// @ts-ignore
import { Box, Button, ProfileIcon } from "@unioncredit/ui";

import { format } from "@/utils/format.ts";
import { useAccount } from "wagmi";
import { useUnionMember } from "@/providers/UnionMemberProvider.tsx";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { BORROW_MODAL } from "@/components/modals/BorrowModal.tsx";
import { REPAY_MODAL } from "@/components/modals/RepayModal.tsx";

export const MobileNav = () => {
  const { address, isConnected } = useAccount();
  const { data: member } = useUnionMember();
  const { open: openModal } = useModals();

  const { creditLimit, owed } = member;

  return isConnected && (
    <Box className="MobileNav !hidden md:!flex">
      <Button
        size="small"
        className="CreditButton mr-2 lg:px-2"
        label={
          <p className="inline-flex items-center">
            Available · <span className="ml-1 text-black">${format(creditLimit)}</span>
          </p>
        }
        color="secondary"
        variant="light"
        onClick={() => openModal(BORROW_MODAL)}
      />

      <Button
        size="small"
        className="BorrowRateButton mr-2 lg:px-2"
        label={
          <p className="inline-flex items-center">
            {owed <= 0n ? (
              "No payment due"
            ) : (
              <>
                Payment Due ·
                <span className="text-black ml-1">${format(owed)} </span>
              </>
            )}
          </p>
        }
        color="secondary"
        variant="light"
        onClick={() => openModal(REPAY_MODAL)}
      />

      <Button
        size="small"
        className="ProfileButton mr-2"
        icon={ProfileIcon}
        label="Profile"
        color="secondary"
        variant="light"
        onClick={() => open(`https://app.union.finance/profile/opt:${address}`)}
      />
    </Box>
  )
};