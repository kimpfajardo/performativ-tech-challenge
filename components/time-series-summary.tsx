import { cn, formatToUSD, toNormalDate } from "@/lib/utils";
import { Box } from "./box";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { TimeSeriesPoint } from "@/lib/types";
import { CommonBarChart } from "./bar-chart";
import { RadialChart } from "./radial-chart";

export const HoverableCard = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <Card className={cn("flex flex-col gap-1 p-2 px-3 md:p-4 h-full shadow-none hover:drop-shadow-lg hover:scale-[1.025] transition w-full",className)}>
      {children}
    </Card>
  );
};

const SummaryStatCard = ({
  label,
  value,
  currency,
}: {
  label: string;
  value: string | number;
  currency: string;
}) => {
  return (
    <HoverableCard>
      <span className="text-xs md:text-sm">{label}</span>
      <span className="font-mono font-bold text-sm md:text-xl">
        {value}{" "}
        <span className="text-slate-400 text-sm font-normal">{currency}</span>
      </span>
    </HoverableCard>
  );
};

const SummaryField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="grid lg:grid-cols-2 gap-1 py-2 lg:py-4 text-xs lg:text-base flex-wrap">
      <span>{label}</span>
      <span className="font-mono font-bold lg:text-right">{children}</span>
    </div>
  );
};

export const TimeSeriesSummary = ({
  timeseries,
  currency,
}: {
  timeseries: TimeSeriesPoint;
  currency: string;
}) => {
  return (
    <div className="grid xl:grid-cols-2 gap-4 w-full">
      <Box className="flex flex-col gap-4">
        <h5 className="font-black text-xl">{toNormalDate(timeseries.date)}</h5>
        <div className="grid md:grid-cols-2 gap-4 grid-rows-2">
          <div className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md">
            <SummaryStatCard
              label="Value"
              value={formatToUSD(timeseries.value)}
              currency={currency}
            />
          </div>
          <div className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-100">
            <SummaryStatCard
              label="Return"
              value={formatToUSD(timeseries.return)}
              currency={currency}
            />
          </div>
          <div className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-200">
            <SummaryStatCard
              label="Open Value"
              value={formatToUSD(timeseries.openValue)}
              currency={currency}
            />
          </div>
          <div className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-300">
            <SummaryStatCard
              label="Average Capital Base"
              value={formatToUSD(timeseries.averageCapitalBase)}
              currency={currency}
            />
          </div>
        </div>
        <div className="grow">
          <HoverableCard className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-400">
            <CommonBarChart />
          </HoverableCard>
        </div>
      </Box>
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col sm:flex-row md:flex-col w-full gap-4 md:items-start">
          <HoverableCard className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md">
            <CardTitle>
              <h6>Average Capital Base</h6>
            </CardTitle>
            <CardDescription>Internal Rate Of Return</CardDescription>
            <div className="min-w-[200px] mx-auto">
              <RadialChart
                chartData={[
                  {
                    label: "ACB RoR",
                    emptyValue:
                      1 - timeseries.averageCapitalBaseInternalRateOfReturn,
                    actualValue:
                      timeseries.averageCapitalBaseInternalRateOfReturn,
                  },
                ]}
                title={`${(
                  timeseries.averageCapitalBaseInternalRateOfReturn * 100
                ).toFixed(2)}%`}
              />
            </div>
          </HoverableCard>
          <HoverableCard className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-300">
            <CardTitle>
              <h6>Benchmark Average Capital Base</h6>
            </CardTitle>
            <CardDescription>Internal Rate Of Return</CardDescription>
            <div className="min-w-[200px] mx-auto">
              <RadialChart
                chartData={[
                  {
                    label: "Benchmark ACB RoR",
                    emptyValue:
                      1 -
                      timeseries.benchmarkAverageCapitalBaseInternalRateOfReturn,
                    actualValue:
                      timeseries.benchmarkAverageCapitalBaseInternalRateOfReturn,
                  },
                ]}
                title={`${(
                  timeseries.benchmarkAverageCapitalBaseInternalRateOfReturn *
                  100
                ).toFixed(2)}%`}
              />
            </div>
          </HoverableCard>
        </div>
        <div className="flex flex-col gap-4">
          <div className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-100">
            <SummaryStatCard
              label="Exposure"
              value={formatToUSD(timeseries.exposure)}
              currency={currency}
            />
          </div>
          <HoverableCard className="motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-400">
            <h6 className="text-sm lg:text-xl font-bold">
              Adjusted Benchmarks
            </h6>
            <div className="flex flex-col divide-y">
              <SummaryField label="Value">
                {formatToUSD(timeseries.adjustedBenchmarkValue)}{" "}
                <span className="text-slate-400 text-sm font-normal">
                  {currency}
                </span>
              </SummaryField>
              <SummaryField label="Performance Value">
                {formatToUSD(timeseries.adjustedBenchmarkPerformanceValue)}{" "}
                <span className="text-slate-400 text-sm font-normal">
                  {currency}
                </span>{" "}
              </SummaryField>
              <SummaryField label="Time-Weighted Return">
                {timeseries.adjustedBenchmarkTimeWeightedReturn.toFixed(4)}
              </SummaryField>
              <SummaryField label="Money-Weighted Return">
                {timeseries.adjustedBenchmarkMoneyWeightedReturn.toFixed(4)}
              </SummaryField>
              <SummaryField label="Return">
                {formatToUSD(timeseries.adjustedBenchmarkReturn)}{" "}
                <span className="text-slate-400 text-sm font-normal">
                  {currency}
                </span>
              </SummaryField>
            </div>
          </HoverableCard>
        </div>
      </Box>
    </div>
  );
};
