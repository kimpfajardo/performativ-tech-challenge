"use client";

import { useCallback } from "react";
import { DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Transaction } from "@/lib/types";
import { Badge } from "./ui/badge";
import { cn, formatToUSD, toNormalDate } from "@/lib/utils";
import { Box } from "./box";
import {
  BanknoteArrowUpIcon,
  CalendarPlus,
  CheckCircle2Icon,
  CircleDashedIcon,
  CreditCardIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

export const TransactionField = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode | string;
}) => {
  return (
    <div className="grid grid-rows-2 py-2 md:grid-cols-2 md:gap-4 md:grid-rows-1">
      <span className="text-sm font-bold text-slate-400">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
};

export const TransactionViewMode = ({
  transaction,
  handleEditMode,
  handleOpenDeleteModal,
}: {
  transaction: Transaction | null;
  handleEditMode: VoidFunction;
  handleOpenDeleteModal: (id: string) => void;
}) => {
  const DynamicBadge = useCallback(
    ({}) => {
      const type = transaction?.transaction_type;

      const typeToColor = {
        BUY: "bg-blue-500",
        "CASH-COMMITMENT": "bg-green-500",
      };

      const color = typeToColor[type as keyof typeof typeToColor];

      return (
        <Badge className={cn(color, "text-[10px] lg:text-sm")}>
          {type?.split("-").join(" ")}
        </Badge>
      );
    },
    [transaction?.transaction_type]
  );

  const DynamicStatusAlert = useCallback(() => {
    const status = transaction?.status;
    const statusToColor = {
      SETTLED: "text-green-500",
      PENDING: "text-slate-400",
    };
    const color = statusToColor[status as keyof typeof statusToColor];

    return <b className={cn(color)}>{status}</b>;
  }, [transaction?.status]);

  const DynamicTransactionTypeIcon = useCallback(() => {
    if (!transaction) return null;
    const typeToColor = {
      BUY: {
        color: "text-blue-500",
        bg: "!bg-blue-300",
        icon: CreditCardIcon,
      },
      "CASH-COMMITMENT": {
        color: "text-green-500",
        bg: "!bg-green-300",
        icon: BanknoteArrowUpIcon,
      },
    };

    const type =
      typeToColor[transaction?.transaction_type as keyof typeof typeToColor];
    const Icon = type?.icon;
    return (
      <Box
        className={cn(
          "w-max lg:p-4 rounded-lg lg:rounded-3xl",
          type?.color,
          type?.bg
        )}>
        <span className="lg:hidden">
          <Icon size={24} />
        </span>

        <span className="hidden lg:block">
          <Icon size={48} />
        </span>
      </Box>
    );
  }, [transaction]);

  const tradeDate = transaction?.trade_date
    ? toNormalDate(transaction?.trade_date as string)
    : "";
  const settlementDate = transaction?.settlement_date
    ? toNormalDate(transaction?.settlement_date as string)
    : "";

    console.log("transaction?.total_amount", transaction);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Transaction Details</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <DynamicTransactionTypeIcon />
          <div className="flex flex-col justify-between w-full gap-2 sm:flex-row">
            <div>
              <h4 className="text-lg font-black sm:text-xl md:text-2xl lg:text-4xl">
                {transaction?.portfolio}
              </h4>
              <p className="flex items-center gap-2">
                <span>
                  <CalendarPlus className="text-slate-300" />
                </span>
                <span className="text-sm lg:text-lg">{tradeDate}</span>
              </p>
            </div>
            <div>
              <DynamicBadge />
            </div>
          </div>
        </div>
        <Alert>
          {transaction?.status === "SETTLED" ? (
            <CheckCircle2Icon color="#00c950" />
          ) : (
            <CircleDashedIcon />
          )}
          <AlertTitle className="flex items-center gap-2">
            <span className="hidden md:block">
              This transaction has been marked as{" "}
            </span>
            <DynamicStatusAlert />
          </AlertTitle>
          {settlementDate && (
            <AlertDescription>
              <p className="flex gap-1">
                <span className="hidden md:block"> Settlement date: </span>{" "}
                <span className="font-bold text-black underline">
                  {settlementDate}
                </span>
              </p>
            </AlertDescription>
          )}
        </Alert>
        <Box className="flex flex-col divide-y-[1px] py-1 lg:py-4 divide-slate-300 !bg-slate-100">
          <TransactionField
            label="Price"
            value={`USD ${formatToUSD(transaction?.price ?? 0)}`}
          />
          <TransactionField
            label="Quantity"
            value={formatToUSD(transaction?.quantity ?? 0)}
          />
          <TransactionField
            label="Fx Rate"
            value={transaction?.fx_rate || "-"}
          />
          <TransactionField
            label="Transaction Costs"
            value={`USD ${formatToUSD(transaction?.transaction_costs ?? 0)}`}
          />
        </Box>

        {transaction?.comments && (
          <Box>
            <div className="space-y-4">
              <h6 className="text-sm font-bold text-slate-400">Comments</h6>
              <p>{transaction?.comments}</p>
            </div>
          </Box>
        )}

        <div>
          <span className="text-lg font-bold">Total</span>
          <p className="text-3xl font-black">
            USD {formatToUSD(transaction?.total_amount ?? 0)}
          </p>
        </div>
      </div>
      <DialogFooter className="pt-4 mt-4 border-t-2">
        <Button
          className="border-2 border-primary"
          size={"lg"}
          variant={"outline"}
          onClick={handleEditMode}>
          Edit
        </Button>
        <Button
          size={"lg"}
          variant={"destructive"}
          onClick={() => {
            handleOpenDeleteModal(transaction?.id as string);
          }}>
          Delete
        </Button>
      </DialogFooter>
    </>
  );
};
