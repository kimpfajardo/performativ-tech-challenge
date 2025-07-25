"use client";

import { format, isValid, parse } from "date-fns";
import { Box } from "./box";
import { DatePicker } from "./date-picker";
import { Label } from "./ui/label";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseStringDate, updateSearchParam } from "@/lib/utils";
import { usePerformance } from "@/lib/context/initial-performance-context";

export const TimeSeriesFilters = () => {
  const data = usePerformance();
  const router = useRouter();
  const searchParams = useSearchParams();

  const fr = searchParams.get("from");
  const t = searchParams.get("t");

  const dayRangeToShow = 25;

  const initialFrom = parseStringDate(
    fr ?? data.ts[data.ts.length - dayRangeToShow - 1].date
  );

  const initialTo = parseStringDate(t ?? data.ts[data.ts.length - 1].date);

  const [from, setFrom] = useState<Date>(initialFrom);
  const [to, setTo] = useState<Date>(initialTo);

  const generateSearchParams = useCallback(
    (searchParamString: string) => {
      let params = new URLSearchParams(searchParamString);
      const fromDefault = data.ts[data.ts.length - dayRangeToShow - 1].date;
      const toDefault = data.ts[data.ts.length - 1].date;

      if (!fr || !isValid(parse(fr, "yyyy-MM-dd", new Date()))) {
        params = updateSearchParam("from", fromDefault, params);
      }

      if (!t || !isValid(parse(t, "yyyy-MM-dd", new Date()))) {
        params = updateSearchParam("to", toDefault, params);
      }
      return params;
    },
    [t, fr, data.ts]
  );

  useEffect(() => {
    const params = generateSearchParams(searchParams?.toString());
    router.replace(`?${params.toString()}`);
  }, [router, searchParams, generateSearchParams]);

  return (
    <Box>
      <div className="flex sm:flex-row flex-col gap-4 w-full">
        <div className="flex flex-col gap-2 md:max-w-[250px] w-full">
          <Label htmlFor="trade_date">From</Label>
          <div className="w-full">
            <DatePicker
              id="trade_date"
              initialValue={from}
              onValueChange={(date) => {
                setFrom(date);
                const params = generateSearchParams(
                  updateSearchParam(
                    "from",
                    format(date, "yyyy-MM-dd")
                  )?.toString()
                );
                router.replace(`?${params.toString()}`);
              }}
              calendarProps={{
                disabled: to ? { after: to } : undefined,
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 md:max-w-[250px] w-full">
          <Label htmlFor="trade_date">To</Label>
          <div>
            <DatePicker
              id="to"
              initialValue={initialTo}
              onValueChange={(date) => {
                setTo(date);
                router.refresh();
              }}
              calendarProps={{
                disabled: from ? { before: from } : undefined,
              }}
            />
          </div>
        </div>
      </div>
    </Box>
  );
};
