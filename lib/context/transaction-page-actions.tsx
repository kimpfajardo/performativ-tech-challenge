"use client";

import { createContext, useContext } from "react";
import {
  Instrument,
  PartialTransaction,
  ResponseTypes,
  Transaction,
} from "../types";

type TransactionResponse = ResponseTypes["GetTransactions"];
type InstrumentResponse = ResponseTypes["GetInstruments"];
type CreateTransactionResponse = ResponseTypes["PostTransaction"];
type CreateTransactionPayload = PartialTransaction;
type UpdateTransactionPayload = Transaction;

export type FetchFunctionType<T> = (
  limit?: number,
  lastKey?: string
) => Promise<T>;

export type QueryActions = {
  getAllTransactions: FetchFunctionType<TransactionResponse>;
  getAllInstruments: FetchFunctionType<InstrumentResponse>;
  getInstrumentById: (instrumentId: number | string) => Promise<Instrument>;
};

export type MutationActions = {
  createTransaction: (
    payload: CreateTransactionPayload
  ) => Promise<CreateTransactionResponse>;
  deleteTransactionById: (transactionId: string) => Promise<string>;
  updateTransactionById: (payload: UpdateTransactionPayload) => Promise<string>;
};

type Props = QueryActions & MutationActions;

const TransactionPageActionsCtx = createContext<Props>({} as Props);

export const useTransactionPageActions = () => {
  return useContext(TransactionPageActionsCtx);
};

export const TransactionPageActionsProvider = ({
  children,
  queryFn,
  mutationFn,
}: {
  children: React.ReactNode;
  queryFn: QueryActions;
  mutationFn: MutationActions;
}) => {
  return (
    <TransactionPageActionsCtx.Provider value={{ ...queryFn, ...mutationFn }}>
      {children}
    </TransactionPageActionsCtx.Provider>
  );
};
