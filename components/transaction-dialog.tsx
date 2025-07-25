import { Transaction } from "@/lib/types";
import { Dialog, DialogContent } from "./ui/dialog";
import { useState } from "react";
import { TransactionViewMode } from "./transaction-view-mode";
import { TransactionEditMode } from "./transaction-edit-mode";
import { useTransactionPageActions } from "@/lib/context/transaction-page-actions";
import { toast } from "sonner";

export const TransactionDialog = ({
  handleClearSelectedTransaction,
  handleSelectTransaction,
  selectedTransaction,
  handleOpenDeleteModal,
  refetchTransactions,
}: {
  handleClearSelectedTransaction: VoidFunction;
  handleSelectTransaction: (value: Transaction) => void;
  selectedTransaction: Transaction | null;
  handleOpenDeleteModal: (id: string) => void;
  refetchTransactions: () => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateTransactionById } = useTransactionPageActions();

  const saveUpdatedTransaction = async (value: Transaction) => {
    setIsLoading(true);
 
    try {
      const res = await updateTransactionById({
        ...value,
        id: selectedTransaction?.id ?? "",
        total_amount: value.price * value.quantity
      });

      handleSelectTransaction(value);
      if (res === "Transaction updated") {
        await refetchTransactions();
        toast(res);
      }

      setIsEditing(false);
    } catch {
      toast("Failed to update transaction", {
        description: "Try again later",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog
      open={!!selectedTransaction}
      onOpenChange={() => {
        if (isEditing) return;
        handleClearSelectedTransaction();
      }}>
      <DialogContent
        className="max-w-full sm:max-w-[850px]"
        autoFocus={false}
        showCloseButton={!isEditing}>
        {isEditing && (
          <>
            <TransactionEditMode
              isLoading={isLoading}
              handleSave={saveUpdatedTransaction}
              transaction={selectedTransaction!}
              handleCancelEdit={() => {
                setIsEditing(false);
              }}
            />
          </>
        )}
        {!isEditing && (
          <TransactionViewMode
            transaction={selectedTransaction}
            handleEditMode={() => {
              setIsEditing(true);
            }}
            handleOpenDeleteModal={handleOpenDeleteModal}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
