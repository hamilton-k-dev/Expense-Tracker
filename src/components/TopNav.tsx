"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession, signOut } from "@/lib/auth-client";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import type { Locale } from "@/lib/i18n";

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

type Props = { onMenuToggle: () => void };

export default function TopNav({ onMenuToggle }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const { t, language, setLanguage } = useUserPreferences();
  const [showProfile, setShowProfile] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark((localStorage.getItem("theme") ?? "light") === "dark");
  }, []);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setIsDark(!isDark);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  const handleSignOut = async () => {
    setShowProfile(false);
    await signOut();
    router.push("/login");
    router.refresh();
    toast.success(t("common.sign_out"));
  };

  const user = session?.user;

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-6 gap-4 shrink-0">
      <button
        onClick={onMenuToggle}
        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <i className="ri-menu-line text-xl"></i>
      </button>

      <div className="hidden sm:block flex-1 max-w-md">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <i className="ri-search-line text-sm"></i>
          </div>
          <input
            type="text"
            placeholder={t("common.search_placeholder")}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 border border-transparent rounded-xl focus:outline-none focus:border-blue-400 dark:text-slate-200 dark:placeholder-slate-400 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={toggleLanguage}
          title={language === "en" ? "Switch to French" : "Passer en anglais"}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors text-xs font-bold"
        >
          {language === "en" ? "FR" : "EN"}
        </button>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
        >
          <i className={`${isDark ? "ri-sun-line" : "ri-moon-line"} text-lg`}></i>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">{getInitials(user?.name)}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-800 dark:text-white leading-none">{user?.name ?? "User"}</p>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            </div>
            <div className="w-4 h-4 flex items-center justify-center text-slate-400">
              <i className="ri-arrow-down-s-line text-sm"></i>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
              <div className="py-1">
                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  {t("common.profile_link")}
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  {t("common.settings_link")}
                </button>
                <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    {t("common.sign_out")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
