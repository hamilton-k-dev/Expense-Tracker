"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

export async function ensureDefaultCategories(userId: string) {
  const count = await prisma.category.count({ where: { userId } });
  if (count === 0) {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((c) => ({ ...c, userId, isDefault: true })),
    });
  }
}

export async function getCategories() {
  const userId = await getUserId();
  await ensureDefaultCategories(userId);
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createCategory(data: {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}) {
  const userId = await getUserId();
  const category = await prisma.category.create({ data: { ...data, userId } });
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard");
  return category;
}

export async function updateCategory(
  id: string,
  data: { name: string; icon: string; color: string; bgColor: string }
) {
  const userId = await getUserId();
  const category = await prisma.category.updateMany({
    where: { id, userId },
    data,
  });
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard");
  return category;
}

export async function deleteCategory(id: string) {
  const userId = await getUserId();
  // Move transactions to the first available category before deleting
  const fallback = await prisma.category.findFirst({
    where: { userId, id: { not: id } },
  });
  if (fallback) {
    await prisma.transaction.updateMany({
      where: { userId, categoryId: id },
      data: { categoryId: fallback.id },
    });
    await prisma.budget.deleteMany({ where: { userId, categoryId: id } });
  }
  await prisma.category.deleteMany({ where: { id, userId } });
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard");
}
