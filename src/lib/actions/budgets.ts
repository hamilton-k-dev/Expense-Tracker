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

export async function getBudgetsWithSpent(month: number, year: number) {
  const userId = await getUserId();
  const budgets = await prisma.budget.findMany({
    where: { userId, month, year },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const result = await Promise.all(
    budgets.map(async (b) => {
      const agg = await prisma.transaction.aggregate({
        where: { userId, categoryId: b.categoryId, type: "expense", date: { gte: start, lt: end } },
        _sum: { amount: true },
      });
      return {
        id: b.id,
        categoryId: b.categoryId,
        category: b.category,
        amount: b.amount,
        month: b.month,
        year: b.year,
        spent: agg._sum.amount ?? 0,
      };
    })
  );
  return result;
}

export async function upsertBudget(data: {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}) {
  const userId = await getUserId();
  await prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId,
        categoryId: data.categoryId,
        month: data.month,
        year: data.year,
      },
    },
    update: { amount: data.amount },
    create: { userId, ...data },
  });
  revalidatePath("/dashboard/budgets");
  revalidatePath("/dashboard");
}

export async function deleteBudget(id: string) {
  const userId = await getUserId();
  await prisma.budget.deleteMany({ where: { id, userId } });
  revalidatePath("/dashboard/budgets");
  revalidatePath("/dashboard");
}
