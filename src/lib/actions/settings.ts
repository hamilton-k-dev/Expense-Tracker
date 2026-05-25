"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getSettings() {
  const userId = await getUserId();
  const settings = await prisma.userSettings.findUnique({ where: { userId } });
  if (!settings) {
    return prisma.userSettings.create({ data: { userId } });
  }
  return settings;
}

export async function updateProfile(data: {
  name: string;
  phone?: string;
  bio?: string;
  currency: string;
}) {
  const userId = await getUserId();
  await Promise.all([
    prisma.user.update({ where: { id: userId }, data: { name: data.name } }),
    prisma.userSettings.upsert({
      where: { userId },
      update: { phone: data.phone ?? null, bio: data.bio ?? null, currency: data.currency },
      create: { userId, phone: data.phone ?? null, bio: data.bio ?? null, currency: data.currency },
    }),
  ]);
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}

export async function updatePreferences(data: { currency: string }) {
  const userId = await getUserId();
  await prisma.userSettings.upsert({
    where: { userId },
    update: { currency: data.currency },
    create: { userId, currency: data.currency },
  });
  revalidatePath("/dashboard/settings");
}

export async function updateNotifications(data: {
  budgetAlerts: boolean;
  weeklyReport: boolean;
  emailDigest: boolean;
  pushNotifs: boolean;
}) {
  const userId = await getUserId();
  await prisma.userSettings.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
  revalidatePath("/dashboard/settings");
}
