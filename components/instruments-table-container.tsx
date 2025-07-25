import { Instrument, ResponseTypes } from "@/lib/types";
import { Button } from "./ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useCursorPagination } from "@/lib/hooks";
import { useInitialInstruments } from "@/lib/context/initial-instruments-context";
import { useTransactionPageActions } from "@/lib/context/transaction-page-actions";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

export const InstrumentsTableContainer = ({
  onSelect,
}: {
  onSelect: (instrument: Instrument) => void;
}) => {
  const initialInstrumentsData = useInitialInstruments();
  const { getAllInstruments } = useTransactionPageActions();

  const { data, goNext, goPrevious, canNext, canPrevious, isLoading } =
    useCursorPagination<ResponseTypes["GetInstruments"]>(
      initialInstrumentsData,
      initialInstrumentsData.last_evaluated_key,
      getAllInstruments,
      5
    );

  return (
    <div className="w-full flex flex-col gap-2">
      {data.instruments.map((instrument, key) => {
        return (
          <Card
            className={cn("p-0", {
              "opacity-50": isLoading,
            })}
            key={key}>
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <CardTitle>{instrument?.name}</CardTitle>
                <CardDescription>{instrument.symbol}</CardDescription>
                <div>
                  <span className="text-sm font-mono font-bold">
                    <span className="text-slate-400 font-sans font-normal">
                      Base Price:
                    </span>{" "}
                    {instrument.base_price.toFixed(2)}
                  </span>
                </div>
              </div>
              <div>
                <Button
                  disabled={isLoading}
                  onClick={() => {
                    onSelect(instrument);
                  }}>
                  Select
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <div className="flex justify-end items-center gap-6">
        <Button
          className="border-2 border-black bg-transparent"
          variant={"outline"}
          type="button"
          onClick={goPrevious}
          disabled={!canPrevious}>
          <span>
            <ArrowLeftIcon />
          </span>
          Previous
        </Button>
        <Button type="button" onClick={goNext} disabled={!canNext}>
          <span>
            <ArrowRightIcon />
          </span>
          Next
        </Button>
      </div>
    </div>
  );
};
