"use client";

import { useCallback } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn, formatToUSD, toNormalDate } from "@/lib/utils";
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  LoaderIcon,
  Trash2Icon,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { Transaction } from "@/lib/types";

export const TransactionCard = ({
  transaction,
  onSelectTransaction,
  handleOpenDeleteModal,
}: {
  transaction: Transaction;
  onSelectTransaction: (value: Transaction) => void;
  handleOpenDeleteModal: (id: string) => void;
}) => {
  const DynamicBadge = useCallback(() => {
    if (!transaction) return;
    const type = transaction.transaction_type;

    const typeToColor = {
      BUY: "bg-blue-500",
      "CASH-COMMITMENT": "bg-green-500",
    };

    return (
      <Badge className={cn(typeToColor[type as keyof typeof typeToColor])}>
        {type.split("-")[0]}
      </Badge>
    );
  }, [transaction]);
  return (
    <Card className="p-4 bg-slate-200 shadow-none hover:scale-[1.01] duration-200 hover:shadow-lg transition ease-in-out">
      <div className="flex justify-between">
        <Tooltip>
          <TooltipTrigger>
            {transaction?.status === "SETTLED" ? (
              <CheckCircle2Icon color="green" />
            ) : (
              <CircleDashedIcon />
            )}
          </TooltipTrigger>
          <TooltipContent>
            <span>{transaction.status}</span>
          </TooltipContent>
        </Tooltip>
        <span>{toNormalDate(transaction.settlement_date)}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-2xl">
            $ {formatToUSD(transaction.total_amount)}
          </span>
          <Tooltip>
            <TooltipTrigger>
              <h6 className="text-xl font-black max-w-[200px] truncate">
                {transaction.portfolio}
              </h6>
            </TooltipTrigger>
            <TooltipContent>{transaction.portfolio}</TooltipContent>
          </Tooltip>
        </div>

        <DynamicBadge />
      </div>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => {
            onSelectTransaction(transaction);
          }}>
          View
        </Button>
        <Button
          color="red"
          variant={"outline"}
          onClick={() => {
            handleOpenDeleteModal(transaction.id);
          }}>
          <Trash2Icon />
        </Button>
      </div>
    </Card>
  );
};

export const TransactionGrid = ({
  data,
  onSelectTransaction,
  handleOpenDeleteModal,
  isLoading,
}: {
  data: Transaction[];
  onSelectTransaction: (value: Transaction) => void;
  handleOpenDeleteModal: (id: string) => void;
  isLoading: boolean;
}) => {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-[2] flex items-center justify-center">
          <LoaderIcon className="animate-spin" width={20} height={20} />
        </div>
      )}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 relative",
          {
            "opacity-10": isLoading,
          }
        )}>
        {data.map((transaction, index) => {
          return (
            <div
              key={index}
              className={
                "motion-opacity-in-0 motion-translate-y-in-[50px] motion-blur-in-md"
              }>
              <TransactionCard
                transaction={transaction}
                onSelectTransaction={onSelectTransaction}
                handleOpenDeleteModal={handleOpenDeleteModal}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
