"use client";

import { useViewType } from "@/lib/context/view-context";
import { TransactionGrid } from "./transaction-grid";
import { TransactionsTable } from "./transaction-table";
import { useMemo, useState } from "react";
import { ResponseTypes, Transaction } from "@/lib/types";
import { TransactionDialog } from "./transaction-dialog";
import { TransactionDeleteDialog } from "./transaction-delete-dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TableLimitFilter } from "./table-limit-filter";

export const TransactionView = ({
  data,
  isLoading,
  initialLimit,
  refetchTransactions,
}: {
  data: ResponseTypes["GetTransactions"]["transactions"];
  isLoading: boolean;
  initialLimit: number;
  refetchTransactions: () => Promise<void>;
}) => {
  const transactions = data;

  const { viewType } = useViewType();

  const [limit, setLimit] = useState(initialLimit + "");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState<
    string | null
  >(null);

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleClearSelectedTransaction = () => {
    setSelectedTransaction(null);
  };

  const handleOpenDeleteModal = (id: string) => {
    setTransactionIdToDelete(id);
  };

  const renderTransactions = useMemo(() => {
    const isGrid = viewType === "grid";

    if (isGrid) {
      return (
        <TransactionGrid
          isLoading={isLoading}
          data={transactions}
          onSelectTransaction={handleSelectTransaction}
          handleOpenDeleteModal={handleOpenDeleteModal}
        />
      );
    }
    return (
      <TransactionsTable
        isLoading={isLoading}
        data={transactions}
        onSelectTransaction={handleSelectTransaction}
        handleOpenDeleteModal={handleOpenDeleteModal}
      />
    );
  }, [viewType, transactions, isLoading]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(newLimit));

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <TransactionDialog
        handleClearSelectedTransaction={handleClearSelectedTransaction}
        selectedTransaction={selectedTransaction}
        handleSelectTransaction={handleSelectTransaction}
        handleOpenDeleteModal={handleOpenDeleteModal}
        refetchTransactions={refetchTransactions}
      />
      <TransactionDeleteDialog
        isOpen={!!transactionIdToDelete}
        id={transactionIdToDelete}
        handleClose={() => setTransactionIdToDelete(null)}
        onDeleteSuccess={refetchTransactions}
      />

      {renderTransactions}
      <div className="flex justify-center mt-10">
        <TableLimitFilter
          limit={limit}
          onChange={(val) => {
            setLimit(val);
            onLimitChange(+val);
          }}
        />
      </div>
    </>
  );
};
