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
  // Debug for problematic club
  if (clubAddress === "0xf82501018Fe8c6b0DbEb51604FDb636bdd741F74") {
    console.log("=== FundTables rendering ===");
  }

  return (
    <Tabs className={cn("border border-black font-mono rounded-lg overflow-hidden", className)} defaultValue="stats">
      <TabsList>
        <TabsTrigger value="stats">Stats</TabsTrigger>
        <TabsTrigger value="holders">Holders</TabsTrigger>
        <TabsTrigger value="trustees">Trustees</TabsTrigger>
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