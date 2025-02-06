// @ts-ignore
import { ConfettiIcon, ChartIcon, LinkOutIcon } from "@unioncredit/ui";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { DistributionBarItem, DistributionBarValues } from "@/components/shared/DistributionBarValues";
import Link from "next/link";

export const RaisingStats = () => {
  const barValues: DistributionBarItem[] = [
    {
      value: 10000,
      label: "$10,000.00",
      color: "green600",
      title: "Available",
    },
    {
      value: 40000,
      label: "$50,000.00",
      color: "blue50",
      title: "Goal",
    }
  ];

  const footerStats = [
    {
      title: "Your Holdings",
      value: "100,000.00 BC",
    },
    {
      title: "Your Holdings",
      value: "100,000.00 BC",
      link: "https://google.com"
    },
    {
      title: "Your Holdings",
      value: "100,000.00 BC",
      link: "https://google.com"
    }
  ];

  return (
    <div className="mb-4 p-4 border rounded-2xl">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm text-stone-500">Club Stake</h3>
          <p className="text-3xl font-mono">$50,000.00</p>
        </div>

        <RoundedButton size="small">
          <ChartIcon width={24}/>
          ICO: Open
        </RoundedButton>
      </header>

      <DistributionBarValues items={barValues}/>

      <RoundedButton
        size="large"
        variant="dark"
        className="w-full mt-4"
      >
        Mint BC Token
      </RoundedButton>

      <footer className="mt-4 px-2 flex flex-col items-center justify-between">
        {footerStats.map(({ title, value, link }) => (
          <div key={title} className="flex items-center justify-between gap-2 w-full border-t py-2">
            <h3 className="font-medium text-lg text-stone-500">{title}</h3>
            <p className="text-lg font-mono font-medium flex gap-1 items-center">
              {value}

              {link && (
                <Link href={link}>
                  <LinkOutIcon width={24} height={24} className="fill text-black" />
                </Link>
              )}
            </p>
          </div>
        ))}
      </footer>
    </div>
  );
}
