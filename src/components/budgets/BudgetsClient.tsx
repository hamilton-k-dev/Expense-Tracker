"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BudgetData, CategoryData } from "@/lib/types";
import { deleteBudget } from "@/lib/actions/budgets";
import BudgetModal from "./BudgetModal";
import { formatCurrency } from "@/lib/utils";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

type Props = {
  budgets: BudgetData[];
  categories: CategoryData[];
  month: number;
  year: number;
};

export default function BudgetsClient({ budgets, categories, month, year }: Props) {
  const { currency, language, t } = useUserPreferences();
  const fmt = (n: number) => formatCurrency(n, currency, language);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BudgetData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteBudget(id);
    toast.success(t("toasts.budget_removed"));
    setDeletingId(null);
  };

  const openEdit = (b: BudgetData) => {
    setEditing(b);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 shadow-sm border border-slate-100 dark:border-slate-700 text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            {new Date(year, month - 1).toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <span className="mx-2 text-slate-300 dark:text-slate-600">·</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {fmt(totalSpent)} / {fmt(totalBudget)} {t("budgets.spent")}
          </span>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors sm:w-auto w-full"
        >
          <i className="ri-add-line text-base"></i>
          {t("budgets.set")}
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 py-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
            <i className="ri-wallet-3-line text-slate-400 text-2xl"></i>
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("budgets.none")}</p>
          <p className="text-xs text-slate-400 mt-1">{t("budgets.none_hint")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const pct = b.amount > 0 ? Math.min((b.spent / b.amount) * 100, 100) : 0;
            const over = b.spent > b.amount;
            const near = !over && pct >= 80;
            const barColor = over ? "bg-red-500" : near ? "bg-amber-500" : "bg-emerald-500";

            return (
              <div key={b.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: b.category.bgColor }}>
                      <i className={`${b.category.icon} text-base`} style={{ color: b.category.color }}></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{b.category.name}</p>
                      <p className="text-xs text-slate-400">{fmt(b.spent)} {t("common.of")} {fmt(b.amount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(b)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <i className="ri-edit-line text-sm"></i>
                    </button>
                    <button onClick={() => handleDelete(b.id)} disabled={deletingId === b.id} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
                      <i className={`${deletingId === b.id ? "ri-loader-4-line animate-spin" : "ri-delete-bin-line"} text-sm`}></i>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{pct.toFixed(0)}{t("budgets.used")}</span>
                    <span className={`font-semibold ${over ? "text-red-500" : near ? "text-amber-500" : "text-emerald-600"}`}>
                      {over
                        ? `${fmt(b.spent - b.amount)} ${t("budgets.over")}`
                        : `${fmt(b.amount - b.spent)} ${t("budgets.left")}`}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {over && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-red-500">
                    <i className="ri-alarm-warning-line"></i>
                    {t("budgets.exceeded")}
                  </div>
                )}
                {near && !over && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-500">
                    <i className="ri-error-warning-line"></i>
                    {t("budgets.approaching")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <BudgetModal onClose={closeModal} categories={categories} initial={editing} month={month} year={year} />
      )}
    </>
  );
}
