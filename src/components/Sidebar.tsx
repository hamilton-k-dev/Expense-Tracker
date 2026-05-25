"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
  { href: "/dashboard/transactions", label: "Transactions", icon: "ri-exchange-line" },
  { href: "/dashboard/categories", label: "Categories", icon: "ri-price-tag-3-line" },
  { href: "/dashboard/budgets", label: "Budgets", icon: "ri-wallet-3-line" },
  { href: "/dashboard/reports", label: "Reports", icon: "ri-bar-chart-2-line" },
  { href: "/dashboard/settings", label: "Settings", icon: "ri-settings-3-line" },
];

type Props = { collapsed: boolean; onToggle: () => void };

export default function Sidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col h-full bg-[#0F172A] transition-all duration-300 ${collapsed ? "w-16" : "w-64"} flex-shrink-0`}
    >
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 flex-shrink-0 bg-blue-600 rounded-lg flex items-center justify-center">
          <i className="ri-line-chart-line text-white text-base"></i>
        </div>
        {!collapsed && <span className="text-white font-bold text-lg tracking-tight">ExpenseIQ</span>}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap group
                ${active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className={`${item.icon} text-lg`}></i>
              </div>
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className={`${collapsed ? "ri-arrow-right-s-line" : "ri-arrow-left-s-line"} text-lg`}></i>
          </div>
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
