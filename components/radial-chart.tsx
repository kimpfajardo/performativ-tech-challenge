"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "A radial chart with stacked sections";

const chartConfig = {
  actual: {
    label: "ActualValue",
    color: "var(--color-bar-chart-1)",
  },
} satisfies ChartConfig;

export function RadialChart({
  chartData,
  title,
  description,
}: {
  chartData: {
    label: string;
    emptyValue: number;
    actualValue: number;
  }[];
  title: string;
  description?: string;
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="w-full aspect-square max-w-[200px]">
      <RadialBarChart
        data={chartData}
        startAngle={0}
        endAngle={360 * chartData[0].actualValue}
        innerRadius={80}
        outerRadius={110}>
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey="actualValue" background  cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold">
                      {title}
                    </tspan>
                    {description && (
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground">
                        {description}
                      </tspan>
                    )}
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
