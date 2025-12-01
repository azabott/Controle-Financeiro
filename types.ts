export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface ChartDataPoint {
  date: string;
  income: number;
  expense: number;
}

export type DateFilterType = 'current_month' | 'last_30_days' | 'current_year' | 'custom';

export interface User {
  name: string;
  email: string;
  password?: string;
}