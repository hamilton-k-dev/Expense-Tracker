import { TransactionData } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

type Props = { transaction: TransactionData };

export default function TransactionRow({ transaction }: Props) {
  const isIncome = transaction.type === "income";
  const cat = transaction.category;

  return (
    <div className="flex items-center gap-4 py-3 px-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
      <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: cat.bgColor }}>
        <i className={`${cat.icon} text-lg`} style={{ color: cat.color }}></i>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{transaction.title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{cat.name}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-bold ${isIncome ? "text-emerald-500" : "text-red-500"}`}>
          {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{formatDate(transaction.date)}</p>
      </div>
    </div>
  );
}
