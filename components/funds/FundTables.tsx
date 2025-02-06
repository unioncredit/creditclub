import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";
import { FundStatsTable } from "@/components/funds/tables/FundStatsTable";
import { FundHoldersTable } from "@/components/funds/tables/FundHoldersTable";
import { FundTrusteesTable } from "@/components/funds/tables/FundTrusteesTable";

export const FundTables = ({
  className,
}: {
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
        <FundStatsTable />
      </TabsContent>
      <TabsContent value="holders">
        <FundHoldersTable />
      </TabsContent>
      <TabsContent value="trustees">
        <FundTrusteesTable />
      </TabsContent>
    </Tabs>
  )
};