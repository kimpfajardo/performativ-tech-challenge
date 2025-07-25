"use server";

import { api } from "@/config/axios";
import {
  Instrument,
  RequestPayload,
  ResponseTypes,
  Transaction,
} from "../types";
import { cache } from "react";

const generateGetSearchParams = (limit: number, lastKey: string) => {
  const params = new URLSearchParams();
  if (limit) {
    params.set("limit", limit + "");
  }

  if (lastKey) {
    params.set("last_evaluated_key", lastKey);
  }

  const paramString = params.toString();
  return paramString;
};

export const getAllTransactions = cache(async (limit = 5, lastKey = "") => {
  const paramString = generateGetSearchParams(limit, lastKey);

  const result = await api.get<ResponseTypes["GetTransactions"]>(
    `/transactions${paramString ? `?${paramString}` : ""}`
  );

  return result.data;
});

export const getAllInstruments = cache(async (limit = 5, lastKey = "") => {
  const paramString = generateGetSearchParams(limit, lastKey);

  const result = await api.get<ResponseTypes["GetInstruments"]>(
    `/instruments${paramString ? `?${paramString}` : ""}`
  );

  return result.data;
});

export const createTransaction = async (
  payload: RequestPayload["PostTransaction"]
) => {
  const result = await api.post<ResponseTypes["PostTransaction"]>(
    "/transaction",
    payload
  );
  return result.data;
};

export const deleteTransactionById = async (transaction_id: string) => {
  const result = await api.delete<string>(`/transaction/${transaction_id}`);
  return result.data;
};

export const updateTransactionById = async (payload: Transaction) => {
  const result = await api.put<string>("/transaction", payload);
  return result.data;
};
export const getInstrumentById = async (instrumentId: number | string) => {
  const result = await api.get<Instrument>(`/instrument/${instrumentId}`);
  return result.data;
};
