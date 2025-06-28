import {
  CheckIcon,
  Modal,
  ModalOverlay,
  InfoBanner,
  Usdc,
  Union,
  WalletIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { useAccount, useWatchAsset } from "wagmi";

import { useModals } from "@/providers/ModalManagerProvider";
import { SendReceivePanel } from "@/components/shared/SendReceivePanel";
import { useClubData } from "@/hooks/useClubData";
import { Address } from "viem";
import { format } from "@/lib/format";
import { useToken } from "@/hooks/useToken";
import { TOKENS } from "@/constants";
import { ApprovalButton } from "@/components/shared/ApprovalButton";
import { useConnectedMember } from "@/providers/ConnectedMemberProvider";
import { useContract } from "@/hooks/useContract";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { POST_TX_MODAL } from "@/components/modals/PostTxModal";
import { unionContract } from "@/contracts/base";


export const FIXED_BID_MODAL = "fixed-bid-modal";

export const FixedBidModal = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress);
  const { data: connectedMember, refetch: refetchConnectedMember } = useConnectedMember();
  const { address } = useAccount();
  const { close, open: openModal } = useModals();
  const { token } = useToken();
  const { watchAsset } = useWatchAsset();

  const tokenContract = useContract("token");
  const creditVaultContract = useCreditVaultContract(clubAddress);

  const { fixedBidPrice, unionBalance } = clubData;
  const { tokenBalance } = connectedMember;

  const canBid = tokenBalance > fixedBidPrice;

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title="Fixed Bid for Club Rewards" onClose={close} />
        <Modal.Body>
          <InfoBanner
            align="left"
            variant="warning"
            label="Buying the UNION from the club helps the club grow its stake :)"
            className="text-sm p-3 bg-blue-50 text-blue-600 absolute top-[80px] left-0 right-0 font-mono"
          />

          <SendReceivePanel
            className="mt-14 mb-4"
            leftPanel={{
              title: "What you send",
              value: `$${format(fixedBidPrice, token)}`,
              icon: <Usdc />,
            }}
            rightPanel={{
              title: "What you receive",
              value: format(unionBalance, TOKENS.UNION),
              icon: <Union />
            }}
          />

          <ApprovalButton
            owner={address}
            amount={fixedBidPrice}
            disabled={tokenBalance < fixedBidPrice}
            spender={creditVaultContract.address}
            tokenContract={tokenContract}
            actionProps={{
              ...creditVaultContract,
              functionName: "fixedBid",
              label: canBid ? "Place Bid" : "Insufficient funds",
              icon: canBid ? CheckIcon : undefined,
              disabled: !canBid,
              onComplete: async (hash: string) => {
                refetchClubData();
                refetchConnectedMember();
                openModal(POST_TX_MODAL, {
                  header: `Your bid was successful`,
                  title: "Bid",
                  content: (
                    <>
                      <p className="font-mono mt-2 mb-4">You successfully bid {format(fixedBidPrice, token)} USDC for {format(unionBalance, TOKENS.UNION)} UNION</p>
                    </>
                  ),
                  action: {
                    icon: WalletIcon,
                    label: "Add token to wallet",
                    onClick: () => watchAsset({
                      type: 'ERC20',
                      options: {
                        address: unionContract.address,
                        symbol: "UNION",
                        decimals: 18,
                      },
                    })
                  },
                  hash,
                })
              }
            }}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
