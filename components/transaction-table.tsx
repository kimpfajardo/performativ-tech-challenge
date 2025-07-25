import { Transaction } from "@/lib/types";
import { GenericTable } from "./generic-table";
import { Badge } from "./ui/badge";
import { cn, formatToUSD, toNormalDate } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  CheckCircle,
  CircleDashedIcon,
  EyeIcon,
  LoaderIcon,
  Trash2Icon,
} from "lucide-react";

export function TransactionsTable({
  data,
  onSelectTransaction,
  handleOpenDeleteModal,
  isLoading,
}: {
  data: Transaction[];
  onSelectTransaction: (value: Transaction) => void;
  handleOpenDeleteModal: (id: string) => void;
  isLoading: boolean;
}) {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-[2] flex items-center justify-center">
          <LoaderIcon className="animate-spin" width={20} height={20} />
        </div>
      )}

      <div
        className={cn("relative", {
          "opacity-10": isLoading,
        })}>
        <GenericTable
          data={data}
          getRowKey={(row) => row.id}
          columns={[
            {
              label: "Transaction Type",
              accessor: "transaction_type",
              render: (row) => {
                const type = row.transaction_type;

                const typeToColor = {
                  BUY: "bg-blue-500",
                  "CASH-COMMITMENT": "bg-green-500",
                };

                return (
                  <Badge
                    className={cn(
                      typeToColor[type as keyof typeof typeToColor]
                    )}>
                    {type.split("-").join(" ")}
                  </Badge>
                );
              },
            },
            { label: "Portfolio", accessor: "portfolio" },
            {
              label: "Trade Date",
              accessor: "trade_date",
              render: (row) => {
                return (
                  <span className="flex items-center gap-2">
                    {toNormalDate(row.trade_date)}
                  </span>
                );
              },
            },
            {
              label: "Status",
              accessor: "status",
              render: (row) => {
                const isSettled = row.status === "SETTLED";
                return (
                  <span className="flex items-center gap-2">
                    {isSettled && <CheckCircle width={16} color="green" />}
                    {!isSettled && (
                      <CircleDashedIcon
                        width={18}
                        className="animate animate-pulse text-slate-400"
                      />
                    )}
                    {row.status}
                  </span>
                );
              },
            },
            { label: "Quantity", accessor: "quantity" },
            { label: "Price", accessor: "price" },
            {
              label: "Total amount",
              accessor: "total_amount",
              render: (row) => {
                return (
                  <span className="font-bold">
                    {formatToUSD(row.total_amount)}
                  </span>
                );
              },
            },
            {
              label: "",
              accessor: "id",
              render: (row) => {
                return (
                  <div className="flex items-center gap-2">
                    <Button
                      className="cursor-pointer"
                      variant={"default"}
                      onClick={() => {
                        onSelectTransaction(row);
                      }}>
                      <EyeIcon />
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        handleOpenDeleteModal(row.id);
                      }}>
                      <Trash2Icon />
                    </Button>
                  </div>
                );
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
