import { cookies } from "next/headers";
import { getCategories } from "@/lib/actions/categories";
import { getTranslations, type Locale } from "@/lib/i18n";
import CategoriesClient from "@/components/categories/CategoriesClient";

export default async function CategoriesPage() {
  const [categories, cookieStore] = await Promise.all([getCategories(), cookies()]);

  const rawLang = cookieStore.get("lang")?.value;
  const locale: Locale = rawLang === "fr" ? "fr" : "en";
  const t = getTranslations(locale);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{t("categories.title")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("categories.subtitle", { count: String(categories.length) })}
        </p>
      </div>
      <CategoriesClient categories={categories} />
    </div>
  );
}
