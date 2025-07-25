// Response Types

type GetTransactionsResponse = {
  last_evaluated_key: string;
  transactions: Transaction[];
};

type PostTransactionResponse = {
  transaction_id: string;
};

type GetInstrumentsResponse = {
  last_evaluated_key: string;
  instruments: Instrument[];
};

type GetTimeSeriesResponse = {
  ts: TimeSeriesPoint[];
  currency: string;
  from: string;
  to: string;
};

type GetAssetsResponse = {
  currency: string;
  name: string;
  absolute_value: number;
  quantity: number;
  percentage: number;
  children: HoldingNode[];
}[];

// Request Params Types

type GetTransactionsParams = {
  limit: string;
  last_evaluated_key: string;
};

type GetInstrumentsParams = {
  limit: string;
  last_evaluated_key: string;
};

type GetTransactionByIdParams = {
  transaction_id: string;
};

type GetInstrumentsByIdParams = {
  instrument_id: string;
};

type DeleteTransactionByIdParams = {
  transaction_id: PartialTransaction["id"];
};

// Request Payload Types

type PostTransactionPayload = PartialTransaction;

type PutTransactionPayload = PartialTransaction;

export type RequestParams = {
  GetTransactions: GetTransactionsParams;
  GetInstruments: GetInstrumentsParams;
  GetTransactionById: GetTransactionByIdParams;
  DeleteTransactionById: DeleteTransactionByIdParams;
  GetInstrumentsById: GetInstrumentsByIdParams;
};

export type RequestPayload = {
  PostTransaction: PostTransactionPayload;
  PutTransaction: PutTransactionPayload;
};

export type ResponseTypes = {
  GetTransactions: GetTransactionsResponse;
  PostTransaction: PostTransactionResponse;
  GetInstruments: GetInstrumentsResponse;
  GetTimeSeries: GetTimeSeriesResponse;
  GetAssets: GetAssetsResponse;
};

export type PartialTransaction = {
  id: string;
  portfolio_id: number;
  instrument_id: number;
  status: string;
  comments: string;
  quantity: number;
  price: number;
  transaction_costs: number;
  trade_date: string;
  fx_rate: string;
  settlement_date: string;
  transaction_type: string;
  sale_method: string;
  portfolio: string;
};

export type Transaction = PartialTransaction & {
  price_uses_market_data: number;
  total_amount: number;
};

export type Instrument = {
  id: number;
  name: string;
  isin: string;
  symbol: string;
  sector: string;
  handle: string;
  is_cash_flow_based: number;
  is_priced_by_custodian: number;
  industry: string;
  country: string;
  region: string;
  base_price: number;
  is_interest_bearing: number;
  is_derivative: number;
  currency_id: number;
};

export type TimeSeriesPoint = {
  date: string; // YYYY-DD-MM
  value: number;
  performanceValue: number;
  exposure: number;
  openValue: number;
  timeWeightedReturn: number;
  moneyWeightedReturn: number;
  adjustedBenchmarkValue: number;
  adjustedBenchmarkPerformanceValue: number;
  adjustedBenchmarkTimeWeightedReturn: number;
  adjustedBenchmarkMoneyWeightedReturn: number;
  adjustedBenchmarkReturn: number;
  return: number;
  averageCapitalBase: number;
  averageCapitalBaseInternalRateOfReturn: number;
  benchmarkAverageCapitalBaseInternalRateOfReturn: number;
};

export type HoldingNode = {
  name: string;
  currency: string;
  absolute_value: number;
  quantity: number;
  percentage: number;
  key?: string;
  fill?: string;
  children: HoldingNode[];
};

export type RawNode = {
  name: string;
  color: string;
  absolute_value?: number;
  children?: RawNode[];
};

export type SunburstNode = {
  name: string;
  color: string;
  size?: number;
  children?: SunburstNode[];
};
