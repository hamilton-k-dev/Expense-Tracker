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

export async function getTransactions() {
  const userId = await getUserId();
  const rows = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
  });
  return rows.map((t) => ({
    ...t,
    date: t.date.toISOString().split("T")[0],
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));
}

export async function createTransaction(data: {
  title: string;
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  date: string;
  notes?: string;
}) {
  const userId = await getUserId();
  await prisma.transaction.create({
    data: {
      userId,
      title: data.title,
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      date: new Date(data.date + "T12:00:00"),
      notes: data.notes || null,
    },
  });
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reports");
  revalidatePath("/dashboard/budgets");
}

export async function updateTransaction(
  id: string,
  data: {
    title: string;
    amount: number;
    type: "income" | "expense";
    categoryId: string;
    date: string;
    notes?: string;
  }
) {
  const userId = await getUserId();
  await prisma.transaction.updateMany({
    where: { id, userId },
    data: {
      title: data.title,
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      date: new Date(data.date + "T12:00:00"),
      notes: data.notes || null,
    },
  });
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reports");
  revalidatePath("/dashboard/budgets");
}

export async function deleteTransaction(id: string) {
  const userId = await getUserId();
  await prisma.transaction.deleteMany({ where: { id, userId } });
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reports");
  revalidatePath("/dashboard/budgets");
}
