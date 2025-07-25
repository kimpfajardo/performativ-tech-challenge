"use client";

import { createContext, useContext, useMemo } from "react";
import { ResponseTypes } from "../types";

type ContextType = ResponseTypes["GetTimeSeries"];

const InitialPerformanceCtx = createContext<ContextType>({} as ContextType);

export const usePerformance = () => {
  return useContext(InitialPerformanceCtx);
};

export const PerformanceProvider = ({
  children,
  timeseriesData,
}: {
  children: React.ReactNode;
  timeseriesData: ContextType;
}) => {
  const memoizedData = useMemo(() => timeseriesData, []);

  return (
    <InitialPerformanceCtx.Provider value={memoizedData}>
      {children}
    </InitialPerformanceCtx.Provider>
  );
};
