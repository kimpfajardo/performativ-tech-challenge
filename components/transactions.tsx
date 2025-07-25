"use client";

import { Suspense, useCallback, useMemo } from "react";
import { Box } from "./box";
import { DividerY } from "./divider";
import { CreateTransaction } from "./transaction-create-mode";
import { ListTypeSelector } from "./list-type-selector";
import { Button } from "./ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { TransactionView } from "./transaction-view";
import { ResponseTypes } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useInitialTransactions } from "@/lib/context/initial-transactions-context";
import { useCursorPagination } from "@/lib/hooks";
import { useTransactionPageActions } from "@/lib/context/transaction-page-actions";

const useLimitFromUrl = (defaultLimit = 10): number => {
  const searchParams = useSearchParams();
  const rawLimit = searchParams.get("limit");
  const parsed = parseInt(rawLimit || "", 10);
  return isNaN(parsed) ? defaultLimit : parsed;
};

export const Transactions = () => {
  const limit = useLimitFromUrl();

  const initialTransactions = useInitialTransactions();
  const { getAllTransactions } = useTransactionPageActions();

  const { data, goNext, goPrevious, canNext, canPrevious, isLoading, refetch } =
    useCursorPagination<ResponseTypes["GetTransactions"]>(
      initialTransactions,
      initialTransactions.last_evaluated_key ?? "",
      getAllTransactions,
      limit
    );

  const refetchTransactions = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const memoizedCreateTransaction = useMemo(
    () => <CreateTransaction onSuccess={refetchTransactions} />,
    [refetchTransactions]
  );

  return (
    <>
      <section>
        <Box className="h-max">
          <div className="flex items-center justify-between gap-6 w-full sm:w-max">
            {memoizedCreateTransaction}
            <div className="hidden md:block">
              <DividerY />
            </div>
            <div className="">
              <ListTypeSelector />
            </div>
          </div>
          <div className="hidden items-center gap-6 divide-x-4 sm:flex">
            <div className="flex items-center gap-6">
              <Button
                className="border-2 border-black bg-transparent"
                variant={"outline"}
                onClick={goPrevious}
                disabled={!canPrevious}>
                <span>
                  <ArrowLeftIcon />
                </span>
                Previous
              </Button>
              <Button onClick={goNext} disabled={!canNext}>
                <span>
                  <ArrowRightIcon />
                </span>
                Next
              </Button>
            </div>
          </div>
        </Box>

        <div className="flex items-center gap-6 divide-x-4 sm:hidden py-4 ">
          <div className="flex items-center justify-between gap-6 w-full">
            <Button
              className="border-2 border-black bg-transparent"
              variant={"outline"}
              onClick={goPrevious}
              disabled={!canPrevious}>
              <span>
                <ArrowLeftIcon />
              </span>
              Previous
            </Button>
            <Button onClick={goNext} disabled={!canNext}>
              <span>
                <ArrowRightIcon />
              </span>
              Next
            </Button>
          </div>
        </div>
      </section>

      <section>
        <Suspense fallback={null}>
          <TransactionView
            data={data.transactions}
            isLoading={isLoading}
            initialLimit={limit}
            refetchTransactions={refetchTransactions}
          />
        </Suspense>
      </section>
    </>
  );
};
