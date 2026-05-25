"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MonthlyChartPoint } from "@/lib/types";

type Props = { data: MonthlyChartPoint[] };

export default function IncomeExpenseChart({ data }: Props) {
  return (
    <>
      <div className="flex items-center gap-4 text-xs mb-5">
        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block"></span>Income
        </span>
        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <span className="w-3 h-1 bg-blue-500 rounded-full inline-block"></span>Expenses
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          />
          <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: "#10B981" }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="expenses" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: "#3B82F6" }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
