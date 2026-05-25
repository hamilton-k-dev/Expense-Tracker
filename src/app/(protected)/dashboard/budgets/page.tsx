import { cookies } from "next/headers";
import { getBudgetsWithSpent } from "@/lib/actions/budgets";
import { getCategories } from "@/lib/actions/categories";
import { getTranslations, type Locale } from "@/lib/i18n";
import BudgetsClient from "@/components/budgets/BudgetsClient";

export default async function BudgetsPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [budgets, categories, cookieStore] = await Promise.all([
    getBudgetsWithSpent(month, year),
    getCategories(),
    cookies(),
  ]);

  const rawLang = cookieStore.get("lang")?.value;
  const locale: Locale = rawLang === "fr" ? "fr" : "en";
  const t = getTranslations(locale);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{t("budgets.title")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("budgets.subtitle")}</p>
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
