"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { UserSettingsData } from "@/lib/types";
import { updateProfile, updateNotifications } from "@/lib/actions/settings";
import { CURRENCIES, CURRENCY_LABELS } from "@/lib/constants";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import type { Locale } from "@/lib/i18n";

type Props = {
  name: string;
  email: string;
  settings: UserSettingsData;
};

export default function SettingsClient({ name, email, settings }: Props) {
  const { t, language, setLanguage, setCurrency } = useUserPreferences();
  const [tab, setTab] = useState<"profile" | "notifications">("profile");
  const [pending, startTransition] = useTransition();

  const [profileForm, setProfileForm] = useState({
    name,
    phone: settings.phone ?? "",
    bio: settings.bio ?? "",
    currency: settings.currency,
  });

  const [notifForm, setNotifForm] = useState({
    budgetAlerts: settings.budgetAlerts,
    weeklyReport: settings.weeklyReport,
    emailDigest: settings.emailDigest,
    pushNotifs: settings.pushNotifs,
  });

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone || undefined,
        bio: profileForm.bio || undefined,
        currency: profileForm.currency,
      });
      setCurrency(profileForm.currency);
      toast.success(t("settings.save"));
    });
  };

  const saveNotifs = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateNotifications(notifForm);
      toast.success(t("settings.save_prefs"));
    });
  };

  const tabs = [
    { id: "profile" as const, label: t("settings.profile"), icon: "ri-user-line" },
    { id: "notifications" as const, label: t("settings.notifications"), icon: "ri-notification-3-line" },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      {/* Language switcher */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">{t("settings.language")}</p>
        <div className="flex gap-2">
          {(["en", "fr"] as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLanguage(l)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                language === l
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              <span>{l === "en" ? "🇬🇧" : "🇫🇷"}</span>
              {l === "en" ? t("settings.lang_en") : t("settings.lang_fr")}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {tabs.map((tab_) => (
          <button
            key={tab_.id}
            onClick={() => setTab(tab_.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === tab_.id
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <i className={`${tab_.icon} text-base`}></i>
            {tab_.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <form onSubmit={saveProfile} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-5">
          <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-700">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {profileForm.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white">{profileForm.name || "User"}</p>
              <p className="text-sm text-slate-400">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{t("settings.full_name")}</label>
              <input
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{t("settings.email")}</label>
              <input
                disabled
                value={email}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{t("settings.phone")}</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
                placeholder={t("settings.phone_placeholder")}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{t("settings.currency")}</label>
              <select
                value={profileForm.currency}
                onChange={(e) => setProfileForm({ ...profileForm, currency: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c} — {CURRENCY_LABELS[c] ?? c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{t("settings.bio")}</label>
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              rows={3}
              maxLength={300}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors resize-none"
              placeholder={t("settings.bio_placeholder")}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
          >
            {pending && <i className="ri-loader-4-line animate-spin text-base"></i>}
            {t("settings.save")}
          </button>
        </form>
      )}

      {tab === "notifications" && (
        <form onSubmit={saveNotifs} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-1">
          {([
            { key: "budgetAlerts" as const, label: t("settings.budget_alerts"), desc: t("settings.budget_alerts_desc") },
            { key: "weeklyReport" as const, label: t("settings.weekly_report"), desc: t("settings.weekly_report_desc") },
            { key: "emailDigest" as const, label: t("settings.email_digest"), desc: t("settings.email_digest_desc") },
            { key: "pushNotifs" as const, label: t("settings.push_notifs"), desc: t("settings.push_notifs_desc") },
          ]).map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between py-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
              <div className="pr-6">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifForm[key]}
                onClick={() => setNotifForm((prev) => ({ ...prev, [key]: !prev[key] }))}
                className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 shrink-0 mt-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  notifForm[key] ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-600"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    notifForm[key] ? "translate-x-5" : "translate-x-0.5"
                  } mt-0.5`}
                />
              </button>
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
            >
              {pending && <i className="ri-loader-4-line animate-spin text-base"></i>}
              {t("settings.save_prefs")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
