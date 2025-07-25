"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { abbreviateNumber, formatToUSD } from "@/lib/utils";

const chartData = [
  { metric: "Value", value: 4901734 },
  { metric: "Return", value: 2083594 },
  { metric: "Open Value", value: 10317917 },
  { metric: "Ave. Cap Base", value: 2353729 },
]
  .sort((a, b) => (a.value < b.value ? 1 : a.value === b.value ? 0 : -1))
  .map((item, key) => {
    return {
      ...item,
      fill: `var(--color-bar-chart-${key + 1})`,
    };
  });

const chartConfig = {
  desktop: {
    label: "value",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function CommonBarChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] h-full aspect-auto w-full p-4">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          right: 16,
        }}>
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="metric"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
          hide
        />
        <XAxis dataKey="value" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey="value"
          layout="vertical"
          fill="var(--color-desktop)"
          radius={4}>
          <LabelList
            dataKey="metric"
            position="insideLeft"
            offset={8}
            className="fill-white"
            fontSize={12}
          />
          <LabelList
            dataKey="view"
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
