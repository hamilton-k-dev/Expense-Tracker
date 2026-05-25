"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TransactionData, CategoryData } from "@/lib/types";
import { deleteTransaction } from "@/lib/actions/transactions";
import TransactionModal from "./TransactionModal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

type Props = {
  transactions: TransactionData[];
  categories: CategoryData[];
};

export default function TransactionsClient({ transactions, categories }: Props) {
  const { currency, t } = useUserPreferences();
  const fmt = (n: number) => formatCurrency(n, currency);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TransactionData | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = transactions.filter((tx) => {
    if (typeFilter !== "all" && tx.type !== typeFilter) return false;
    if (categoryFilter !== "all" && tx.categoryId !== categoryFilter) return false;
    if (search && !tx.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteTransaction(id);
    toast.success(t("toasts.transaction_deleted"));
    setDeletingId(null);
  };

  const openEdit = (tx: TransactionData) => {
    setEditing(tx);
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
            placeholder={t("transactions.search")}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-blue-400 text-slate-800 dark:text-white transition-colors"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "all" | "income" | "expense")}
          className="px-3 py-2.5 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-blue-400 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <option value="all">{t("transactions.all_types")}</option>
          <option value="income">{t("transactions.income")}</option>
          <option value="expense">{t("transactions.expense")}</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:border-blue-400 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <option value="all">{t("transactions.all_categories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
        >
          <i className="ri-add-line text-base"></i>
          <span>{t("transactions.add")}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
              <i className="ri-exchange-line text-slate-400 text-2xl"></i>
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("transactions.none_found")}</p>
            <p className="text-xs text-slate-400 mt-1">{t("transactions.none_hint")}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {filtered.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: tx.category.bgColor }}
                >
                  <i className={`${tx.category.icon} text-base`} style={{ color: tx.category.color }}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{tx.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{tx.category.name} · {formatDate(tx.date)}</p>
                </div>
                {tx.notes && (
                  <div className="hidden md:block max-w-45">
                    <p className="text-xs text-slate-400 truncate">{tx.notes}</p>
                  </div>
                )}
                <span className={`text-sm font-bold shrink-0 ${tx.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                  {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => openEdit(tx)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <i className="ri-edit-line text-sm"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    disabled={deletingId === tx.id}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    <i className={`${deletingId === tx.id ? "ri-loader-4-line animate-spin" : "ri-delete-bin-line"} text-sm`}></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-slate-400">
        {filtered.length} {t("common.of")} {transactions.length} {t("nav.transactions").toLowerCase()}
      </div>

      {showModal && (
        <TransactionModal onClose={closeModal} initial={editing} categories={categories} />
      )}
    </>
  );
}
