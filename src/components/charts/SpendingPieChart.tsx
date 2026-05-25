"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CategorySpendData } from "@/lib/types";

type Props = { data: CategorySpendData[]; total: number };

export default function SpendingPieChart({ data, total }: Props) {
  return (
    <>
      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="amount">
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
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((item) => (
          <div key={item.categoryId} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
            <span className="text-xs text-slate-600 dark:text-slate-400 truncate">{item.name.split(" ")[0]}</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-auto">
              {total > 0 ? ((item.amount / total) * 100).toFixed(0) : 0}%
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
