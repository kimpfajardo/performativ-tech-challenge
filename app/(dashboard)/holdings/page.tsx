import { Holdings } from "@/components/holdings";
import { PageTitle } from "@/components/page-title";
import { ChartConfig } from "@/components/ui/chart";
import { getAssets } from "@/lib/actions/holdings";
import { addFillToTree, buildColorMapForTree } from "@/lib/utils";

export default async function HoldingsPage() {
  const assets = await getAssets();
  const formattedAssets = addFillToTree(assets);
  const chartConfig = buildColorMapForTree(assets) satisfies ChartConfig;
  return (
    <div className="p-4 space-y-10 lg:p-6">
      <PageTitle
        title="Holdings"
        description="Our performance, visualized over time."
      />

      <Holdings assets={formattedAssets} config={chartConfig} />
    </div>
  );
}
