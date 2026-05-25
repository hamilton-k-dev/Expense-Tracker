import { getBudgetsWithSpent } from "@/lib/actions/budgets";
import { getCategories } from "@/lib/actions/categories";
import BudgetsClient from "@/components/budgets/BudgetsClient";

export default async function BudgetsPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [budgets, categories] = await Promise.all([
    getBudgetsWithSpent(month, year),
    getCategories(),
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Budgets</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Set and track your monthly spending limits
        </p>
      </div>
      <BudgetsClient
        budgets={budgets}
        categories={categories}
        month={month}
        year={year}
      />
    </div>
  );
}
