"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { TransactionEditMode } from "./transaction-edit-mode";
import { RequestPayload, Transaction } from "@/lib/types";
import { useState } from "react";
import { useTransactionPageActions } from "@/lib/context/transaction-page-actions";
import { toast } from "sonner";

export const CreateTransaction = ({
  onSuccess,
}: {
  onSuccess: () => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const { createTransaction, deleteTransactionById } =
    useTransactionPageActions();

  const [isLoading, setIsLoading] = useState(false);

  const closeDialog = () => {
    if (isLoading) return;
    setOpen(false);
  };

  const onSubmit = async (payload: RequestPayload["PostTransaction"]) => {
    setIsLoading(true);

    const res = await createTransaction(payload);

    if (res.transaction_id) {
      toast("Transaction Created", {
        description: payload.portfolio,
        action: {
          label: "Undo",
          onClick: async () => {
            await deleteTransactionById(res.transaction_id);
          },
        },
      });
      await onSuccess();
      closeDialog();
    } else {
      toast("Failed to create transaction", {
        description: "Try again later",
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <Dialog open={open || isLoading} onOpenChange={closeDialog}>
        <Button
          className="w-max px-3 lg:px-9"
          size={"lg"}
          onClick={() => {
            setOpen(true);
          }}>
          <span>
            <PlusIcon />
          </span>
          <span>New</span>
          <span className="hidden md:block">Transaction</span>
        </Button>
        <DialogContent className="min-w-max">
          <TransactionEditMode
            isLoading={isLoading}
            isCreating
            transaction={{} as Transaction}
            handleCancelEdit={closeDialog}
            handleSave={(value) => {
              setOpen(true);
              onSubmit(value);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
