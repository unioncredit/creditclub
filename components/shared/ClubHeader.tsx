// @ts-ignore
import { BlogIcon, FarcasterIcon, WalletIcon, RepayIcon, UnionIcon, VouchIcon, PopoverMenu, ListIcon, TwitterIcon } from "@unioncredit/ui";
import { useAccount } from "wagmi";
import cn from "classnames";

import CreditClubLogo from "@/assets/creditclub-logo.svg";
import MobileCreditClubLogo from "@/assets/creditclub-mobile-logo.svg";
import { ConnectButton } from "@/components/shared/ConnectButton";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { useUnionMember } from "@/providers/UnionMemberProvider";
import { format } from "@/lib/format";
import { useToken } from "@/hooks/useToken";
import { useModals } from "@/providers/ModalManagerProvider";
import { BORROW_MODAL } from "@/components/modals/BorrowModal";
import { REPAY_MODAL } from "@/components/modals/RepayModal";
import { REWARDS_MODAL } from "@/components/modals/RewardsModal";
import { Address } from "viem";

export const ClubHeader = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { token, wad } = useToken();
  const { isConnected } = useAccount();
  const { data: unionMember } = useUnionMember();
  const { open: openModal } = useModals();

  const { creditLimit, owed } = unionMember;

  return (
    <header className="w-full items-center flex flex-col">
      <div className="w-full items-center flex justify-between">
        <div className="sm:hidden">
          <a href="/">
            <CreditClubLogo className="w-[200px]" />
          </a>
        </div>
        <div className="hidden sm:block">
          <a href="/">
            <MobileCreditClubLogo className="h-[50px] max-w-[115px] -ml-4 scale-90" />
          </a>
        </div>

        <div className="flex">
          {isConnected && (
            <>
              <div className="md:hidden whitespace-nowrap">
                <RoundedButton
                  className="mr-2 sm:text-[0px] sm:pl-[12px] sm:pr-[8px]"
                  icon={<WalletIcon width={24} />}
                  onClick={() => openModal(BORROW_MODAL)}
                >
                  <span className="lg:hidden">Borrow · </span>${format(creditLimit, token, creditLimit < wad ? 2 : 0)}
                </RoundedButton>

                <RoundedButton
                  className="mr-2 sm:text-[0px] sm:pl-[12px] sm:pr-[8px]"
                  icon={<RepayIcon width={24} />}
                  onClick={() => openModal(REPAY_MODAL)}
                >
                  <span className="lg:hidden">Repay · </span>${format(owed, token, owed < wad ? 2 : 0)}
                </RoundedButton>
              </div>

              <RoundedButton
                icon={<UnionIcon width={24} />}
                className="mr-2 sm:text-[0px] sm:pl-[12px] sm:pr-[8px]"
                onClick={() => openModal(REWARDS_MODAL, {
                  clubAddress,
                })}
              />

              <PopoverMenu
                items={[
                  { label: "Updates", icon: BlogIcon, href: "/blog" },
                  { label: "Warpcast", icon: FarcasterIcon, target: "_blank", href: "https://warpcast.com/creditclub" },
                  { label: "Twitter", icon: TwitterIcon, target: "_blank", href: "https://x.com/creditclub_eth" },
                ]}
                position="left"
                button={(toggleOpen: () => void) => (
                  <RoundedButton
                    onClick={toggleOpen}
                    className="w-[58px] mr-2"
                  >
                    <ListIcon width={26} height={26} />
                  </RoundedButton>
                )}
              />
            </>
          )}

          <div className={cn("ConnectButton", {
            "disconnected": !isConnected,
          })}>
            <ConnectButton/>
          </div>
        </div>
      </div>

      {isConnected && (
        <div className="md:flex hidden gap-2 w-full mt-2">
          <RoundedButton
            className="flex-1 w-full text-sm"
            icon={<WalletIcon width={24} />}
            onClick={() => openModal(BORROW_MODAL)}
          >
            Borrow · ${format(creditLimit, token, 0)}
          </RoundedButton>

          <RoundedButton
            className="flex-1 w-full text-sm"
            icon={<RepayIcon width={24} />}
            onClick={() => openModal(REPAY_MODAL)}
          >
            Repay · ${format(owed, token, 0)}
          </RoundedButton>
        </div>
      )}
    </header>
  );
};