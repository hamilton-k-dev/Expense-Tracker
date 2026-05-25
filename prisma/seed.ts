import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { hashPassword } from "@better-auth/utils/password";
import { config } from "dotenv";
import ws from "ws";

config({ path: ".env" });
neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { key: "alimentation", name: "Alimentation",          icon: "ri-restaurant-line",          color: "#F97316", bgColor: "#FFF7ED" },
  { key: "transport",    name: "Transport",              icon: "ri-car-line",                 color: "#3B82F6", bgColor: "#EFF6FF" },
  { key: "logement",     name: "Logement & Factures",   icon: "ri-home-line",                color: "#8B5CF6", bgColor: "#F5F3FF" },
  { key: "shopping",     name: "Shopping",               icon: "ri-shopping-bag-line",        color: "#EC4899", bgColor: "#FDF2F8" },
  { key: "salaire",      name: "Salaire",                icon: "ri-money-dollar-circle-line", color: "#10B981", bgColor: "#ECFDF5" },
  { key: "sante",        name: "Santé",                  icon: "ri-heart-pulse-line",         color: "#EF4444", bgColor: "#FEF2F2" },
  { key: "loisirs",      name: "Loisirs",                icon: "ri-gamepad-line",             color: "#F59E0B", bgColor: "#FFFBEB" },
  { key: "prestations",  name: "Prestations",            icon: "ri-briefcase-line",           color: "#06B6D4", bgColor: "#ECFEFF" },
];

type TxDef = {
  title: string;
  amount: number;
  type: "income" | "expense";
  key: string;
  day: number;
  notes?: string;
};

function buildMonth(upToDay: number, extra: TxDef[] = []): TxDef[] {
  const d = (day: number) => day;

  const base: TxDef[] = [
    // ── Income ──────────────────────────────────────────────────────────
    { title: "Salaire NET",              amount: 280_000, type: "income",  key: "salaire",      day: d(28), notes: "Virement ORANGE BUSINESS" },
    // ── Logement & factures ─────────────────────────────────────────────
    { title: "Loyer appartement Melen",  amount:  65_000, type: "expense", key: "logement",     day: d(1)  },
    { title: "Canal+ Evasion",           amount:  14_500, type: "expense", key: "logement",     day: d(4)  },
    { title: "MTN forfait mensuel",      amount:   7_500, type: "expense", key: "logement",     day: d(5)  },
    { title: "ENEO Cameroun",            amount:  13_500, type: "expense", key: "logement",     day: d(6)  },
    { title: "Facture CDE eau",          amount:   6_200, type: "expense", key: "logement",     day: d(8)  },
    // ── Alimentation ────────────────────────────────────────────────────
    { title: "Marché du Mfoundi",        amount:  32_000, type: "expense", key: "alimentation", day: d(3)  },
    { title: "Alimentation quartier",    amount:  18_500, type: "expense", key: "alimentation", day: d(11) },
    { title: "Supermarché Casino",       amount:  24_000, type: "expense", key: "alimentation", day: d(17) },
    { title: "Marché course hebdo",      amount:  22_000, type: "expense", key: "alimentation", day: d(24) },
    // ── Restaurant ──────────────────────────────────────────────────────
    { title: "Maquis La Détente",        amount:  12_500, type: "expense", key: "alimentation", day: d(9)  },
    { title: "Restaurant Fokou",         amount:   9_800, type: "expense", key: "alimentation", day: d(21) },
    // ── Transport ───────────────────────────────────────────────────────
    { title: "Carburant Total Bastos",   amount:  14_000, type: "expense", key: "transport",    day: d(7)  },
    { title: "Moto-taxi quotidien",      amount:  10_500, type: "expense", key: "transport",    day: d(15) },
    { title: "Taxi Express Yaoundé",     amount:   8_000, type: "expense", key: "transport",    day: d(22) },
  ];

  // Filter to upToDay (for current month)
  const filtered = [...base, ...extra].filter((tx) => tx.day <= upToDay);
  return filtered;
}

