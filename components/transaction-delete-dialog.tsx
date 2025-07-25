"use client";

import { useTransactionPageActions } from "@/lib/context/transaction-page-actions";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useCallback, useState } from "react";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";

export const TransactionDeleteDialog = ({
  isOpen,
  handleClose,
  id,
  onDeleteSuccess,
}: {
  isOpen: boolean;
  handleClose: () => void;
  id: string | null;
  onDeleteSuccess: () => Promise<void>;
}) => {
  const { deleteTransactionById } = useTransactionPageActions();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);

    const res = await deleteTransactionById(id);

    if (res === "Transaction deleted") {
      toast(res);
      handleClose();
      await onDeleteSuccess();
    }

    setIsLoading(false);
  }, [deleteTransactionById, id, handleClose, onDeleteSuccess]);

  const closeDialog = useCallback(() => {
    if (isLoading) return;
    handleClose();
  }, [handleClose, isLoading]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeDialog}
      modal
      key={"delete-transaction-modal"}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Delete transaction?</DialogTitle>
        </DialogHeader>
        <DialogDescription>This action cannot be reversed.</DialogDescription>
        <DialogFooter className="pt-4 mt-4">
          <Button
            className="border-primary border-2"
            size={"lg"}
            variant={"outline"}
            type="button"
            disabled={isLoading}
            onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            size={"lg"}
            variant={"default"}
            disabled={isLoading}
            onClick={handleDelete}>
            {isLoading ? (
              <LoaderIcon className="animate-spin" width={14} height={14} />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
