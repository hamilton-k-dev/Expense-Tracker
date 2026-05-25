"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import type { Locale } from "@/lib/i18n";

type Props = { children: React.ReactNode; initialCurrency: string; initialLocale: Locale };

export default function AppShell({ children, initialCurrency, initialLocale }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <UserPreferencesProvider initialCurrency={initialCurrency} initialLocale={initialLocale}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
        {mobileOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}

        <div className={`fixed inset-y-0 left-0 z-40 lg:relative lg:z-auto lg:flex shrink-0 transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} onClose={() => setMobileOpen(false)} />
        </div>

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopNav onMenuToggle={() => setMobileOpen(!mobileOpen)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </UserPreferencesProvider>
  );
}
