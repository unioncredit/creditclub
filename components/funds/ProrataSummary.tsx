import { Address } from "viem";
import { useProrata } from "@/hooks/useProrata";
import { StatGrid, StatGridRow } from "@/components/shared/StatGrid";

export const ProrataSummary = ({
  clubAddress,
  className,
}: {
  clubAddress: Address;
  className?: string;
}) => {
  const { data: prorataData } = useProrata(clubAddress);

  const rows: StatGridRow[] = [
    {
      name: "Club Stake",
      value: prorataData.formatted.clubStake,
    },
    {
      name: "Min Members",
      value: prorataData.formatted.minMembers,
    },
    {
      name: "Current Members",
      value: prorataData.formatted.currentMembers,
    },
    {
      name: "Divisor (Max)",
      value: prorataData.formatted.divisor,
    },
    {
      name: "Prorata Amount",
      value: prorataData.formatted.prorataAmount,
    },
  ];

  return (
    <StatGrid 
      title="Prorata Calculation" 
      rows={rows} 
      className={className}
      size="small"
    />
  );
}; 