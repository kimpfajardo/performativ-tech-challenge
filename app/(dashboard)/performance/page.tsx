import { PageTitle } from "@/components/page-title";
import { TimeSeriesFilters } from "@/components/time-series-filters";
import { TimeSeriesContainer } from "@/components/time-series-container";
import { getTimeSeries } from "@/lib/actions/performance";
import { PerformanceProvider } from "@/lib/context/initial-performance-context";
import { Suspense } from "react";

export default async function PerformancePage() {
  const timeseriesData = await getTimeSeries();

  return (
    <div className="p-4 lg:p-6 space-y-10">
      <PageTitle
        title="Performance"
        description="Our performance, visualized over time."
      />
      <PerformanceProvider timeseriesData={timeseriesData}>
        <Suspense fallback={null}>
          <section>
            <TimeSeriesFilters />
          </section>
        </Suspense>

        <Suspense fallback={null}>
          <TimeSeriesContainer />
        </Suspense>
      </PerformanceProvider>
    </div>
  );
}
