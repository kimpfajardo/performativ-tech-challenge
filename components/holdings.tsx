"use client";

import { Suspense, useMemo } from "react";
import {
  NumberOfAssets,
  TopPerformingAsset,
  TotalMarketValue,
  WorstPerformingAsset,
} from "./holdings-cards";
import {
  formatToUSD,
  getNumberOfAssets,
  getTopPerformer,
  getTotalMarketValue,
  getWorstPerformer,
} from "@/lib/utils";
import { ResponseTypes } from "@/lib/types";
import { HoldingsChart } from "./holdings-pie-chart";

export const Holdings = ({
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
  const totalMarketValue = useMemo(() => {
    return getTotalMarketValue(assets);
  }, [assets]);

  const numberOfAssets = useMemo(() => {
    return getNumberOfAssets(assets);
  }, [assets]);

  const topPerformer = useMemo(() => {
    return getTopPerformer(assets);
  }, [assets]);

  const worstPerformer = useMemo(() => {
    return getWorstPerformer(assets);
  }, [assets]);

  return (
    <>
      <section className="grid grid-cols-2 grid-rows-2 gap-4 2xl:grid-cols-4 2xl:grid-rows-1">
        <div className="w-full motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md">
          <TotalMarketValue
            label={"USD"}
            value={`${formatToUSD(totalMarketValue)}`}
          />
        </div>
        <div className="w-full motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-100">
          <NumberOfAssets label="Total" value={`${numberOfAssets}`} />
        </div>
        <div className="w-full motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-150">
          <TopPerformingAsset
            label={topPerformer?.currency ?? "USD"}
            value={(topPerformer?.name ?? "").split(" ")[0]}
            customContent={
              <span className="font-mono text-sm text-green-800 sm:text-xl lg:text-3xl animate-pulse">
                {`${formatToUSD((topPerformer?.percentage ?? 0) * 100)}`}%
              </span>
            }
          />
        </div>
        <div className="w-full motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-200">
          <WorstPerformingAsset
            label={worstPerformer?.currency ?? "USD"}
            value={(worstPerformer?.name ?? "").split(" ")[0]}
            customContent={
              <span className="font-mono text-sm text-red-800 sm:text-xl lg:text-3xl animate-pulse">
                {`${formatToUSD((worstPerformer?.percentage ?? 0) * 100)}`}%
              </span>
            }
          />
        </div>
      </section>
      <section className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2 xl:grid-rows-1">
        <Suspense>
          <HoldingsChart assets={assets} config={config} />
        </Suspense>
      </section>
    </>
  );
};
