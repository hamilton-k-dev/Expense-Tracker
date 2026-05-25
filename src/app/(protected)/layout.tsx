import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/actions/settings";
import AppShell from "@/components/AppShell";
import type { Locale } from "@/lib/i18n";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const [settings, cookieStore] = await Promise.all([getSettings(), cookies()]);
  const rawLang = cookieStore.get("lang")?.value;
  const initialLocale: Locale = rawLang === "fr" ? "fr" : "en";

  return (
    <AppShell initialCurrency={settings.currency} initialLocale={initialLocale}>
      {children}
    </AppShell>
  );
}
