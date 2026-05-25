import { cookies } from "next/headers";
import { getTransactions } from "@/lib/actions/transactions";
import { getCategories } from "@/lib/actions/categories";
import { getTranslations, type Locale } from "@/lib/i18n";
import TransactionsClient from "@/components/transactions/TransactionsClient";

export default async function TransactionsPage() {
  const [transactions, categories, cookieStore] = await Promise.all([
    getTransactions(),
    getCategories(),
    cookies(),
  ]);

  const rawLang = cookieStore.get("lang")?.value;
  const locale: Locale = rawLang === "fr" ? "fr" : "en";
  const t = getTranslations(locale);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{t("transactions.title")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {transactions.length} {t("transactions.title").toLowerCase()} total
        </p>
      </div>
      <TransactionsClient transactions={transactions} categories={categories} />
    </div>
  );
}
