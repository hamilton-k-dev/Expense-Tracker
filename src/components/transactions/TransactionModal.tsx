"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { TransactionData, CategoryData } from "@/lib/types";
import { createTransaction, updateTransaction } from "@/lib/actions/transactions";

type Props = {
  onClose: () => void;
  initial?: TransactionData | null;
  categories: CategoryData[];
};

export default function TransactionModal({ onClose, initial, categories }: Props) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    amount: initial?.amount?.toString() ?? "",
    type: initial?.type ?? "expense",
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
    date: initial?.date ?? new Date().toISOString().split("T")[0],
    notes: initial?.notes ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const data = {
        title: form.title,
        amount: parseFloat(form.amount),
        type: form.type as "income" | "expense",
        categoryId: form.categoryId,
        date: form.date,
        notes: form.notes || undefined,
      };
      if (initial) {
        await updateTransaction(initial.id, data);
        toast.success("Transaction updated");
      } else {
        await createTransaction(data);
        toast.success("Transaction added");
      }
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">{initial ? "Edit Transaction" : "Add Transaction"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-slate-500 transition-colors">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
              placeholder="e.g. Grocery Store"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Amount ($)</label>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Date</label>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Type</label>
            <div className="flex gap-2">
              {(["expense", "income"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${form.type === t ? (t === "income" ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
                >
                  {t === "income" ? "+ Income" : "- Expense"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm({ ...form, categoryId: cat.id })}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all cursor-pointer ${form.categoryId === cat.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-transparent bg-slate-50 dark:bg-slate-700 hover:border-slate-300"}`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className={`${cat.icon} text-base`} style={{ color: cat.color }}></i>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight text-center line-clamp-1">{cat.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              maxLength={500}
              rows={2}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors resize-none"
              placeholder="Optional notes..."
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {pending && <i className="ri-loader-4-line animate-spin text-base"></i>}
            {initial ? "Save Changes" : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}
