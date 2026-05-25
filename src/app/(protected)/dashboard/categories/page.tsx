import { getCategories } from "@/lib/actions/categories";
import CategoriesClient from "@/components/categories/CategoriesClient";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Categories</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Organise your transactions into {categories.length} categories
        </p>
      </div>
      <CategoriesClient categories={categories} />
    </div>
  );
}
