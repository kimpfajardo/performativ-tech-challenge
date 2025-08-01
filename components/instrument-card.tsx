import { XIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Box } from "./box";
import { Instrument } from "@/lib/types";

export const InstrumentCard = ({
  instrument,
  onRemoveInstrument,
}: {
  instrument: Instrument;
  onRemoveInstrument: VoidFunction;
}) => {
  return (
    <Box className="relative flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex items-start gap-4">
          <div className="flex flex-col w-full gap-2">
            {instrument?.symbol && (
              <Badge className="mt-1">{instrument.symbol}</Badge>
            )}
            <span className="text-xs font-bold md:text-2xl break-after-all">
              {instrument.name}
            </span>
          </div>
        </div>
        <Button
          className="absolute top-2 right-2"
          variant={"outline"}
          onClick={onRemoveInstrument}>
          <XIcon />
        </Button>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-xs md:text-base">
          <p>{instrument.industry}</p>
          <p className="text-slate-400">
            {instrument.region}
            {instrument.country ? `, ${instrument.country}` : ""}
          </p>
        </div>
        <div>
          <span className="font-mono text-xs font-bold md:text-base">
            <span className="font-sans font-normal text-slate-400">
              Base Price:
            </span>{" "}
            {instrument.base_price.toFixed(2)}
          </span>
        </div>
      </div>
    </Box>
  );
};
