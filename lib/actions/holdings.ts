"use server";

import { api } from "@/config/axios";
import { cache } from "react";
import { ResponseTypes } from "../types";

export const getAssets = cache(async () => {
  const result = await api.get<ResponseTypes['GetAssets']>("/assetalloc");
  return result.data;
})
