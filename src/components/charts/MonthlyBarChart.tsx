"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MonthlyChartPoint } from "@/lib/types";

type Props = { data: MonthlyChartPoint[] };

export default function MonthlyBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip
          formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
          contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
        />
        <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} name="Income" />
        <Bar dataKey="expenses" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  );
}
