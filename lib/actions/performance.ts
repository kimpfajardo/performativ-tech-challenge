"use server";

import { api } from "@/config/axios";
import { cache } from "react";
import { ResponseTypes } from "../types";

export const getTimeSeries = cache(async () => {
  const result = await api.get<ResponseTypes["GetTimeSeries"]>("/timeseries");
  return result.data;
})
