"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CategoryData, BudgetData } from "@/lib/types";
import { upsertBudget } from "@/lib/actions/budgets";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

type Props = {
  onClose: () => void;
  categories: CategoryData[];
  initial?: BudgetData | null;
  month: number;
  year: number;
};

export default function BudgetModal({ onClose, categories, initial, month, year }: Props) {
  const { t } = useUserPreferences();
  const [pending, startTransition] = useTransition();
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await upsertBudget({ categoryId, amount: parseFloat(amount), month, year });
      toast.success(initial ? t("toasts.budget_updated") : t("toasts.budget_set"));
      onClose();
    });
  };

  const selectedCat = categories.find((c) => c.id === categoryId);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm max-h-[92dvh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">{initial ? t("modals.edit_budget") : t("modals.set_budget")}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">{t("modals.category")}</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-left ${
                    categoryId === cat.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-transparent bg-slate-50 dark:bg-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cat.bgColor }}
                  >
                    <i className={`${cat.icon} text-sm`} style={{ color: cat.color }}></i>
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{cat.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              {t("budgets.monthly_limit")}
              {selectedCat && (
                <span className="ml-2 font-normal text-slate-400">{t("budgets.budget_for")} {selectedCat.name}</span>
              )}
            </label>
            <input
              required
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
              placeholder="e.g. 500"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
            <i className="ri-calendar-line mr-1.5"></i>
            {t("budgets.budget_for")}{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {new Date(year, month - 1, 1).toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {pending && <i className="ri-loader-4-line animate-spin text-base"></i>}
            {initial ? t("modals.update_budget") : t("modals.set_budget")}
          </button>
        </form>
      </div>
    </div>
  );
}
