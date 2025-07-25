import { TimeSeriesPoint } from "@/lib/types";
import { Area, AreaChart, CartesianGrid, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "./ui/chart";
import { abbreviateNumber, formatToUSD, toNormalDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Box } from "./box";

const chartConfig = {
  value: {
    color: "var(--color-bar-chart-1)",
  },
  date: {
    label: "Date",
    color: "var(--color-bar-chart-4)",
  },
} satisfies ChartConfig;

export const TimeSeries = ({
  handleSelectSeries,
  data,
}: {
  handleSelectSeries: (point: TimeSeriesPoint) => void;
  data: TimeSeriesPoint[];
}) => {
  return (
    <div className="h-[300px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          height={300}
          accessibilityLayer
          data={data}
          onClick={(val) => {
            handleSelectSeries(val?.activePayload?.[0].payload);
          }}
          margin={{
            left: -12,
            right: 12,
          }}>
          <CartesianGrid vertical={false} />
          <YAxis
            dataKey="value"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => abbreviateNumber(value)}
          />
          <ChartTooltip
            cursor={false}
            content={(prop) => {
              const data = prop?.payload?.[0]?.payload as TimeSeriesPoint;
              if (!data) return;
              return (
                <Box className="flex flex-col bg-white select-none">
                  <span>{toNormalDate(data.date)}</span>
                  <p className="font-mono font-bold text-lg">
                    {formatToUSD(data.value)}{" "}
                    <span className="text-slate-400 text-xs font-normal">
                      USD
                    </span>
                  </p>
                  <span className="font-xs flex gap-1 items-center">
                    <ExternalLink width={11} height={11} />{" "}
                    <span>Click to view details</span>
                  </span>
                </Box>
              );
            }}
          />
          <defs>
            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-value)"
                stopOpacity={0.8}
              />
              <stop
                offset="60%"
                stopColor="var(--color-value)"
                stopOpacity={0.0}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="value"
            type="natural"
            fill="url(#fillDesktop)"
            fillOpacity={0.4}
            stroke="var(--color-bar-chart-1)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
