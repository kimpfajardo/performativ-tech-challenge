"use client";

import { useMemo, useState } from "react";
import { TimeSeries } from "./time-series";
import { TimeSeriesPoint } from "@/lib/types";
import { TimeSeriesSummary } from "./time-series-summary";
import { useSearchParams } from "next/navigation";
import { CircleOff } from "lucide-react";
import { usePerformance } from "@/lib/context/initial-performance-context";

const filterByDateRange = (
  data: TimeSeriesPoint[],
  from: string,
  to: string
): TimeSeriesPoint[] => {
  return data.filter(({ date }) => date >= from && date <= to);
};

export const TimeSeriesContainer = () => {
  const data = usePerformance();
  const [selectedPoint, setSelectedPoint] = useState<TimeSeriesPoint | null>(
    null
    // timeseries[timeseries.length - 1]
  );

  const handleSelectSeries = (point: TimeSeriesPoint) => {
    setSelectedPoint(point);
  };

  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const timeseriesData = useMemo(() => {
    if (!from || !to) return;
    const filteredByDate = filterByDateRange(data.ts, from, to);
    return filteredByDate;
  }, [from, to, data]);

  if (!from || !to) return <></>;

  return (
    <>
      <section className="h-[250px] lg:h-[300px] w-full lg:w-[98%] overflow-visible lg:pr-10">
        {(timeseriesData ?? [])?.length > 0 ? (
          <TimeSeries
            handleSelectSeries={handleSelectSeries}
            data={timeseriesData ?? []}
          />
        ) : (
          <div className="text-slate-400 flex flex-col items-center gap-4">
            <CircleOff className="text-slate-200" width={80} height={80} />
            <span>
              Nothing to see here. Please check if date filters are valid.
            </span>
          </div>
        )}
      </section>

      <section>
        {selectedPoint && (
          <TimeSeriesSummary currency={"USD"} timeseries={selectedPoint} />
        )}
      </section>
    </>
  );
};
