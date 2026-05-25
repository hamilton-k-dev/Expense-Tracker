"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CategoryData } from "@/lib/types";
import { ICON_OPTIONS, COLOR_OPTIONS } from "@/lib/constants";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

type Props = {
  onClose: () => void;
  initial?: CategoryData | null;
};

export default function CategoryModal({ onClose, initial }: Props) {
  const { t } = useUserPreferences();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? ICON_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(
    COLOR_OPTIONS.find((c) => c.color === initial?.color) ?? COLOR_OPTIONS[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const data = { name, icon, color: selectedColor.color, bgColor: selectedColor.bg };
      if (initial) {
        await updateCategory(initial.id, data);
        toast.success(t("toasts.category_updated"));
      } else {
        await createCategory(data);
        toast.success(t("toasts.category_created"));
      }
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm max-h-[92dvh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">{initial ? t("modals.edit_category") : t("modals.new_category")}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: selectedColor.bg }}
            >
              <i className={`${icon} text-2xl`} style={{ color: selectedColor.color }}></i>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{t("modals.name")}</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
                placeholder={t("modals.name_placeholder")}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">{t("modals.icon")}</label>
            <div className="grid grid-cols-8 gap-1.5">
              {ICON_OPTIONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 transition-all ${
                    icon === ic
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-transparent bg-slate-50 dark:bg-slate-700 hover:border-slate-300"
                  }`}
                >
                  <i className={`${ic} text-base`} style={{ color: icon === ic ? selectedColor.color : undefined }}></i>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">{t("modals.color")}</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedColor.color === c.color ? "border-slate-400 scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.color }}
                >
                  {selectedColor.color === c.color && (
                    <i className="ri-check-line text-white text-xs"></i>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {pending && <i className="ri-loader-4-line animate-spin text-base"></i>}
            {initial ? t("modals.save") : t("modals.create_category")}
          </button>
        </form>
      </div>
    </div>
  );
}
