"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CategorySpendData } from "@/lib/types";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

type Props = { data: CategorySpendData[] };

export default function ExpensePieChart({ data }: Props) {
  const { t } = useUserPreferences();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">{t("reports.breakdown")}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{t("reports.this_month")}</p>
      </div>
      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">{t("reports.no_data")}</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="amount">
                {data.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`$${Number(value).toFixed(2)}`, ""]}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {data.slice(0, 5).map((item) => (
              <div key={item.categoryId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">${item.amount.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
