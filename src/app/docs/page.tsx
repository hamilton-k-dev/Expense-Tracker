import Link from "next/link";
import { cookies } from "next/headers";
import { getLandingT, getDocsT, type LandingLocale } from "@/lib/landing-i18n";
import LandingLangToggle from "@/components/LandingLangToggle";

export default async function DocsPage() {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get("lang")?.value;
  const locale: LandingLocale = rawLang === "fr" ? "fr" : "en";
  const t = getDocsT(locale);
  const nav = getLandingT(locale).nav;
  const footer = getLandingT(locale).footer;

  const sections = [
    { id: "demarrage",     label: t.sections.demarrage },
    { id: "dashboard",     label: t.sections.dashboard },
    { id: "transactions",  label: t.sections.transactions },
    { id: "categories",    label: t.sections.categories },
    { id: "budgets",       label: t.sections.budgets },
    { id: "rapports",      label: t.sections.rapports },
    { id: "parametres",    label: t.sections.parametres },
    { id: "devises",       label: t.sections.devises },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0F172A]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <i className="ri-line-chart-line text-white text-base"></i>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">ExpenseIQ</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/#features" className="px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">{nav.features}</Link>
            <Link href="/#pricing"  className="px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">{nav.pricing}</Link>
            <Link href="/docs"      className="px-3 py-2 text-sm text-white bg-white/10 rounded-lg font-medium">{nav.docs}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <LandingLangToggle locale={locale} />
            <Link href="/login"    className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors font-medium">{nav.login}</Link>
            <Link href="/register" className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">{nav.register}</Link>
          </div>
        </div>
      </header>

      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 flex gap-8 py-10">

        {/* ── Sidebar TOC ─────────────────────────────────────────────── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-3">{t.toc_label}</p>
            <nav className="space-y-0.5">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block px-3 py-2 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </nav>
            <div className="mt-8 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-semibold text-blue-800 mb-2">{t.ready_label}</p>
              <Link href="/register" className="block text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
                {t.ready_cta}
              </Link>
            </div>
          </div>
        </aside>

        {/* ── Main content ────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 max-w-3xl">

          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700 mb-4">
              <i className="ri-book-open-line"></i>
              {t.header_badge}
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">{t.header_title}</h1>
            <p className="text-slate-500 text-lg leading-relaxed">{t.header_subtitle}</p>
          </div>

          {/* ── Quick start ───────────────────────────────────────────── */}
          <DocSection id="demarrage" title={t.quick_start.title} icon={t.quick_start.icon} iconBg="bg-blue-50" iconColor="text-blue-600">
            <p>{t.quick_start.intro}</p>
            <StepList steps={t.quick_start.steps} />
            <InfoBox icon="ri-lightbulb-line" color="blue">
              {t.quick_start.info}
            </InfoBox>
          </DocSection>

          {/* ── Dashboard ─────────────────────────────────────────────── */}
          <DocSection id="dashboard" title={t.dashboard.title} icon={t.dashboard.icon} iconBg="bg-purple-50" iconColor="text-purple-600">
            <p>{t.dashboard.intro}</p>
            <CardGrid cards={t.dashboard.cards} />
            <ul className="space-y-2 mt-2">
              {t.dashboard.list.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <i className="ri-check-line text-emerald-500 mt-0.5 shrink-0"></i>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </DocSection>

          {/* ── Transactions ──────────────────────────────────────────── */}
          <DocSection id="transactions" title={t.transactions.title} icon={t.transactions.icon} iconBg="bg-emerald-50" iconColor="text-emerald-600">
            <p>{t.transactions.intro}</p>

            <SubSection title={t.transactions.add_title}>
              <p>{t.transactions.add_intro} <InlineCode>+ {t.transactions.add_title}</InlineCode></p>
              <FieldList fields={t.transactions.fields} />
            </SubSection>

            <SubSection title={t.transactions.filters_title}>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {t.transactions.filters.map((f) => (
                  <li key={f} className="flex items-center gap-2"><i className="ri-filter-line text-blue-500 shrink-0"></i>{f}</li>
                ))}
              </ul>
            </SubSection>

            <SubSection title={t.transactions.edit_title}>
              <p>{t.transactions.edit_text}</p>
            </SubSection>
          </DocSection>

          {/* ── Categories ────────────────────────────────────────────── */}
          <DocSection id="categories" title={t.categories.title} icon={t.categories.icon} iconBg="bg-amber-50" iconColor="text-amber-600">
            <p>{t.categories.intro}</p>

            <SubSection title={t.categories.defaults_title}>
              <p>{t.categories.defaults_intro}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {t.categories.default_cats.map((c) => (
                  <span key={c.name} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-100 text-xs font-medium text-slate-700 bg-white shadow-sm">
                    <span className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: c.bg }}>
                      <i className={`${c.icon} text-xs`} style={{ color: c.color }}></i>
                    </span>
                    {c.name}
                  </span>
                ))}
              </div>
            </SubSection>

            <SubSection title={t.categories.create_title}>
              <p>{t.categories.create_text} <InlineCode>{locale === "fr" ? "Nouvelle catégorie" : "New category"}</InlineCode></p>
            </SubSection>

            <InfoBox icon="ri-information-line" color="amber">
              {t.categories.info}
            </InfoBox>
          </DocSection>

          {/* ── Budgets ───────────────────────────────────────────────── */}
          <DocSection id="budgets" title={t.budgets.title} icon={t.budgets.icon} iconBg="bg-cyan-50" iconColor="text-cyan-600">
            <p>{t.budgets.intro}</p>

            <SubSection title={t.budgets.set_title}>
              <p>{t.budgets.set_text}</p>
            </SubSection>

            <SubSection title={t.budgets.indicators_title}>
              <div className="space-y-2 mt-1">
                {t.budgets.indicators.map((r) => (
                  <div key={r.label} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.color }}></span>
                    <strong>{r.label} :</strong> {r.desc}
                  </div>
                ))}
              </div>
            </SubSection>

            <InfoBox icon="ri-calendar-line" color="blue">
              {t.budgets.info}
            </InfoBox>
          </DocSection>

          {/* ── Reports ───────────────────────────────────────────────── */}
          <DocSection id="rapports" title={t.reports.title} icon={t.reports.icon} iconBg="bg-rose-50" iconColor="text-rose-600">
            <p>{t.reports.intro}</p>
            <CardGrid cards={t.reports.cards} />
            <SubSection title={t.reports.charts_title}>
              <ul className="space-y-2 text-sm text-slate-600">
                {t.reports.charts.map((g) => (
                  <li key={g} className="flex items-start gap-2"><i className="ri-pie-chart-line text-rose-500 shrink-0 mt-0.5"></i>{g}</li>
                ))}
              </ul>
            </SubSection>
          </DocSection>

          {/* ── Settings ──────────────────────────────────────────────── */}
          <DocSection id="parametres" title={t.settings.title} icon={t.settings.icon} iconBg="bg-slate-100" iconColor="text-slate-600">
            <p>{t.settings.intro}</p>

            <SubSection title={t.settings.profile_title}>
              <FieldList fields={t.settings.profile_fields} />
            </SubSection>

            <SubSection title={t.settings.notifs_title}>
              <p>{t.settings.notifs_intro}</p>
              <ul className="space-y-1.5 text-sm text-slate-600 mt-2">
                {t.settings.notifs.map((n) => (
                  <li key={n} className="flex items-center gap-2"><i className="ri-notification-3-line text-blue-500 shrink-0"></i>{n}</li>
                ))}
              </ul>
            </SubSection>

            <SubSection title={t.settings.lang_title}>
              <p>{t.settings.lang_text}</p>
            </SubSection>
          </DocSection>

          {/* ── Currencies & Language ─────────────────────────────────── */}
          <DocSection id="devises" title={t.currencies.title} icon={t.currencies.icon} iconBg="bg-indigo-50" iconColor="text-indigo-600">
            <p>{t.currencies.intro}</p>

            <SubSection title={t.currencies.supported_title}>
              <div className="flex flex-wrap gap-2 mt-2">
                {t.currencies.supported_currencies.map((c) => (
                  <div key={c.code} className="px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-xs font-bold text-slate-800">{c.code}</p>
                    <p className="text-xs text-slate-400">{c.name}</p>
                  </div>
                ))}
                <div className="px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl shadow-sm flex items-center">
                  <p className="text-xs font-bold text-blue-600">{locale === "fr" ? "+17 autres" : "+17 more"}</p>
                </div>
              </div>
            </SubSection>

            <SubSection title={t.currencies.format_title}>
              <div className="overflow-hidden rounded-xl border border-slate-200 mt-2">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">{t.format_lang}</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">{t.format_ex}</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">{t.format_desc}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {t.currencies.format_table.map((r) => (
                      <tr key={r.lang} className="bg-white">
                        <td className="px-4 py-2.5 font-medium text-slate-700">{r.lang}</td>
                        <td className="px-4 py-2.5"><code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{r.ex}</code></td>
                        <td className="px-4 py-2.5 text-slate-500">{r.fmt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SubSection>

            <InfoBox icon="ri-refresh-line" color="blue">
              {t.currencies.info}
            </InfoBox>
          </DocSection>

          {/* Bottom CTA */}
          <div className="mt-12 p-8 bg-[#0F172A] rounded-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">{t.bottom_cta_title}</h3>
            <p className="text-slate-400 text-sm mb-5">{t.bottom_cta_sub}</p>
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/30">
              <i className="ri-rocket-line"></i>
              {t.bottom_cta_btn}
            </Link>
          </div>
        </main>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="mt-10 bg-[#0F172A] border-t border-white/10 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-line-chart-line text-white text-sm"></i>
            </div>
            <span className="text-white font-bold">ExpenseIQ</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/"         className="hover:text-slate-300 transition-colors">{locale === "fr" ? "Accueil" : "Home"}</Link>
            <Link href="/login"    className="hover:text-slate-300 transition-colors">{footer.login}</Link>
            <Link href="/register" className="hover:text-slate-300 transition-colors">{footer.register}</Link>
          </div>
          <p className="text-xs text-slate-600">{footer.copy}</p>
        </div>
      </footer>
    </div>
  );
}

