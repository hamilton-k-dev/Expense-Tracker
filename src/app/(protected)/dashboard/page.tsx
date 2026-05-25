import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCategories } from "@/lib/actions/categories";
import { getLast6Months, startOfMonth, endOfMonth, formatCurrency } from "@/lib/utils";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import ExpensePieChart from "@/components/charts/ExpensePieChart";
import TransactionRow from "@/components/ui/TransactionRow";
import StatCard from "@/components/ui/StatCard";
import TransactionModal from "@/components/transactions/TransactionModal";
import DashboardQuickAdd from "@/components/dashboard/DashboardQuickAdd";
import { MonthlyChartPoint, CategorySpendData } from "@/lib/types";

async function getDashboardData(userId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [allIncome, allExpenses, monthlyIncome, monthlyExpenses, recentTx, categories] =
    await Promise.all([
      prisma.transaction.aggregate({ where: { userId, type: "income" }, _sum: { amount: true } }),
      prisma.transaction.aggregate({ where: { userId, type: "expense" }, _sum: { amount: true } }),
      prisma.transaction.aggregate({ where: { userId, type: "income", date: { gte: monthStart, lt: monthEnd } }, _sum: { amount: true } }),
      prisma.transaction.aggregate({ where: { userId, type: "expense", date: { gte: monthStart, lt: monthEnd } }, _sum: { amount: true } }),
      prisma.transaction.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { date: "desc" },
        take: 5,
      }),
      prisma.category.findMany({ where: { userId } }),
    ]);

  const months = getLast6Months();
  const monthly: MonthlyChartPoint[] = await Promise.all(
    months.map(async ({ month, year, label }) => {
      const s = startOfMonth(month, year);
      const e = endOfMonth(month, year);
      const [inc, exp] = await Promise.all([
        prisma.transaction.aggregate({ where: { userId, type: "income", date: { gte: s, lt: e } }, _sum: { amount: true } }),
        prisma.transaction.aggregate({ where: { userId, type: "expense", date: { gte: s, lt: e } }, _sum: { amount: true } }),
      ]);
      return { month: label, income: inc._sum.amount ?? 0, expenses: exp._sum.amount ?? 0 };
    })
  );

  const catRows = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: "expense", date: { gte: monthStart, lt: monthEnd } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  const categorySpend: CategorySpendData[] = catRows.map((r) => {
    const cat = categories.find((c) => c.id === r.categoryId);
    return {
      name: cat?.name ?? "Other",
      amount: r._sum.amount ?? 0,
      color: cat?.color ?? "#94a3b8",
      bgColor: cat?.bgColor ?? "#f8fafc",
      icon: cat?.icon ?? "ri-price-tag-3-line",
      categoryId: r.categoryId,
    };
  });

  const totalIncome = allIncome._sum.amount ?? 0;
  const totalExpenses = allExpenses._sum.amount ?? 0;
  const monthIncome = monthlyIncome._sum.amount ?? 0;
  const monthExpenses = monthlyExpenses._sum.amount ?? 0;

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    savings: monthIncome - monthExpenses,
    monthly,
    categorySpend,
    recentTx: recentTx.map((t) => ({
      ...t,
      date: t.date.toISOString().split("T")[0],
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })),
    categories,
  };
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;
  const name = session!.user.name ?? "there";

  const { totalIncome, totalExpenses, balance, savings, monthly, categorySpend, recentTx, categories } =
    await getDashboardData(userId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {name}! Here&apos;s your financial overview.
          </p>
        </div>
        <DashboardQuickAdd categories={categories} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(balance)}
          icon="ri-bank-card-line"
          iconBg="bg-blue-50 dark:bg-blue-900/30"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon="ri-arrow-up-circle-line"
          iconBg="bg-emerald-50 dark:bg-emerald-900/30"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon="ri-arrow-down-circle-line"
          iconBg="bg-red-50 dark:bg-red-900/30"
          iconColor="text-red-500"
        />
        <StatCard
          title="This Month Net"
          value={formatCurrency(savings)}
          icon="ri-safe-2-line"
          iconBg="bg-purple-50 dark:bg-purple-900/30"
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Income vs Expenses</h3>
          <p className="text-xs text-slate-400 mb-5">Last 6 months</p>
          <IncomeExpenseChart data={monthly} />
        </div>
        <ExpensePieChart data={categorySpend} />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
          <a href="/dashboard/transactions" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</a>
        </div>
        {recentTx.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-3">
              <i className="ri-exchange-line text-slate-400 text-xl"></i>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">No transactions yet</p>
          </div>
        ) : (
          <div>
            {recentTx.map((t) => (
              <TransactionRow key={t.id} transaction={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
