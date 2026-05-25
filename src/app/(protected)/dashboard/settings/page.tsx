import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/actions/settings";
import SettingsClient from "@/components/settings/SettingsClient";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session!.user;
  const settings = await getSettings();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your profile and preferences</p>
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
