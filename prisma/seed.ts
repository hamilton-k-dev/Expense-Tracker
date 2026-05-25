import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { config } from "dotenv";
import ws from "ws";

config({ path: ".env" });

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DEFAULT_CATEGORIES = [
  { name: "Food & Dining", icon: "ri-restaurant-line", color: "#F97316", bgColor: "#FFF7ED" },
  { name: "Transport", icon: "ri-car-line", color: "#3B82F6", bgColor: "#EFF6FF" },
  { name: "Bills & Utilities", icon: "ri-bill-line", color: "#8B5CF6", bgColor: "#F5F3FF" },
  { name: "Shopping", icon: "ri-shopping-bag-line", color: "#EC4899", bgColor: "#FDF2F8" },
  { name: "Salary", icon: "ri-money-dollar-circle-line", color: "#10B981", bgColor: "#ECFDF5" },
  { name: "Health", icon: "ri-heart-pulse-line", color: "#EF4444", bgColor: "#FEF2F2" },
  { name: "Entertainment", icon: "ri-gamepad-line", color: "#F59E0B", bgColor: "#FFFBEB" },
  { name: "Freelance", icon: "ri-briefcase-line", color: "#06B6D4", bgColor: "#ECFEFF" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Find or create a demo user (better-auth hashes passwords, so we create the user directly)
  let user = await prisma.user.findFirst({ where: { email: "demo@expenseiq.app" } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "demo@expenseiq.app",
        name: "Alex Johnson",
        emailVerified: true,
      },
    });
    console.log("✓ Created demo user:", user.email);
  } else {
    console.log("✓ Found existing demo user:", user.email);
  }

  // Delete existing data for this user to allow re-seeding
  await prisma.budget.deleteMany({ where: { userId: user.id } });
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });

  // Create categories
  const categories = await Promise.all(
    DEFAULT_CATEGORIES.map((cat) =>
      prisma.category.create({
        data: { ...cat, userId: user!.id, isDefault: true },
      })
    )
  );
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c]));
  console.log(`✓ Created ${categories.length} categories`);

  // Create user settings
  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, currency: "USD" },
  });

  // Create transactions across the last 6 months
  const now = new Date();
  const txData = [];

  for (let m = 5; m >= 0; m--) {
    const year = now.getMonth() - m < 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = ((now.getMonth() - m + 12) % 12);
    const d = (day: number) => new Date(year, month, day);

    txData.push(
      { title: "Monthly Salary", amount: 5500, type: "income" as const, categoryId: catMap["Salary"].id, date: d(1), notes: "Salary deposit" },
      { title: "Grocery Store", amount: 124.5, type: "expense" as const, categoryId: catMap["Food & Dining"].id, date: d(2) },
      { title: "Netflix", amount: 15.99, type: "expense" as const, categoryId: catMap["Entertainment"].id, date: d(2) },
      { title: "Uber Ride", amount: 22.4, type: "expense" as const, categoryId: catMap["Transport"].id, date: d(3) },
      { title: "Electric Bill", amount: 89.0, type: "expense" as const, categoryId: catMap["Bills & Utilities"].id, date: d(4) },
      { title: "Restaurant Dinner", amount: 67.8, type: "expense" as const, categoryId: catMap["Food & Dining"].id, date: d(5) },
      { title: "Amazon Purchase", amount: 145.99, type: "expense" as const, categoryId: catMap["Shopping"].id, date: d(5) },
      { title: "Gym Membership", amount: 49.99, type: "expense" as const, categoryId: catMap["Health"].id, date: d(6) },
      { title: "Internet Bill", amount: 59.99, type: "expense" as const, categoryId: catMap["Bills & Utilities"].id, date: d(6) },
      { title: "Coffee Shop", amount: 18.5, type: "expense" as const, categoryId: catMap["Food & Dining"].id, date: d(7) },
      { title: "Bus Pass", amount: 35.0, type: "expense" as const, categoryId: catMap["Transport"].id, date: d(8) },
      { title: "Clothing Store", amount: 210.0, type: "expense" as const, categoryId: catMap["Shopping"].id, date: d(10) },
      { title: "Doctor Visit", amount: 75.0, type: "expense" as const, categoryId: catMap["Health"].id, date: d(12) },
      { title: "Spotify Premium", amount: 9.99, type: "expense" as const, categoryId: catMap["Entertainment"].id, date: d(14) },
    );

    // Add freelance income some months
    if (m % 2 === 0) {
      txData.push({
        title: "Freelance Project",
        amount: 850,
        type: "income" as const,
        categoryId: catMap["Freelance"].id,
        date: d(15),
        notes: "Web design project",
      });
    }
  }

  await prisma.transaction.createMany({
    data: txData.map((t) => ({ ...t, userId: user!.id })),
  });
  console.log(`✓ Created ${txData.length} transactions`);

  // Create budgets for current month
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const budgetData = [
    { categoryId: catMap["Food & Dining"].id, amount: 400 },
    { categoryId: catMap["Transport"].id, amount: 150 },
    { categoryId: catMap["Bills & Utilities"].id, amount: 200 },
    { categoryId: catMap["Shopping"].id, amount: 300 },
    { categoryId: catMap["Health"].id, amount: 150 },
    { categoryId: catMap["Entertainment"].id, amount: 100 },
  ];

  for (const b of budgetData) {
    await prisma.budget.upsert({
      where: { userId_categoryId_month_year: { userId: user.id, categoryId: b.categoryId, month: currentMonth, year: currentYear } },
      update: { amount: b.amount },
      create: { userId: user.id, ...b, month: currentMonth, year: currentYear },
    });
  }
  console.log(`✓ Created ${budgetData.length} budgets`);

  console.log("\n✅ Seed complete!");
  console.log("   Demo account: demo@expenseiq.app");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
