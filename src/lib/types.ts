export type TransactionType = "income" | "expense";

export interface CategoryData {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  isDefault: boolean;
}

export interface TransactionData {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO date string YYYY-MM-DD
  notes: string | null;
  categoryId: string;
  category: CategoryData;
}

export interface BudgetData {
  id: string;
  categoryId: string;
  category: CategoryData;
  amount: number;
  month: number;
  year: number;
  spent: number; // computed from transactions
}

export interface UserSettingsData {
  currency: string;
  phone: string | null;
  bio: string | null;
  budgetAlerts: boolean;
  weeklyReport: boolean;
  emailDigest: boolean;
  pushNotifs: boolean;
}

export interface MonthlyChartPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface CategorySpendData {
  name: string;
  amount: number;
  color: string;
  bgColor: string;
  icon: string;
  categoryId: string;
}
