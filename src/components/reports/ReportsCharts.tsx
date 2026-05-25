"use client";

import { MonthlyChartPoint, CategorySpendData } from "@/lib/types";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import SpendingPieChart from "@/components/charts/SpendingPieChart";
import CategoryBarChart from "@/components/charts/CategoryBarChart";
import { formatCurrency } from "@/lib/utils";

type Props = {
  monthly: MonthlyChartPoint[];
  categorySpend: CategorySpendData[];
  totalIncome: number;
  totalExpenses: number;
};

export default function ReportsCharts({ monthly, categorySpend, totalIncome, totalExpenses }: Props) {
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Income", value: formatCurrency(totalIncome), icon: "ri-arrow-up-circle-line", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
          { label: "Total Expenses", value: formatCurrency(totalExpenses), icon: "ri-arrow-down-circle-line", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/30" },
          { label: "Savings Rate", value: `${savingsRate.toFixed(1)}%`, icon: "ri-safe-2-line", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/30" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
            <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <i className={`${s.icon} ${s.color} text-xl`}></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Income vs Expenses</h3>
        <p className="text-xs text-slate-400 mb-5">Last 6 months comparison</p>
        <MonthlyBarChart data={monthly} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Spending by Category</h3>
          <p className="text-xs text-slate-400 mb-5">This month</p>
          {categorySpend.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No expense data yet</div>
          ) : (
            <SpendingPieChart data={categorySpend} total={totalExpenses} />
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Category Breakdown</h3>
          <p className="text-xs text-slate-400 mb-5">Top spending categories</p>
          {categorySpend.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No expense data yet</div>
          ) : (
            <CategoryBarChart data={categorySpend} />
          )}
        </div>
      </div>
    </div>
  );
}
