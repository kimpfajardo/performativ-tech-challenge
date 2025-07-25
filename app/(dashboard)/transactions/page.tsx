import { PageTitle } from "@/components/page-title";
import {
  createTransaction,
  getAllInstruments,
  getAllTransactions,
  deleteTransactionById,
  updateTransactionById,
  getInstrumentById,
} from "@/lib/actions/transaction";
import { redirect } from "next/navigation";
import { ViewTypeProvider } from "@/lib/context/view-context";
import { Transactions } from "@/components/transactions";
import { TransactionPageInitializer } from "@/lib/context/transaction-page-initializer";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ limit: string; viewType: string }>;
}) {
  const searchParamList = await searchParams;
  const limit = searchParamList.limit;
  const params = new URLSearchParams();

  const missingParams = [];

  if (!limit) {
    missingParams.push(["limit", "5"]);
  }

  if (missingParams.length > 0) {
    missingParams.forEach(([key, value]) => {
      params.set(key, value);
    });
    return redirect(`/transactions?${params.toString()}`);
  }

  const transactionData = await getAllTransactions(+limit);

  const instrumentsData = await getAllInstruments(5);

  return (
    <ViewTypeProvider>
      <TransactionPageInitializer
        transactions={transactionData}
        instruments={instrumentsData}
        queryFn={{ getAllTransactions, getAllInstruments, getInstrumentById }}
        mutationFn={{
          createTransaction,
          deleteTransactionById,
          updateTransactionById,
        }}>
        <div className="p-4 lg:p-6 space-y-3 lg:space-y-6">
          <PageTitle
            title="Transactions"
            description="Our complete transaction history, simplified"
          />
          <Transactions />
        </div>
      </TransactionPageInitializer>
    </ViewTypeProvider>
  );
}
