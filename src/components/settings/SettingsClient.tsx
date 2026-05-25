"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { UserSettingsData } from "@/lib/types";
import { updateProfile, updateNotifications } from "@/lib/actions/settings";
import { CURRENCIES } from "@/lib/constants";

type Props = {
  name: string;
  email: string;
  settings: UserSettingsData;
};

export default function SettingsClient({ name, email, settings }: Props) {
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
      toast.success("Profile saved");
    });
  };

  const saveNotifs = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateNotifications(notifForm);
      toast.success("Preferences saved");
    });
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: "ri-user-line" },
    { id: "notifications" as const, label: "Notifications", icon: "ri-notification-3-line" },
  ];

  return (
    <div className="max-w-2xl">
      <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <i className={`${t.icon} text-base`}></i>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <form onSubmit={saveProfile} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-5">
          <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-700">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {profileForm.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white">{profileForm.name || "User"}</p>
              <p className="text-sm text-slate-400">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Full Name</label>
              <input
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Email</label>
              <input
                disabled
                value={email}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Currency</label>
              <select
                value={profileForm.currency}
                onChange={(e) => setProfileForm({ ...profileForm, currency: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Bio (optional)</label>
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              rows={3}
              maxLength={300}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 transition-colors resize-none"
              placeholder="A little about yourself..."
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
          >
            {pending && <i className="ri-loader-4-line animate-spin text-base"></i>}
            Save Changes
          </button>
        </form>
      )}

      {tab === "notifications" && (
        <form onSubmit={saveNotifs} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-1">
          {([
            { key: "budgetAlerts" as const, label: "Budget Alerts", desc: "Get notified when you're close to your budget limit" },
            { key: "weeklyReport" as const, label: "Weekly Summary", desc: "Receive a weekly spending report every Monday" },
            { key: "emailDigest" as const, label: "Email Digest", desc: "Monthly email with your financial overview" },
            { key: "pushNotifs" as const, label: "Push Notifications", desc: "Browser push notifications for transactions" },
          ]).map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between py-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
              <div className="pr-4">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifForm({ ...notifForm, [key]: !notifForm[key] })}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${notifForm[key] ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-600"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifForm[key] ? "translate-x-5" : "translate-x-0.5"}`}
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
              Save Preferences
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
