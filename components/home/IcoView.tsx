import { ProgressBar } from "@/components/shared/ProgressBar";
import { IcoFundOverview } from "@/components/home/IcoFundOverview";
import { IcoCreditTrustees } from "@/components/home/IcoCreditTrustees";
import { Button } from "@/components/ui/Button";

export const IcoView = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <section className={className}>
      <header className="flex items-center border-b border-black pb-3">
        <p className="text-xl py-1 px-2 border border-black">ICO-BC</p>

        <div className="pl-4 flex-1">
          <h2 className="font-medium text-lg">Initial Credit Offering: Builder Credit</h2>

          <div className="flex">
            <p className="text-stone-500">Progress: $1,000 of $41,000 ~</p>
            <ProgressBar value={20} className="flex-1 ml-2" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <IcoFundOverview />

        <div>
          <IcoCreditTrustees />

          <div className="flex flex-col gap-2 mt-2">
            <Button variant="highlight">
              [More Details]
            </Button>
            <Button variant="highlight">
              Fund Builder Credit
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
};