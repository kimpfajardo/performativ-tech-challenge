"use client";

import { createContext, useContext } from "react";
import { ResponseTypes } from "../types";

type InstrumentData = ResponseTypes["GetInstruments"];

 
const InitialInstrumentsCtx = createContext<InstrumentData>(
  {} as InstrumentData
);

export const useInitialInstruments = () => {
  return useContext(InitialInstrumentsCtx);
};

export const InitialInstrumentsProvider = ({
  children,
  instruments,
}: {
  children: React.ReactNode;
  instruments: InstrumentData;
}) => {
  return (
    <InitialInstrumentsCtx.Provider value={instruments}>
      {children}
    </InitialInstrumentsCtx.Provider>
  );
};
