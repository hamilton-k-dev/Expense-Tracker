import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLast6Months, startOfMonth, endOfMonth } from "@/lib/utils";
import { MonthlyChartPoint, CategorySpendData } from "@/lib/types";
import ReportsCharts from "@/components/reports/ReportsCharts";

async function getReportsData(userId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const months = getLast6Months();
  const [categories, monthly6m] = await Promise.all([
    prisma.category.findMany({ where: { userId } }),
    Promise.all(
      months.map(async ({ month, year, label }) => {
        const s = startOfMonth(month, year);
        const e = endOfMonth(month, year);
        const [inc, exp] = await Promise.all([
          prisma.transaction.aggregate({ where: { userId, type: "income", date: { gte: s, lt: e } }, _sum: { amount: true } }),
          prisma.transaction.aggregate({ where: { userId, type: "expense", date: { gte: s, lt: e } }, _sum: { amount: true } }),
        ]);
        return { month: label, income: inc._sum.amount ?? 0, expenses: exp._sum.amount ?? 0 };
      })
    ),
  ]);

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

  const totalIncome = monthly6m.reduce((s, m) => s + m.income, 0);
  const totalExpenses = monthly6m.reduce((s, m) => s + m.expenses, 0);

  return { monthly: monthly6m as MonthlyChartPoint[], categorySpend, totalIncome, totalExpenses };
}

export default async function ReportsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;
  const { monthly, categorySpend, totalIncome, totalExpenses } = await getReportsData(userId);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Reports</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Visualise your financial trends over the last 6 months
        </p>
      </div>
      <ReportsCharts
        monthly={monthly}
        categorySpend={categorySpend}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />
    </div>
  );
}
