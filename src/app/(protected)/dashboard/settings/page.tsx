import { headers, cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/actions/settings";
import { getTranslations, type Locale } from "@/lib/i18n";
import SettingsClient from "@/components/settings/SettingsClient";

export default async function SettingsPage() {
  const [session, settings, cookieStore] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getSettings(),
    cookies(),
  ]);
  const user = session!.user;

  const rawLang = cookieStore.get("lang")?.value;
  const locale: Locale = rawLang === "fr" ? "fr" : "en";
  const t = getTranslations(locale);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{t("settings.title")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("settings.subtitle")}</p>
      </div>
      <SettingsClient
        name={user.name ?? ""}
        email={user.email}
        settings={{
          currency: settings.currency,
          phone: settings.phone,
          bio: settings.bio,
          budgetAlerts: settings.budgetAlerts,
          weeklyReport: settings.weeklyReport,
          emailDigest: settings.emailDigest,
          pushNotifs: settings.pushNotifs,
        }}
      />
    </div>
  );
}
