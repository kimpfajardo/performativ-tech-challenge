import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Box } from "./box";
import {
  buildColorMapForTree,
  formatToUSD,
  getTotalMarketValue,
  normalizeKey,
} from "@/lib/utils";
import { ArrowUpRightIcon, BoxIcon, ExternalLinkIcon } from "lucide-react";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { HoldingNode, ResponseTypes } from "@/lib/types";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { useResponsiveInnerRadius } from "@/lib/hooks";

export const HoldingsChart = ({
  assets,
  config,
}: {
  assets: ResponseTypes["GetAssets"];
  config: Record<
    string,
    {
      label: string;
      color: string;
    }
  >;
}) => {
  const totalNumberOfAssets = useMemo(
    () => getTotalMarketValue(assets),
    [assets]
  );
  const totalMarketValue = useMemo(() => getTotalMarketValue(assets), [assets]);

  const finalAssets = {
    name: "All Holdings",
    currency: "USD",
    absolute_value: totalMarketValue,
    percentage: 1,
    quantity: totalNumberOfAssets,
    children: assets,
    key: "all_holdings",
    fill: "green",
  } as HoldingNode;

  const [selectedAssets, setSelectedAssets] = useState<HoldingNode[]>([]);

  const [focused, setFocused] = useState<HoldingNode>(finalAssets);

  const [breadcrumbArr, setBreadcrumArr] = useState<string[]>(["All Holdings"]);
  const flattenedAssets = useMemo(
    () =>
      focused?.children?.map((node) => ({
        ...node,
        key: normalizeKey(node.name),
        fill: config[node?.key as string]?.color ?? "#999", // Fallback to gray
      })),
    [focused]
  );
  const currentData = selectedAssets[selectedAssets.length - 1] ?? finalAssets;
  const chartConfig = useMemo(
    () => buildColorMapForTree(assets) satisfies ChartConfig,
    []
  );

  const innerRadius = useResponsiveInnerRadius();

  const handlePrevious = () => {
    setSelectedAssets((prev) => {
      const prevCopy = [...prev];
      prevCopy.pop();
      if (prevCopy.length === 0) {
        setFocused(finalAssets);
      } else {
        setFocused(prevCopy[prevCopy.length - 1]);
      }
      return prevCopy;
    });
    setBreadcrumArr((prev) => {
      const prevCopy = [...prev];
      prevCopy.pop();
      return prevCopy;
    });
  };

  return (
    <>
      <div>
        {selectedAssets.length > 0 && (
          <Button onClick={handlePrevious}>
            <ArrowUpRightIcon />
            Go up level
          </Button>
        )}
        <ChartContainer
          config={config}
          className="w-full mx-auto aspect-square">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, label, { payload }) => {
                    return (
                      <div className="flex flex-col">
                        <span className="font-bold">{payload.name}</span>
                        <span>
                          {formatToUSD(+value)} {payload.currency}
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Pie
              innerRadius={innerRadius}
              isAnimationActive={false}
              data={flattenedAssets}
              dataKey="absolute_value"
              nameKey={"key"}
              onClick={(
                data: Partial<HoldingNode & { key: string; fill: string }>
              ) => {
                if (!data) return;

                const {
                  name,
                  currency,
                  quantity,
                  percentage,
                  absolute_value,
                  children,
                  key,
                  fill,
                } = data;

                if (children?.length === 0) return;
                const newFocusedData = {
                  name,
                  currency,
                  quantity,
                  percentage,
                  absolute_value,
                  children,
                  key,
                  fill,
                } as HoldingNode;
                setFocused(newFocusedData);
                setSelectedAssets((prev) => [...prev, newFocusedData]);
                setBreadcrumArr((prev) => [...prev, newFocusedData.name]);
              }}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        width={300}
                        className="min-w-0 truncate max-w-[250px] overflow-hidden"
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="hidden font-bold sm:text-xs xl:text-4xl fill-foreground">
                          {currentData.name}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
      {currentData && (
        <Box className="items-start w-full h-max">
          <div className="flex flex-col w-full gap-1 lg:gap-3">
            <div className="flex gap-2">
              {breadcrumbArr.map((item, key) => (
                <span className="flex gap-2" key={item}>
                  <span className="text-slate-400">{key === 0 ? "" : ">"}</span>
                  <span> {item}</span>
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <h6 className="text-xl lg:text-3xl">{currentData.name}</h6>
              {selectedAssets.length > 0 && (
                <Button onClick={handlePrevious}>Go back</Button>
              )}
            </div>
            <hr className="w-6 my-1 border-t-4 border-black" />
            <div className="flex flex-col gap-2">
              <span className="flex items-end gap-2 font-mono text-2xl font-bold lg:text-4xl">
                {formatToUSD(currentData?.absolute_value ?? 0)}{" "}
                <span className="text-lg font-normal lg:text-2xl text-slate-400">
                  USD
                </span>
              </span>
              {currentData?.quantity && (
                <span className="flex items-center gap-2 text-xl text-slate-400">
                  <BoxIcon className="text-slate-500" />{" "}
                  {formatToUSD(currentData?.quantity ?? 0)} units
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 max-h-[800px] overflow-y-scroll">
              {currentData?.children?.map((node, key) => {
                return (
                  <Card className="relative p-2 px-3 overflow-hidden" key={key}>
                    <div
                      className="absolute top-0 left-0 w-4 h-full border-l-5"
                      style={{
                        borderColor: config[node?.key as string].color,
                      }}
                    />
                    <div className="flex items-center justify-between gap-2 lg:gap-4">
                      <div className="flex flex-col lg:gap-1">
                        <CardTitle>
                          <p className="mb-1 text-sm lg:text-lg">{node.name}</p>
                          <p className="text-sm lg:text-base">
                            {formatToUSD(node.absolute_value ?? 0)}{" "}
                            <span className="text-slate-400">
                              {node.currency}
                            </span>
                          </p>
                        </CardTitle>
                        <CardDescription>
                          {formatToUSD(node.quantity ?? 0)} Units
                        </CardDescription>
                      </div>
                      {node.children.length > 0 && (
                        <button
                          className="cursor-pointer"
                          onClick={() => {
                            setFocused(node);
                            setSelectedAssets((prev) => [...prev, node]);
                            setBreadcrumArr((prev) => [...prev, node.name]);
                          }}>
                          <Box className="aspect-square w-10 h-10 !p-0 items-center justify-center">
                            <ExternalLinkIcon width={20} height={20} />
                          </Box>
                        </button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Box>
      )}
    </>
  );
};
