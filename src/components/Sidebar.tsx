"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

const navItems = [
  { href: "/dashboard", labelKey: "nav.dashboard" as const, icon: "ri-dashboard-line" },
  { href: "/dashboard/transactions", labelKey: "nav.transactions" as const, icon: "ri-exchange-line" },
  { href: "/dashboard/categories", labelKey: "nav.categories" as const, icon: "ri-price-tag-3-line" },
  { href: "/dashboard/budgets", labelKey: "nav.budgets" as const, icon: "ri-wallet-3-line" },
  { href: "/dashboard/reports", labelKey: "nav.reports" as const, icon: "ri-bar-chart-2-line" },
  { href: "/dashboard/settings", labelKey: "nav.settings" as const, icon: "ri-settings-3-line" },
];

type Props = { collapsed: boolean; onToggle: () => void; onClose: () => void };

export default function Sidebar({ collapsed, onToggle, onClose }: Props) {
  const pathname = usePathname();
  const { t } = useUserPreferences();

  return (
    <aside
      className={`flex flex-col h-full bg-[#0F172A] transition-all duration-300 shrink-0
        ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Logo + mobile close */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="ri-line-chart-line text-white text-base"></i>
          </div>
          {!collapsed && <span className="text-white font-bold text-lg tracking-tight">ExpenseIQ</span>}
        </div>
        {/* Close button — only visible on mobile */}
        {!collapsed && (
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap
                ${active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <i className={`${item.icon} text-lg`}></i>
              </div>
              {!collapsed && <span className="text-sm font-medium">{t(item.labelKey)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle — hidden on mobile since it's a drawer there */}
      <div className="p-3 border-t border-white/10 hidden lg:block">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className={`${collapsed ? "ri-arrow-right-s-line" : "ri-arrow-left-s-line"} text-lg`}></i>
          </div>
          {!collapsed && <span className="text-sm">{t("nav.collapse")}</span>}
        </button>
      </div>
    </aside>
  );
}
