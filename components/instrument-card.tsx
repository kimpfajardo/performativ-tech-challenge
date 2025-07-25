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
    <Box className="flex flex-col gap-2 relative">
      <div className="flex justify-between">
        <div className="flex gap-4 items-start">
          <div className="w-full flex flex-col gap-2">
            <Badge className="mt-1">{instrument.symbol}</Badge>
            <span className="text-xs md:text-2xl font-bold break-after-all">
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
          <span className="text-xs md:text-base font-mono font-bold">
            <span className="text-slate-400 font-sans font-normal">
              Base Price:
            </span>{" "}
            {instrument.base_price.toFixed(2)}
          </span>
        </div>
      </div>
    </Box>
  );
};
