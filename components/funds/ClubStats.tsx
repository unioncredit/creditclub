// @ts-ignore
import { ConfettiIcon, UnionIcon } from "@unioncredit/ui";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { DistributionBarItem, DistributionBarValues } from "@/components/shared/DistributionBarValues";
import { FormattedValue } from "@/components/shared/FormattedValue";

export const ClubStats = () => {
  const barValues: DistributionBarItem[] = [
    {
      value: 10,
      label: "$1,000.00",
      color: "blue900",
      title: "Available",
    },
    {
      value: 50,
      label: "$5,000.00",
      color: "blue500",
      title: "Utilized",
    },
    {
      value: 40,
      label: "$4,000.00",
      color: "amber500",
      title: "Defaulting",
    }
  ];

  return (
    <div className="mt-8 p-4 border rounded-2xl">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm text-stone-500">Club Stake</h3>
          <p className="text-3xl font-mono">$50,000.00</p>
        </div>

        <RoundedButton size="small">
          <UnionIcon width={24}/>
          Fixed BID
        </RoundedButton>
      </header>

      <DistributionBarValues items={barValues}/>

      <footer className="mt-4 pt-4 border-t flex items-center gap-4 justify-between">
        <div>
          <h3 className="font-medium text-sm text-stone-500">Rewards to Distribute</h3>
          <FormattedValue
            value="12,453.4487"
            className="text-3xl font-medium"
            smallDecimals={true}
          />
        </div>

        <RoundedButton
          size="large"
          variant="rainbow"
          icon={<ConfettiIcon width={24} height={24} />}
          className="w-[200px]"
        >
          Daily Distribution
        </RoundedButton>
      </footer>
    </div>
  );
}
