import { ResponseTypes } from "../types";
import { InitialInstrumentsProvider } from "./initial-instruments-context";
import { InitialTransactionsProvider } from "./initial-transactions-context";
import { MutationActions, QueryActions, TransactionPageActionsProvider } from "./transaction-page-actions";

type TransactionData = ResponseTypes["GetTransactions"];
type InstrumentData = ResponseTypes["GetInstruments"];

type FetchFn<T> = (limit?: number, lastKey?: string) => Promise<T>;

export const TransactionPageInitializer = ({
  children,
  transactions,
  instruments,
  queryFn,
  mutationFn
}: {
  children: React.ReactNode;
  transactions: TransactionData;
  instruments: InstrumentData;
  queryFn: QueryActions
  mutationFn: MutationActions
}) => {
  return (
    <TransactionPageActionsProvider queryFn={queryFn} mutationFn={mutationFn}>
      <InitialTransactionsProvider transactions={transactions}>
        <InitialInstrumentsProvider instruments={instruments}>
          {children}
        </InitialInstrumentsProvider>
      </InitialTransactionsProvider>
    </TransactionPageActionsProvider>
  );
};
