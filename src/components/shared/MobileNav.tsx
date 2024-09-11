import "./MobileNav.scss";

import {
  Box,
  Button,
  WalletIcon,
  RepayIcon,
  UnionIcon,
  ProfileIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { format } from "@/utils/format.ts";
import { useAccount } from "wagmi";
import { useUnionMember } from "@/providers/UnionMemberProvider.tsx";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { BORROW_MODAL } from "@/components/modals/BorrowModal.tsx";
import { REPAY_MODAL } from "@/components/modals/RepayModal.tsx";
import { FEELING_LUCKY_MODAL } from "@/components/modals/FeelingLuckyModal.tsx";
import { WAD } from "@/constants.ts";

export const MobileNav = () => {
  const { address, isConnected } = useAccount();
  const { data: member } = useUnionMember();
  const { open: openModal } = useModals();

  const { creditLimit, owed, unionBalance } = member;

  return isConnected && (
    <Box className="MobileNav !hidden md:!flex">
      <Button
        size="small"
        icon={WalletIcon}
        className="CreditButton mr-2 lg:px-2"
        label={
          <p className="inline-flex items-center">
            <span className="label">
              Available ·
            </span>
            <span className="ml-1 text-black">
              ${format(creditLimit, creditLimit < WAD ? 2 : 0)}
            </span>
          </p>
        }
        color="secondary"
        variant="light"
        onClick={() => openModal(BORROW_MODAL)}
      />

      <Button
        size="small"
        icon={RepayIcon}
        className="RepayButton mr-2 lg:px-2"
        label={
          <p className="inline-flex items-center">
            <>
              <span className="label">
                Balance ·
              </span>
              <span className="text-black ml-1">
                ${format(owed, owed < WAD ? 2 : 0)}
              </span>
            </>
          </p>
        }
        color="secondary"
        variant="light"
        onClick={() => openModal(REPAY_MODAL)}
      />

      <Button
        size="small"
        icon={UnionIcon}
        className="UnionButton mr-2 lg:px-2"
        label={format(unionBalance, 0)}
        color="secondary"
        variant="light"
        onClick={() => openModal(FEELING_LUCKY_MODAL)}
      />

      <Button
        size="small"
        className="ProfileButton mr-2 lg:px-2"
        icon={ProfileIcon}
        label="Profile"
        color="secondary"
        variant="light"
        onClick={() => open(`https://app.union.finance/profile/opt:${address}`)}
      />
    </Box>
  )
};