"use client";

import { format, formatDate, isValid, toDate } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ComponentProps, useState } from "react";
import { DayPicker } from "react-day-picker";

export function DatePicker({
  id,
  initialValue,
  onValueChange,
  calendarProps,
}: {
  id: string;
  onValueChange?: (date: Date) => void;
  initialValue?: Date;
  calendarProps?: ComponentProps<typeof DayPicker>;
}) {
  const [date, setDate] = useState<Date | undefined>(initialValue);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="border !border-slate-400 data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal">
          <CalendarIcon />
          {date && isValid(date) ? (
            format(date, "MMM dd, yyyy")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          id={id}
          {...calendarProps}
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date);
            onValueChange?.(date as Date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
