"use client";

import { BudgetData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

type Props = { budget: BudgetData; onEdit: () => void };

export default function BudgetCard({ budget, onEdit }: Props) {
  const { currency, language, t } = useUserPreferences();
  const fmt = (n: number) => formatCurrency(n, currency, language);

  const pct = Math.min((budget.spent / budget.amount) * 100, 100);
  const exceeded = budget.spent > budget.amount;
  const nearLimit = !exceeded && pct >= 80;
  const barColor = exceeded ? "#EF4444" : nearLimit ? "#F59E0B" : "#10B981";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: budget.category.bgColor }}>
            <i className={`${budget.category.icon} text-lg`} style={{ color: budget.category.color }}></i>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">{budget.category.name}</h3>
            <p className="text-xs text-slate-400">{t("budgets.monthly_label")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {exceeded && (
            <span className="flex items-center gap-1 px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg text-xs font-semibold">
              <i className="ri-alarm-warning-line text-xs"></i> {t("budgets.exceeded")}
            </span>
          )}
          {nearLimit && (
            <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-lg text-xs font-semibold">
              <i className="ri-error-warning-line text-xs"></i> {t("budgets.approaching")}
            </span>
          )}
          <button
            onClick={onEdit}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <i className="ri-edit-line text-sm"></i>
          </button>
        </div>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-xl font-bold text-slate-800 dark:text-white">{fmt(budget.spent)}</span>
        <span className="text-sm text-slate-400">{t("common.of")} {fmt(budget.amount)}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
      <p className="text-xs mt-2" style={{ color: barColor }}>{pct.toFixed(0)}{t("budgets.used")}</p>
    </div>
  );
}