/* ── Reusable sub-components ────────────────────────────────────────── */

function DocSection({ id, title, icon, iconBg, iconColor, children }: {
  id: string; title: string; icon: string; iconBg: string; iconColor: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
          <i className={`${icon} text-lg ${iconColor}`}></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>
      <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-4">
        {children}
      </div>
      <div className="mt-8 border-b border-slate-100"></div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-bold text-slate-800 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function StepList({ steps }: { steps: readonly { num: string; title: string; desc: string }[] }) {
  return (
    <div className="space-y-3 mt-3">
      {steps.map((s) => (
        <div key={s.num} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0 text-xs font-bold">{s.num}</div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{s.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FieldList({ fields }: { fields: readonly { name: string; desc: string }[] }) {
  return (
    <div className="mt-2 space-y-1.5">
      {fields.map((f) => (
        <div key={f.name} className="flex items-start gap-3 text-sm">
          <code className="shrink-0 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono mt-0.5">{f.name}</code>
          <span className="text-slate-500">{f.desc}</span>
        </div>
      ))}
    </div>
  );
}

function CardGrid({ cards }: { cards: readonly { icon: string; bg: string; color: string; title: string; desc: string }[] }) {
  return (
    <div className="grid sm:grid-cols-3 gap-3 mt-3 mb-3">
      {cards.map((c) => (
        <div key={c.title} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className={`w-9 h-9 ${c.bg} rounded-lg flex items-center justify-center mb-2.5`}>
            <i className={`${c.icon} ${c.color}`}></i>
          </div>
          <p className="text-xs font-bold text-slate-800">{c.title}</p>
          <p className="text-xs text-slate-400 mt-1">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

function InfoBox({ icon, color, children }: { icon: string; color: "blue" | "amber"; children: React.ReactNode }) {
  const styles = {
    blue:  { wrap: "bg-blue-50 border-blue-100",   icon: "text-blue-500" },
    amber: { wrap: "bg-amber-50 border-amber-100",  icon: "text-amber-500" },
  }[color];
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${styles.wrap} mt-3`}>
      <i className={`${icon} ${styles.icon} shrink-0 mt-0.5`}></i>
      <p className="text-sm text-slate-600 leading-relaxed">{children}</p>
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono">{children}</code>;
}
