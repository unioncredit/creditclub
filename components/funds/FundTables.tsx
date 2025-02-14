import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import { FundStatsPanel } from "@/components/funds/tabs/FundStatsPanel";
import { FundHoldersTable } from "@/components/funds/tabs/FundHoldersTable";
import { FundTrusteesTable } from "@/components/funds/tabs/FundTrusteesTable";
import { Address } from "viem";

export const FundTables = ({
  clubAddress,
  className,
}: {
  clubAddress: Address;
  className?: string;
}) => {
  return (
    <Tabs className={cn("border border-black font-mono rounded-lg overflow-hidden", className)} defaultValue="stats">
      <TabsList>
        <TabsTrigger value="stats">Fund Stats</TabsTrigger>
        <TabsTrigger value="holders">FUND Holders</TabsTrigger>
        <TabsTrigger value="trustees">Fund Trustees</TabsTrigger>
      </TabsList>
      <TabsContent value="stats">
        <FundStatsPanel clubAddress={clubAddress} />
      </TabsContent>
      <TabsContent value="holders">
        <FundHoldersTable clubAddress={clubAddress} />
      </TabsContent>
      <TabsContent value="trustees">
        <FundTrusteesTable clubAddress={clubAddress} />
      </TabsContent>
    </Tabs>
  )
};