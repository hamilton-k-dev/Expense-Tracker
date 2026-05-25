"use client";

import type { LandingLocale } from "@/lib/landing-i18n";

export default function LandingLangToggle({ locale }: { locale: LandingLocale }) {
  const next = locale === "fr" ? "en" : "fr";

  function toggle() {
    document.cookie = `lang=${next}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10"
      title={locale === "fr" ? "Switch to English" : "Passer en français"}
    >
      <i className="ri-translate-2 text-sm"></i>
      {locale === "fr" ? "EN" : "FR"}
    </button>
  );
}
