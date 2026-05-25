import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const name = session?.user?.name ?? "there";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Welcome back, {name}! Here&apos;s your financial overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Balance", value: "$0.00", icon: "ri-bank-card-line", bg: "bg-blue-50 dark:bg-blue-900/30", color: "text-blue-600" },
          { label: "Total Income", value: "$0.00", icon: "ri-arrow-up-circle-line", bg: "bg-emerald-50 dark:bg-emerald-900/30", color: "text-emerald-600" },
          { label: "Total Expenses", value: "$0.00", icon: "ri-arrow-down-circle-line", bg: "bg-red-50 dark:bg-red-900/30", color: "text-red-500" },
          { label: "Savings", value: "$0.00", icon: "ri-safe-2-line", bg: "bg-purple-50 dark:bg-purple-900/30", color: "text-purple-600" },
        ].map((card) => (
          <div key={card.label} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</span>
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                <i className={`${card.icon} ${card.color} text-xl`}></i>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 text-center">
        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="ri-add-circle-line text-blue-600 text-2xl"></i>
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-1">No transactions yet</h3>
        <p className="text-sm text-slate-400">Add your first transaction to start tracking your finances.</p>
      </div>
    </div>
  );
}
