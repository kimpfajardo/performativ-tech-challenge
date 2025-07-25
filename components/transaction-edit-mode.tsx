"use client";

import { Instrument, Transaction } from "@/lib/types";
import { DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { CircleAlertIcon, LoaderIcon } from "lucide-react";
import { DatePicker } from "./date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ComponentProps, useEffect, useMemo, useState } from "react";
import { InstrumentCard } from "./instrument-card";
import { Button } from "./ui/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { formatDate, parse } from "date-fns";
import { Box } from "./box";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { cn, formatToUSD } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { InstrumentsTableContainer } from "./instruments-table-container";
import { useTransactionPageActions } from "@/lib/context/transaction-page-actions";
import _ from "lodash";
const schema = z
  .object({
    instrument_id: z.number({ error: "Invalid instrument" }),
    comments: z.string().optional(),
    quantity: z
      .number({ error: "Invalid amount" })
      .positive({ error: "Invalid amount" }),
    price: z
      .number({ error: "Invalid amount" })
      .positive({ error: "Invalid amount" }),
    transaction_costs: z.number({ error: "Invalid amount" }),
    trade_date: z.string({ error: "Invalid date" }),
    fx_rate: z.number({ error: "Invalid amount" }),
    transaction_type: z.string({ error: "Invalid type" }),
    portfolio: z.string({ error: "Invalid Portfolio" }),
    portfolio_id: z
      .number({ error: "Invalid ID" })
      .positive({ error: "Invalid ID" }),
    status: z.string({ error: "Invalid status" }),
    settlement_date: z.string({ error: "Invalid date" }),
    sale_method: z.string({ error: "Invalid method" }),
  })
  .superRefine((data, ctx) => {
    if (data.status === "SETTLED" && !data.settlement_date) {
      ctx.addIssue({
        path: ["settlement_date"],
        code: z.ZodIssueCode.custom,
        message: "Invalid date",
      });
    }
  });

type EditTransactionSchema = z.infer<typeof schema>;

export const CommonInputField = ({
  className,
  inputProps,
  label,
  error = "",
}: {
  className?: string;
  inputProps?: ComponentProps<"input">;
  label?: string;
  error?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={inputProps?.id}>{label}</Label>
      <div>
        <Input autoFocus={false} {...inputProps} />
        {error && <span className="ml-2 text-xs text-red-500">{error}</span>}
      </div>
    </div>
  );
};

export const TransactionEditMode = ({
  transaction,
  handleCancelEdit,
  handleSave,
  isCreating = false,
  isLoading,
}: {
  transaction: Transaction;
  handleCancelEdit: VoidFunction;
  handleSave: (value: Transaction) => void;
  isCreating?: boolean;
  isLoading: boolean;
}) => {
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);

  const [isFetchingCurrentInstrument, setIsFetchingCurrentInstrument] =
    useState(transaction.instrument_id ? true : false);

  const { getInstrumentById } = useTransactionPageActions();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    resetField,
  } = useForm<EditTransactionSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...transaction,
      fx_rate: +transaction.fx_rate,
    },
  });

  const qty = watch("quantity");
  const price = watch("price");
  const status = watch("status");

  const onSubmit: SubmitHandler<EditTransactionSchema> = (data) => {
    const newData = {
      ...transaction,
      ...{
        ...data,
        settlement_date: data.status === "SETTLED" ? data.settlement_date : "",
        fx_rate: `${data.fx_rate}`,
      },
    };

    const noDifference = _.isEqual(newData, transaction);

    if (noDifference) {
      handleCancelEdit();
      return;
    }

    handleSave(newData);
  };

  const Table = useMemo(() => {
    if (isFetchingCurrentInstrument) {
      return (
        <div className="h-[150px] w-full flex justify-center items-center">
          <LoaderIcon className="animate-spin" width={24} height={24} />
        </div>
      );
    }
    return (
      <InstrumentsTableContainer
        onSelect={(instrument) => {
          setSelectedInstrument(instrument);
          setValue("instrument_id", instrument.id, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
      />
    );
  }, [setValue, isFetchingCurrentInstrument]);

  useEffect(() => {
    const fetchInstrument = async () => {
      if (!transaction) {
        setIsFetchingCurrentInstrument(false);
        return;
      }
      const result = await getInstrumentById(transaction.instrument_id);
      if (result.id) {
        setSelectedInstrument(result);
        setValue("instrument_id", result.id);
      }
      setIsFetchingCurrentInstrument(false);
    };
    fetchInstrument();
  }, [getInstrumentById, transaction, setValue]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isCreating ? "Create" : "Edit"} Transaction</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} autoFocus={false}>
        <fieldset disabled={isLoading}>
          <div className="flex flex-col gap-4">
            <Box className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <CommonInputField
                  className="flex-2"
                  inputProps={{ ...register("portfolio") }}
                  label="Portfolio"
                  error={errors.portfolio?.message}
                />
                <CommonInputField
                  inputProps={{
                    ...register("portfolio_id", { valueAsNumber: true }),
                    type: "number",
                    step: 1,
                    min: 0,
                  }}
                  label="ID"
                  error={errors.portfolio_id?.message}
                />
              </div>

              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="trade_date">Trade date</Label>
                  <div className="flex flex-col gap-1">
                    <DatePicker
                      initialValue={
                        transaction?.trade_date
                          ? parse(
                              transaction?.trade_date,
                              "yyyy-MM-dd",
                              new Date()
                            )
                          : undefined
                      }
                      id="trade_date"
                      onValueChange={(date) => {
                        setValue("trade_date", formatDate(date, "yyyy-MM-dd"), {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    />
                    {errors.trade_date?.message && (
                      <span className="ml-2 text-xs text-red-500">
                        {errors.trade_date?.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col w-full gap-2">
                  <Label htmlFor="status">Status</Label>
                  <div>
                    <Select
                      defaultValue={transaction?.status}
                      onValueChange={(value: string) => {
                        setValue("status", value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Pick status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SETTLED">Settled</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status?.message && (
                      <span className="ml-2 text-xs text-red-500">
                        {errors.status?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  {status === "SETTLED" && (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="settlement_date">Settlement date</Label>
                      <div className="flex flex-col gap-1">
                        <DatePicker
                          initialValue={
                            transaction.settlement_date
                              ? parse(
                                  transaction.settlement_date,
                                  "yyyy-MM-dd",
                                  new Date()
                                )
                              : undefined
                          }
                          id="settlement_date"
                          onValueChange={(date) => {
                            setValue(
                              "settlement_date",
                              formatDate(date, "yyyy-MM-dd"),
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                              }
                            );
                          }}
                        />
                        {errors.settlement_date?.message && (
                          <span className="ml-2 text-xs text-red-500">
                            {errors.settlement_date?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Box>
            <div className="flex flex-col gap-1">
              <h6 className="font-bold">Instrument</h6>
              <div className="flex flex-col gap-1 overflow-x-scroll">
                {errors.instrument_id?.message && (
                  <Alert className="border border-red-500">
                    <CircleAlertIcon color="#fb2c36" />
                    <AlertTitle className="text-red-500">
                      You have not selected any instruments
                    </AlertTitle>
                    <AlertDescription className="text-xs text-slate-400">
                      <p>Select one to proceed</p>
                    </AlertDescription>
                  </Alert>
                )}
                {selectedInstrument && (
                  <InstrumentCard
                    instrument={selectedInstrument}
                    onRemoveInstrument={() => {
                      setSelectedInstrument(null);
                      resetField("instrument_id");
                    }}
                  />
                )}
                <div className="w-full overflow-x-scroll">
                  <div className="">{!selectedInstrument && Table}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h6 className="font-bold">Fees</h6>
              <Box>
                <div className="flex flex-col w-full gap-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <CommonInputField
                      inputProps={{
                        type: "number",
                        min: 0,
                        step: "any",
                        ...register("price", {
                          valueAsNumber: true,
                        }),
                      }}
                      label="Price"
                      error={errors.price?.message}
                    />
                    <CommonInputField
                      inputProps={{
                        type: "number",
                        min: 0,
                        step: "any",
                        ...register("quantity", { valueAsNumber: true }),
                      }}
                      label="Quantity"
                      error={errors.quantity?.message}
                    />
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="sale_method">Sale Method</Label>
                      <div>
                        <Select
                          onValueChange={(value) => {
                            setValue("sale_method", value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                          defaultValue={transaction?.transaction_type}>
                          <SelectTrigger id="sale_method">
                            <SelectValue placeholder="Pick one" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FILO">FILO</SelectItem>
                            <SelectItem value="LIFO">LIFO</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.sale_method?.message && (
                          <span className="ml-2 text-xs text-red-500">
                            {errors.sale_method?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex flex-col gap-2 shrink-0">
                      <Label htmlFor="transaction_type">Transaction Type</Label>
                      <div>
                        <Select
                          onValueChange={(value) => {
                            setValue("transaction_type", value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                          defaultValue={transaction?.transaction_type}>
                          <SelectTrigger
                            className="w-full"
                            id="transaction_type">
                            <SelectValue placeholder="Pick one" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BUY">Buy</SelectItem>
                            <SelectItem value="SELL">
                              Cash Commitment
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.transaction_type?.message && (
                          <span className="ml-2 text-xs text-red-500">
                            {errors.transaction_type?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <CommonInputField
                      inputProps={{
                        type: "number",
                        min: 0,
                        step: "any",
                        ...register("transaction_costs", {
                          valueAsNumber: true,
                        }),
                      }}
                      label="Transaction Costs"
                      error={errors.transaction_costs?.message}
                    />
                    <CommonInputField
                      inputProps={{
                        ...register("fx_rate", { valueAsNumber: true }),
                        type: "number",
                        step: "any",
                      }}
                      label="Fx Rate"
                      error={errors.fx_rate?.message}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      {...register("comments")}
                      placeholder="Type comments here..."
                      className="bg-white border border-slate-400"
                    />
                  </div>
                </div>
              </Box>
              <div>
                <span className="text-lg font-bold">Total</span>
                <p className="text-3xl font-black">
                  USD{" "}
                  {formatToUSD(price * qty) === "NaN"
                    ? "0"
                    : formatToUSD(price * qty)}
                </p>
              </div>
            </div>
          </div>
        </fieldset>
        <DialogFooter className="pt-4 mt-4 border-t-2">
          <Button
            className="border-2 border-primary"
            size={"lg"}
            variant={"outline"}
            type="button"
            onClick={handleCancelEdit}
            disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size={"lg"}
            variant={"default"}
            type="submit"
            disabled={isLoading}>
            {isLoading ? (
              <LoaderIcon className="animate-spin" width={14} height={14} />
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
