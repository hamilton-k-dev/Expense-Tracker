"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TransactionData, CategoryData } from "@/lib/types";
import { deleteTransaction } from "@/lib/actions/transactions";
import TransactionModal from "./TransactionModal";
import { formatCurrency, formatDate } from "@/lib/utils";

type Props = {
  transactions: TransactionData[];
  categories: CategoryData[];
};

export default function TransactionsClient({ transactions, categories }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TransactionData | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = transactions.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (categoryFilter !== "all" && t.categoryId !== categoryFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteTransaction(id);
    toast.success("Transaction deleted");
    setDeletingId(null);
  };

  const openEdit = (t: TransactionData) => {
    setEditing(t);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <i className="ri-search-line text-sm"></i>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-blue-400 text-slate-800 dark:text-white transition-colors"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "all" | "income" | "expense")}
          className="px-3 py-2.5 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-blue-400 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-blue-400 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0"
        >
          <i className="ri-add-line text-base"></i>
          <span>Add Transaction</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
              <i className="ri-exchange-line text-slate-400 text-2xl"></i>
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No transactions found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or add a new transaction.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: t.category.bgColor }}
                >
                  <i className={`${t.category.icon} text-base`} style={{ color: t.category.color }}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{t.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.category.name} · {formatDate(t.date)}</p>
                </div>
                {t.notes && (
                  <div className="hidden md:block max-w-[180px]">
                    <p className="text-xs text-slate-400 truncate">{t.notes}</p>
                  </div>
                )}
                <span className={`text-sm font-bold flex-shrink-0 ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => openEdit(t)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <i className="ri-edit-line text-sm"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    <i className={`${deletingId === t.id ? "ri-loader-4-line animate-spin" : "ri-delete-bin-line"} text-sm`}></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-slate-400">
        {filtered.length} of {transactions.length} transactions
      </div>

      {showModal && (
        <TransactionModal
          onClose={closeModal}
          initial={editing}
          categories={categories}
        />
      )}
    </>
  );
}
