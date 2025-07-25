"use client";

import { createContext, useContext } from "react";
import { ResponseTypes } from "../types";

type TransactionData = ResponseTypes["GetTransactions"];

const InitialTransactionsCtx = createContext<TransactionData>(
  {} as TransactionData
);

export const useInitialTransactions = () => {
  return useContext(InitialTransactionsCtx);
};

export const InitialTransactionsProvider = ({
  children,
  transactions,
}: {
  children: React.ReactNode;
  transactions: TransactionData;
}) => {
  return (
    <InitialTransactionsCtx.Provider value={transactions}>
      {children}
    </InitialTransactionsCtx.Provider>
  );
};
