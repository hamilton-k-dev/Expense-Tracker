import { getTransactions } from "@/lib/actions/transactions";
import { getCategories } from "@/lib/actions/categories";
import TransactionsClient from "@/components/transactions/TransactionsClient";

export default async function TransactionsPage() {
  const [transactions, categories] = await Promise.all([getTransactions(), getCategories()]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Transactions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} total
        </p>
      </div>
      <TransactionsClient transactions={transactions} categories={categories} />
    </div>
  );
}
