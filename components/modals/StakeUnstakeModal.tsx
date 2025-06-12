// @ts-ignore
import { Modal, ModalOverlay, SegmentedControl } from "@unioncredit/ui";
import { Address } from "viem";
import { useState } from "react";

import { useClubData } from "@/hooks/useClubData";
import { useModals } from "@/providers/ModalManagerProvider";
import { StakePanel } from "@/components/modals/panels/StakePanel";
import { UnstakePanel } from "@/components/modals/panels/UnstakePanel";
import { useClubStaking } from "@/hooks/useClubStaking";

export const STAKE_UNSTAKE_MODAL = "stake-unstake-modal";

export const StakeUnstakeModal = ({
  activeTab,
  clubAddress,
}: {
  activeTab: "stake" | "unstake";
  clubAddress: Address;
}) => {
  const [tab, setTab] = useState<"stake" | "unstake">(activeTab);

  const { close } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { data: stakingData } = useClubStaking(clubAddress);

  const { symbol: clubTokenSymbol } = clubData;
  const { symbol: stakingTokenSymbol } = stakingData;

  const action = tab === "stake" ? "Stake" : "Unstake";

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title={`${action} ${tab === "stake" ? clubTokenSymbol : stakingTokenSymbol}`} onClose={close} />
        <Modal.Body>
          <SegmentedControl
            value={tab}
            initialActive={0}
            onChange={(value: { id: "stake" | "unstake" }) => setTab(value.id)}
            items={[
              {
                id: "stake",
                label: "Stake",
              },
              {
                id: "unstake",
                label: "Unstake",
              },
            ]}
          />

          {tab === "stake" ? (
            <StakePanel clubAddress={clubAddress} />
          ) : (
            <UnstakePanel clubAddress={clubAddress} />
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
