import { headers, cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ensureDefaultCategories } from "@/lib/actions/categories";
import { getSettings } from "@/lib/actions/settings";
import { getLast6Months, startOfMonth, endOfMonth, formatCurrency } from "@/lib/utils";
import { getTranslations, type Locale } from "@/lib/i18n";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import ExpensePieChart from "@/components/charts/ExpensePieChart";
import TransactionRow from "@/components/ui/TransactionRow";
import StatCard from "@/components/ui/StatCard";
import DashboardQuickAdd from "@/components/dashboard/DashboardQuickAdd";
import { MonthlyChartPoint, CategorySpendData } from "@/lib/types";

async function getDashboardData(userId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  await ensureDefaultCategories(userId);

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
      prisma.category.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
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
  const [session, cookieStore] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    cookies(),
  ]);
  const userId = session!.user.id;
  const name = session!.user.name ?? "there";

  const rawLang = cookieStore.get("lang")?.value;
  const locale: Locale = rawLang === "fr" ? "fr" : "en";
  const t = getTranslations(locale);

  const [{ totalIncome, totalExpenses, balance, savings, monthly, categorySpend, recentTx, categories }, settings] =
    await Promise.all([getDashboardData(userId), getSettings()]);

  const fmt = (n: number) => formatCurrency(n, settings.currency, locale);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{t("dashboard.title")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("dashboard.welcome", { name })}
          </p>
        </div>
        <DashboardQuickAdd categories={categories} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title={t("dashboard.total_balance")} value={fmt(balance)} icon="ri-bank-card-line" iconBg="bg-blue-50 dark:bg-blue-900/30" iconColor="text-blue-600" />
        <StatCard title={t("dashboard.total_income")} value={fmt(totalIncome)} icon="ri-arrow-up-circle-line" iconBg="bg-emerald-50 dark:bg-emerald-900/30" iconColor="text-emerald-600" />
        <StatCard title={t("dashboard.total_expenses")} value={fmt(totalExpenses)} icon="ri-arrow-down-circle-line" iconBg="bg-red-50 dark:bg-red-900/30" iconColor="text-red-500" />
        <StatCard title={t("dashboard.month_net")} value={fmt(savings)} icon="ri-safe-2-line" iconBg="bg-purple-50 dark:bg-purple-900/30" iconColor="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">{t("reports.income_vs_expenses")}</h3>
          <p className="text-xs text-slate-400 mb-5">{t("reports.last_6_months")}</p>
          <IncomeExpenseChart data={monthly} />
        </div>
        <ExpensePieChart data={categorySpend} />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">{t("dashboard.recent_transactions")}</h3>
          <a href="/dashboard/transactions" className="text-xs text-blue-600 hover:text-blue-700 font-medium">{t("dashboard.view_all")}</a>
        </div>
        {recentTx.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-3">
              <i className="ri-exchange-line text-slate-400 text-xl"></i>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard.no_transactions")}</p>
          </div>
        ) : (
          <div>
            {recentTx.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
