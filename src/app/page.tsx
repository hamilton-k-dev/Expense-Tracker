import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { getLandingT, type LandingLocale } from "@/lib/landing-i18n";
import LandingLangToggle from "@/components/LandingLangToggle";

export default async function LandingPage() {
  const [session, cookieStore] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    cookies(),
  ]);
  if (session) redirect("/dashboard");

  const rawLang = cookieStore.get("lang")?.value;
  const locale: LandingLocale = rawLang === "fr" ? "fr" : "en";
  const t = getLandingT(locale);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0F172A]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <i className="ri-line-chart-line text-white text-base"></i>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">ExpenseIQ</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: t.nav.features, href: "#features" },
              { label: t.nav.pricing,  href: "#pricing" },
              { label: t.nav.docs,     href: "/docs" },
            ].map((n) => (
              <a key={n.href} href={n.href} className="px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LandingLangToggle locale={locale} />
            <Link href="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors font-medium">
              {t.nav.login}
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
              {t.nav.register}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 bg-linear-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                {t.hero.badge}
              </div>
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight">
                {t.hero.h1a}<br />
                <span className="text-blue-600">{t.hero.h1b}</span>
              </h1>
              <p className="mt-5 text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t.hero.subtitle}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/25">
                  <i className="ri-rocket-line"></i>
                  {t.hero.cta1}
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors text-sm">
                  <i className="ri-login-circle-line"></i>
                  {t.hero.cta2}
                </Link>
              </div>
              <p className="mt-4 text-xs text-slate-400">{t.hero.no_card}</p>
            </div>

            {/* Right — App preview card */}
            <div className="flex-1 w-full max-w-lg">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                {/* Mini top bar */}
                <div className="flex items-center gap-1.5 px-4 py-3 bg-[#0F172A]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
                  <span className="ml-2 text-xs text-slate-400">{t.hero.preview_title}</span>
                </div>
                {/* Stat cards row */}
                <div className="p-4 bg-slate-50">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: locale === "fr" ? "Solde total"   : "Total balance",  value: "1 680 000 XAF", icon: "ri-bank-card-line",          bg: "bg-blue-50",    color: "text-blue-600"    },
                      { label: locale === "fr" ? "Revenus"        : "Income",          value: "3 430 000 XAF", icon: "ri-arrow-up-circle-line",    bg: "bg-emerald-50", color: "text-emerald-600" },
                      { label: locale === "fr" ? "Dépenses"       : "Expenses",        value: "1 750 000 XAF", icon: "ri-arrow-down-circle-line",  bg: "bg-red-50",     color: "text-red-500"     },
                      { label: locale === "fr" ? "Net ce mois"    : "This month net",  value: "43 500 XAF",    icon: "ri-safe-2-line",             bg: "bg-purple-50",  color: "text-purple-600"  },
                    ].map((s) => (
                      <div key={s.label} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-slate-500">{s.label}</p>
                          <div className={`w-7 h-7 ${s.bg} rounded-lg flex items-center justify-center`}>
                            <i className={`${s.icon} text-sm ${s.color}`}></i>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mini transaction list */}
                  <div className="mt-3 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-50">
                      <p className="text-xs font-semibold text-slate-700">{t.hero.preview_recent}</p>
                    </div>
                    {t.preview_transactions.map((tx) => (
                      <div key={tx.title} className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 transition-colors">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: tx.bg }}>
                          <i className={`${tx.icon} text-sm`} style={{ color: tx.ic }}></i>
                        </div>
                        <span className="text-xs text-slate-700 flex-1">{tx.title}</span>
                        <span className={`text-xs font-bold ${tx.color}`}>{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <section className="py-14 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {t.stats.map((s) => (
              <div key={s.value} className="flex flex-col items-center gap-1">
                <span className="text-4xl font-bold text-white">{s.value}</span>
                <span className="text-sm font-semibold text-slate-200">{s.label}</span>
                <span className="text-xs text-slate-500">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{t.features_section.title}</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">{t.features_section.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <i className={`${f.icon} text-xl ${f.color}`}></i>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature highlight: budgets ───────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 order-2 lg:order-1">
            {/* Budget card mockup */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-800">{locale === "fr" ? "Budgets — Mai 2026" : "Budgets — May 2026"}</h4>
                <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">{locale === "fr" ? "6 actifs" : "6 active"}</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: locale === "fr" ? "Alimentation"        : "Food",            icon: "ri-restaurant-line", spent: 96_500,  budget: 120_000, color: "#F97316", bg: "#FFF7ED", barColor: "#10B981" },
                  { name: locale === "fr" ? "Logement & Factures" : "Housing & Bills", icon: "ri-home-line",       spent: 107_700, budget: 110_000, color: "#8B5CF6", bg: "#F5F3FF", barColor: "#F59E0B" },
                  { name: locale === "fr" ? "Transport"           : "Transport",       icon: "ri-car-line",        spent: 47_500,  budget: 45_000,  color: "#3B82F6", bg: "#EFF6FF", barColor: "#EF4444" },
                ].map((b) => {
                  const pct = Math.min((b.spent / b.budget) * 100, 100);
                  return (
                    <div key={b.name}>
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: b.bg }}>
                          <i className={`${b.icon} text-sm`} style={{ color: b.color }}></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-700">{b.name}</span>
                            <span className="text-xs text-slate-500">{b.spent.toLocaleString("fr-FR")} / {b.budget.toLocaleString("fr-FR")} XAF</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: b.barColor }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-emerald-700 mb-4">
              <i className="ri-wallet-3-line text-xs"></i>
              {t.budget_section.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t.budget_section.h2a}<br />{t.budget_section.h2b}</h2>
            <p className="text-slate-500 mb-6 leading-relaxed">{t.budget_section.p}</p>
            <ul className="space-y-3">
              {t.budget_section.checks.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <i className="ri-check-line text-xs text-emerald-600"></i>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Feature highlight: currencies ───────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 mb-4">
              <i className="ri-global-line text-xs"></i>
              {t.currency_section.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t.currency_section.h2a}<br />{t.currency_section.h2b}</h2>
            <p className="text-slate-500 mb-6 leading-relaxed">{t.currency_section.p}</p>
            <div className="flex flex-wrap gap-2">
              {["XAF", "XOF", "NGN", "ZAR", "KES", "GHS", "MAD", "EGP", "EUR", "USD", "GBP"].map((c) => (
                <span key={c} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-sm">{c}</span>
              ))}
              <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-600">{t.currency_section.more}</span>
            </div>
          </div>
          <div className="flex-1">
            {/* Currency format comparison */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 max-w-md mx-auto space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{t.currency_table_title}</p>
              {t.currency_table.map((r) => (
                <div key={r.label} className="flex items-center justify-between py-2.5 px-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{r.flag}</span>
                    <span className="text-xs text-slate-600 font-medium">{r.label}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${r.bg} ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">{t.pricing.h2}</h2>
          <p className="text-slate-500 mb-10">{t.pricing.subtitle}</p>
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">{t.pricing.badge}</span>
            </div>
            <div className="text-5xl font-bold text-slate-900 mb-2">{t.pricing.price}<span className="text-xl font-normal text-slate-400"> {t.pricing.per_month}</span></div>
            <p className="text-slate-500 text-sm mb-8">{t.pricing.full_access}</p>
            <div className="grid sm:grid-cols-2 gap-3 text-left mb-8">
              {t.pricing.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <i className="ri-check-line text-xs text-blue-600"></i>
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/25">
              <i className="ri-rocket-line"></i>
              {t.pricing.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-[#0F172A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t.cta_section.h2}</h2>
          <p className="text-slate-400 mb-8 text-lg">{t.cta_section.p}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/30 text-sm">
              <i className="ri-rocket-line"></i>
              {t.cta_section.cta1}
            </Link>
            <Link href="/docs" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors text-sm border border-white/20">
              <i className="ri-book-open-line"></i>
              {t.cta_section.cta2}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#0F172A] border-t border-white/10 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-line-chart-line text-white text-sm"></i>
            </div>
            <span className="text-white font-bold">ExpenseIQ</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/docs"     className="hover:text-slate-300 transition-colors">{t.footer.docs}</Link>
            <Link href="/login"    className="hover:text-slate-300 transition-colors">{t.footer.login}</Link>
            <Link href="/register" className="hover:text-slate-300 transition-colors">{t.footer.register}</Link>
          </div>
          <p className="text-xs text-slate-600">{t.footer.copy}</p>
        </div>
      </footer>
    </div>
  );
}
