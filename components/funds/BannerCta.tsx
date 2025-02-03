import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useModals } from "@/providers/ModalManagerProvider";
import { MINT_NFT_MODAL } from "@/components/modals/MintNftModal";

export const BannerCta = ({
  className,
}: {
  className?: string;
}) => {
  const { open } = useModals();

  return (
    <div className={cn("p-6 text-center bg-blue-50 rounded-xl", className)}>
      <h2 className="mb-4">You qualify for a pro rata of credit from this fund!</h2>
      <Button
        size="large"
        variant="shadow"
        onClick={() => open(MINT_NFT_MODAL)}
      >
        Claim Creditline From BC
      </Button>
    </div>
  )
};