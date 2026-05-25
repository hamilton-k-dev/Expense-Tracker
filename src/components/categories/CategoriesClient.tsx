"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CategoryData } from "@/lib/types";
import { deleteCategory } from "@/lib/actions/categories";
import CategoryModal from "./CategoryModal";

type Props = {
  categories: CategoryData[];
};

export default function CategoriesClient({ categories }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CategoryData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Transactions will be moved to another category.")) return;
    setDeletingId(id);
    await deleteCategory(id);
    toast.success("Category deleted");
    setDeletingId(null);
  };

  const openEdit = (cat: CategoryData) => {
    setEditing(cat);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <i className="ri-add-line text-base"></i>
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col gap-3 group"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: cat.bgColor }}
              >
                <i className={`${cat.icon} text-xl`} style={{ color: cat.color }}></i>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(cat)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <i className="ri-edit-line text-sm"></i>
                </button>
                {!cat.isDefault && (
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={deletingId === cat.id}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    <i className={`${deletingId === cat.id ? "ri-loader-4-line animate-spin" : "ri-delete-bin-line"} text-sm`}></i>
                  </button>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{cat.name}</p>
              {cat.isDefault && (
                <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">
                  Default
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CategoryModal onClose={closeModal} initial={editing} />
      )}
    </>
  );
}
