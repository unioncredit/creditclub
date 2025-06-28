import { ShadowButton } from "@/components/ui/ShadowButton";
import { cn } from "@/lib/utils";
import { useModals } from "@/providers/ModalManagerProvider";
import { MINT_NFT_MODAL } from "@/components/modals/MintNftModal";
import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";

export const BannerCta = ({
  clubAddress,
  className,
}: {
  clubAddress: Address;
  className?: string;
}) => {
  const { open } = useModals();
  const { data: clubData } = useClubData(clubAddress);

  const { name = "" } = clubData || {};

  return (
    <div className={cn("p-6 text-center bg-blue-50 rounded-xl", className)}>
      <h2 className="mb-4 font-mono">You qualify for a pro rata of credit from this fund!</h2>
      <ShadowButton
        size="large"
        variant="light"
        onClick={() => open(MINT_NFT_MODAL, { clubAddress })}
      >
        Join {name || "this club"}
      </ShadowButton>
    </div>
  )
};