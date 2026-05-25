"use client";

import { useState } from "react";
import TransactionModal from "@/components/transactions/TransactionModal";
import { CategoryData } from "@/lib/types";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

type Props = { categories: CategoryData[] };

export default function DashboardQuickAdd({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const { t } = useUserPreferences();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        <i className="ri-add-line text-base"></i>
        {t("transactions.add")}
      </button>
      {open && (
        <TransactionModal onClose={() => setOpen(false)} categories={categories} />
      )}
    </>
  );
}