async function main() {
  console.log("🌱 Seeding database — profil Cameroun...");

  let user = await prisma.user.findFirst({ where: { email: "jb.fotso@gmail.com" } });
  if (!user) {
    user = await prisma.user.create({
      data: { email: "jb.fotso@gmail.com", name: "Jean-Baptiste Fotso", emailVerified: true },
    });
    console.log("✓ Utilisateur créé :", user.email);
  } else {
    console.log("✓ Utilisateur existant :", user.email);
  }

  // Upsert credential account with hashed password
  const hashed = await hashPassword("Cameroun2025!");
  await prisma.account.upsert({
    where: { id: user.id + "_credential" },
    update: { password: hashed },
    create: {
      id: user.id + "_credential",
      accountId: user.id,
      providerId: "credential",
      userId: user.id,
      password: hashed,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log("✓ Mot de passe défini : Cameroun2025!");

  await prisma.budget.deleteMany({ where: { userId: user.id } });
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });

  const createdCats = await Promise.all(
    CATEGORIES.map((c) =>
      prisma.category.create({
        data: { name: c.name, icon: c.icon, color: c.color, bgColor: c.bgColor, isDefault: true, userId: user!.id },
      })
    )
  );
  const cat = Object.fromEntries(createdCats.map((c, i) => [CATEGORIES[i].key, c]));
  console.log(`✓ ${createdCats.length} catégories créées`);

  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: { currency: "XAF" },
    create: { userId: user.id, currency: "XAF" },
  });

  const now = new Date();
  const allTx: Array<{ title: string; amount: number; type: "income" | "expense"; categoryId: string; date: Date; notes?: string; userId: string }> = [];

  // ── 12 months of data ──────────────────────────────────────────────────
  const monthsConfig: Array<{ extra?: TxDef[]; salaryBonus?: number; eneoBump?: number }> = [
    // Month 0 — 11 months ago (June 2025): freelance mission
    {
      extra: [
        { title: "Prestation développement web",   amount: 75_000, type: "income",  key: "prestations", day: 14, notes: "Client MTN Cameroun" },
        { title: "Brasseries du Cameroun",          amount:  8_500, type: "expense", key: "loisirs",     day: 18 },
        { title: "Bar le Coin Sympa",               amount:  6_000, type: "expense", key: "loisirs",     day: 26 },
      ],
    },
    // Month 1 — 10 months ago (July 2025): forte chaleur → ENEO plus élevé, habits
    {
      extra: [
        { title: "ENEO Cameroun (surconsommation)", amount: 18_500, type: "expense", key: "logement",     day: 6,  notes: "Climatiseur saison sèche" },
        { title: "Boutique Mahima Nlongkak",        amount: 38_500, type: "expense", key: "shopping",     day: 13 },
        { title: "Boulangerie La Fournée",          amount:  3_500, type: "expense", key: "alimentation", day: 20 },
        { title: "Brasseries du Cameroun",          amount:  9_500, type: "expense", key: "loisirs",      day: 27 },
      ],
    },
    // Month 2 — 9 months ago (August 2025): rentrée approche, dépenses santé
    {
      extra: [
        { title: "Pharmacie de la Paix",            amount: 14_500, type: "expense", key: "sante",        day: 8  },
        { title: "Consultation Dr. Abeng",          amount: 22_000, type: "expense", key: "sante",        day: 12, notes: "Consultation généraliste" },
        { title: "Achat fournitures bureau",        amount: 18_000, type: "expense", key: "shopping",     day: 19 },
        { title: "Orange Money recharge",           amount:  5_000, type: "expense", key: "logement",     day: 23 },
      ],
    },
    // Month 3 — 8 months ago (September 2025): RENTRÉE SCOLAIRE — gros mois de dépenses
    {
      extra: [
        { title: "Frais de scolarité fils aîné",   amount: 95_000, type: "expense", key: "shopping",     day: 2,  notes: "Institut Saint-Jean Yaoundé" },
        { title: "Fournitures scolaires",           amount: 32_500, type: "expense", key: "shopping",     day: 5  },
        { title: "Tenues scolaires enfants",        amount: 28_000, type: "expense", key: "shopping",     day: 7  },
        { title: "Carrefour Market Nlongkak",       amount: 22_500, type: "expense", key: "alimentation", day: 14 },
        { title: "Prime rentrée scolaire",          amount: 50_000, type: "income",  key: "salaire",      day: 3,  notes: "Prime employeur rentrée" },
        { title: "Transport scolaire",              amount: 15_000, type: "expense", key: "transport",    day: 10 },
      ],
    },
    // Month 4 — 7 months ago (October 2025): mission freelance + mois normal
    {
      extra: [
        { title: "Prestation infra réseau",         amount: 90_000, type: "income",  key: "prestations",  day: 10, notes: "Mission CAMTEL 10 jours" },
        { title: "Pharmacie Ndamvout",              amount:  8_500, type: "expense", key: "sante",        day: 18 },
        { title: "Brasseries du Cameroun",          amount: 11_000, type: "expense", key: "loisirs",      day: 25 },
        { title: "Librairie des Arts",              amount:  7_500, type: "expense", key: "shopping",     day: 29 },
      ],
    },
    // Month 5 — 6 months ago (November 2025): préparation fin d'année, shopping
    {
      extra: [
        { title: "Centre Acropole Yaoundé",         amount: 45_500, type: "expense", key: "shopping",     day: 8,  notes: "Cadeaux Noël anticipés" },
        { title: "Carrefour Market Bastos",         amount: 19_500, type: "expense", key: "alimentation", day: 16 },
        { title: "Cinéma Wouri",                   amount:  7_500, type: "expense", key: "loisirs",      day: 22 },
        { title: "Restaurant La Terrasse",          amount: 18_000, type: "expense", key: "alimentation", day: 28 },
      ],
    },
    // Month 6 — 5 months ago (December 2025): FÊTES — mois exceptionnel de dépenses
    {
      extra: [
        { title: "Prime de fin d'année",            amount: 70_000, type: "income",  key: "salaire",      day: 5,  notes: "13e mois employeur" },
        { title: "Marché viande Noël",              amount: 55_000, type: "expense", key: "alimentation", day: 22, notes: "Mouton + volaille fêtes" },
        { title: "Cadeaux enfants Noël",            amount: 65_000, type: "expense", key: "shopping",     day: 23 },
        { title: "Soirée 31 décembre",              amount: 28_000, type: "expense", key: "loisirs",      day: 31, notes: "Réveillon famille" },
        { title: "Voyage Bafoussam famille",        amount: 35_000, type: "expense", key: "transport",    day: 24, notes: "Car rapide famille" },
        { title: "Habits fêtes",                   amount: 42_000, type: "expense", key: "shopping",     day: 18 },
        { title: "ENEO Cameroun (déco + fêtes)",    amount: 19_000, type: "expense", key: "logement",     day: 6  },
      ],
    },
    // Month 7 — 4 months ago (January 2026): bilan, santé, résolutions
    {
      extra: [
        { title: "Consultation médecin généraliste",amount: 18_000, type: "expense", key: "sante",        day: 5  },
        { title: "Pharmacie bilan de santé",        amount: 12_500, type: "expense", key: "sante",        day: 8,  notes: "Analyses sanguines" },
        { title: "Inscription salle de sport",      amount: 25_000, type: "expense", key: "sante",        day: 10, notes: "Résolution Nouvel An" },
        { title: "Brasseries du Cameroun",          amount:  7_000, type: "expense", key: "loisirs",      day: 20 },
      ],
    },
    // Month 8 — 3 months ago (February 2026): Saint-Valentin
    {
      extra: [
        { title: "Prestation audit système",        amount: 60_000, type: "income",  key: "prestations",  day: 7,  notes: "Mission entreprise privée" },
        { title: "Restaurant Dîner Saint-Valentin", amount: 35_000, type: "expense", key: "alimentation", day: 14, notes: "Saint-Valentin" },
        { title: "Cadeau Saint-Valentin",           amount: 22_000, type: "expense", key: "shopping",     day: 13 },
        { title: "Carrefour Market Bastos",         amount: 21_000, type: "expense", key: "alimentation", day: 19 },
      ],
    },
    // Month 9 — 2 months ago (March 2026): préparation Pâques, habits
    {
      extra: [
        { title: "Marché Pâques provisions",        amount: 42_000, type: "expense", key: "alimentation", day: 25, notes: "Viande + vivres fêtes" },
        { title: "Vêtements Pâques enfants",        amount: 38_500, type: "expense", key: "shopping",     day: 20 },
        { title: "Pharmacie de la Paix",            amount:  9_500, type: "expense", key: "sante",        day: 11 },
        { title: "Bar Le Coin Sympa",               amount:  8_000, type: "expense", key: "loisirs",      day: 29 },
      ],
    },
    // Month 10 — 1 month ago (April 2026): Pâques, freelance
    {
      extra: [
        { title: "Prestation développement app",    amount: 85_000, type: "income",  key: "prestations",  day: 3,  notes: "Application mobile client" },
        { title: "Célébration Pâques famille",      amount: 32_000, type: "expense", key: "alimentation", day: 5,  notes: "Repas de Pâques" },
        { title: "Voyage Kribi week-end",           amount: 55_000, type: "expense", key: "transport",    day: 19, notes: "Vacances plage famille" },
        { title: "Restaurant au Bord de la Mer",    amount: 18_500, type: "expense", key: "alimentation", day: 20 },
        { title: "Brasseries du Cameroun",          amount: 10_000, type: "expense", key: "loisirs",      day: 26 },
      ],
    },
    // Month 11 — current month (May 2026): up to today ~day 25
    {
      extra: [
        { title: "Fête du Travail sortie",          amount: 14_000, type: "expense", key: "loisirs",      day: 1,  notes: "1er mai fête du Travail" },
        { title: "Pharmacie Ndamvout",              amount:  7_500, type: "expense", key: "sante",        day: 8  },
        { title: "Boutique Mahima Nlongkak",        amount: 28_000, type: "expense", key: "shopping",     day: 12 },
        { title: "Restaurant Fokou déjeuner",       amount: 11_500, type: "expense", key: "alimentation", day: 17 },
        { title: "Carburant Tradex Ekounou",        amount: 15_000, type: "expense", key: "transport",    day: 20 },
      ],
    },
  ];

  for (let i = 0; i < 12; i++) {
    const monthsBack = 11 - i;
    const refDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
    const year = refDate.getFullYear();
    const month = refDate.getMonth(); // 0-indexed
    const isCurrentMonth = monthsBack === 0;
    const upToDay = isCurrentMonth ? now.getDate() : 31;

    const { extra = [] } = monthsConfig[i];

    // Override the base ENEO with month-specific amount where needed
    const txDefs = buildMonth(upToDay, extra);

    for (const tx of txDefs) {
      const maxDay = new Date(year, month + 1, 0).getDate();
      const dayToUse = Math.min(tx.day, maxDay);
      allTx.push({
        title: tx.title,
        amount: tx.amount,
        type: tx.type,
        categoryId: cat[tx.key].id,
        date: new Date(year, month, dayToUse),
        notes: tx.notes,
        userId: user!.id,
      });
    }
  }

  await prisma.transaction.createMany({ data: allTx });
  console.log(`✓ ${allTx.length} transactions créées`);

  // ── Budgets for current month ──────────────────────────────────────────
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const budgets = [
    { key: "alimentation", amount: 120_000 },
    { key: "transport",    amount:  45_000 },
    { key: "logement",     amount: 110_000 },
    { key: "shopping",     amount:  60_000 },
    { key: "sante",        amount:  30_000 },
    { key: "loisirs",      amount:  25_000 },
  ];

  for (const b of budgets) {
    await prisma.budget.upsert({
      where: { userId_categoryId_month_year: { userId: user.id, categoryId: cat[b.key].id, month: currentMonth, year: currentYear } },
      update: { amount: b.amount },
      create: { userId: user.id, categoryId: cat[b.key].id, amount: b.amount, month: currentMonth, year: currentYear },
    });
  }
  console.log(`✓ ${budgets.length} budgets créés`);

  console.log("\n✅ Seed terminé !");
  console.log("   Compte demo : jb.fotso@gmail.com");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
