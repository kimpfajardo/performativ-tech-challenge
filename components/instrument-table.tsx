import { Badge } from "./ui/badge";
import { Instrument } from "@/lib/types";
import { type Column, GenericTable } from "./generic-table";
import { Button } from "./ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export const InstrumentTable = ({
  instruments,
  extendedColumns,
}: {
  instruments: Instrument[];
  extendedColumns?: Column<Instrument>[];
}) => {
  return (
    <div className="flex flex-col gap-2">
      <GenericTable
        data={instruments}
        getRowKey={(row) => row.id}
        columns={[
          {
            label: "Name",
            accessor: "name",
            render: (row) => {
              return (
                <div>
                  <p className="font-bold truncate max-w-[300px]">{row.name}</p>
                  <Badge>{row.symbol}</Badge>
                </div>
              );
            },
          },
          {
            label: "Base Price",
            accessor: "base_price",
          },
          {
            label: "Country/Region",
            accessor: "country",
            render: (row) => {
              return (
                <div>
                  <p>{row.country}</p>
                  <p className="text-xs text-slate-400">{row.region}</p>
                </div>
              );
            },
          },
          ...extendedColumns!,
        ]}
      />
      <div className="flex justify-end items-center gap-6">
        <Button
          className="border-2 border-black bg-transparent"
          variant={"outline"}
          type="button">
          <span>
            <ArrowLeftIcon />
          </span>
          Previous
        </Button>
        <Button type="button">
          <span>
            <ArrowRightIcon />
          </span>
          Next
        </Button>
      </div>
    </div>
  );
};
