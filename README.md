# 💰 ExpenseIQ — Personal Finance Tracker

<img src="public/landing1.svg" alt="ExpenseIQ landing page" width="100%" />

A full-featured personal finance tracker built with Next.js 16, better-auth, Prisma 7, and Neon. Track income and expenses, set monthly budgets per category, visualize your finances with 6-month charts, and switch between French and English instantly — with first-class support for African currencies (XAF, XOF, NGN and more).

<div align="center">

🔗 **[Live Demo](https://expense-tracker-ppup.vercel.app/)** &nbsp;·&nbsp; 📖 **[Documentation](https://expense-tracker-ppup.vercel.app/docs)** &nbsp;·&nbsp; ⭐ **[GitHub](https://github.com/hamilton-k-dev/expense-tracker)**

</div>

---

## ✨ Features

- 💳 **Transaction tracking** — record income and expenses in seconds, filter by type and category
- 📊 **Visual reports** — 6-month income vs expenses chart, category breakdown donut, savings rate
- 🎯 **Monthly budgets** — set limits per category with colour-coded progress bars (green / amber / red)
- 🏷️ **Custom categories** — create categories with icon and accent colour
- 🌍 **Multi-currency** — 28+ currencies with locale-aware formatting (XAF, XOF, NGN, ZAR, EUR, USD…)
- 🌐 **Bilingual FR / EN** — full French and English interface, toggle without leaving the page
- 🔐 **Email & Password auth** — sign up, sign in, email verification, password reset
- 📧 **Transactional emails** — verification and reset emails via Resend
- 🗄️ **Prisma 7 + Neon** — serverless PostgreSQL with type-safe ORM
- 🌙 **Dark mode** — persisted in `localStorage`, toggled from the top bar

---

## 🧱 Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Framework      | Next.js 16 (App Router)      |
| Authentication | better-auth v1.6.11          |
| Database       | Neon (serverless PostgreSQL) |
| ORM            | Prisma 7                     |
| Validation     | Zod                          |
| Forms          | React Hook Form              |
| Emails         | Resend                       |
| Charts         | Recharts                     |
| Styling        | Tailwind CSS v4              |
| Icons          | RemixIcon 4.5 (CDN)          |

---

## 🖼️ Pages

### Landing

Public entry point — hero, feature cards, budget & currency highlights, pricing.

<img src="public/landing.webp" alt="Landing page" width="100%" />

### Login

Sign in with email + password. Includes forgot password link.

<img src="public/login.webp" alt="Login page" width="100%" />

### Register

Create a new account. Sends a verification email on sign up.

<img src="public/register.webp" alt="Register page" width="100%" />

### Dashboard

Financial overview — stat cards, 6-month income/expense chart, category breakdown, recent transactions.

<img src="public/dashboard.webp" alt="Dashboard" width="100%" />

### Transactions

Full transaction list with search, type filter and category filter. Edit or delete on hover.

<img src="public/transactions.webp" alt="Transactions" width="100%" />

### Budgets

Monthly budget cards per category with colour-coded progress bars and over/approaching alerts.

<img src="public/Budget.webp" alt="Budgets" width="100%" />

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Landing page (bilingual)
│   ├── docs/page.tsx                     # Documentation page (bilingual)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (protected)/
│   │   ├── layout.tsx                    # Session guard + AppShell
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── transactions/page.tsx
│   │       ├── categories/page.tsx
│   │       ├── budgets/page.tsx
│   │       ├── reports/page.tsx
│   │       └── settings/page.tsx
│   └── api/auth/[...all]/route.ts        # better-auth handler
├── components/
│   ├── layout/                           # AppShell, Sidebar, TopNav
│   ├── ui/                               # StatCard, BudgetCard, TransactionRow
│   ├── charts/                           # Recharts wrappers
│   ├── modals/                           # Transaction, Category, Budget modals
│   └── LandingLangToggle.tsx             # Public page language toggle
├── contexts/
│   └── UserPreferencesContext.tsx        # currency, language, t()
├── lib/
│   ├── auth.ts                           # better-auth server config
│   ├── auth-client.ts                    # better-auth browser client
│   ├── db.ts                             # Prisma + Neon adapter singleton
│   ├── i18n.ts                           # App translations (FR / EN)
│   ├── landing-i18n.ts                   # Landing & docs translations
│   ├── utils.ts                          # formatCurrency, formatDate
│   └── validations/
└── proxy.ts                              # Route protection (Next.js 16)
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/hamilton-k-dev/expense-tracker
cd expense-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

```env
# Auth
BETTER_AUTH_SECRET=""               # openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_TRUSTED_ORIGINS=""      # comma-separated extra origins if needed

# Database (Neon)
DATABASE_URL=""                     # pooled connection URL
DIRECT_URL=""                       # direct connection URL (for migrations)

# Email (Resend)
RESEND_API_KEY=""
EMAIL_FROM="onboarding@resend.dev"  # use your domain in production
```

### 4. Push the schema and generate the client

```bash
npx prisma db push
npx prisma generate
```

### 5. (Optional) Seed with demo data

Seeds a Cameroonian user (`jb.fotso@gmail.com` / `Cameroun2025!`) with 12 months of realistic XAF transactions and 6 budgets.

```bash
npx tsx prisma/seed.ts
```

### 6. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🌍 Internationalization

Language is stored in a `lang` cookie (values: `en` | `fr`). Toggling it triggers a full page reload so server components re-render with the new locale.

**Currency formatting by locale:**

| Locale  | Example       | Format                               |
| ------- | ------------- | ------------------------------------ |
| French  | `280 000 XAF` | amount · space separator · code last |
| English | `XAF 280,000` | code first · comma separator         |

The toggle is available on the landing page, docs page, and inside the app from **Settings → Language**.

---

## 🛡️ Route Protection (`src/proxy.ts`)

Route protection is enforced server-side via Next.js 16's `proxy.ts`:

```ts
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/reset-password",
  "/verify-email",
  "/docs",
];
const AUTH_ROUTES = ["/login", "/register"];
```

| Scenario                                          | Result                                  |
| ------------------------------------------------- | --------------------------------------- |
| Unauthenticated user visits a protected route     | Redirect to `/login?callbackUrl=<path>` |
| Authenticated user visits `/login` or `/register` | Redirect to `/dashboard`                |

---

## 🗺️ Routes

| Route                     | Access    | Description                 |
| ------------------------- | --------- | --------------------------- |
| `/`                       | Public    | Landing page                |
| `/docs`                   | Public    | Documentation               |
| `/login`                  | Public    | Sign in                     |
| `/register`               | Public    | Create account              |
| `/reset-password`         | Public    | Password reset              |
| `/dashboard`              | Protected | Financial overview          |
| `/dashboard/transactions` | Protected | Transaction list            |
| `/dashboard/categories`   | Protected | Category management         |
| `/dashboard/budgets`      | Protected | Monthly budgets             |
| `/dashboard/reports`      | Protected | 6-month charts & analytics  |
| `/dashboard/settings`     | Protected | Profile, currency, language |

---

## 📦 Key Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npx prisma generate  # Regenerate client after schema changes
npx prisma db push   # Push schema to DB (dev)
npm run studio       # Prisma Studio GUI
```

---

## 🚢 Production Checklist

- [ ] Set `BETTER_AUTH_URL` to your production domain
- [ ] Add production origin to `BETTER_AUTH_TRUSTED_ORIGINS`
- [ ] Generate a strong `BETTER_AUTH_SECRET` (`openssl rand -base64 32`)
- [ ] Verify your sending domain in Resend and update `EMAIL_FROM`
- [ ] Use Neon's pooled connection URL for `DATABASE_URL`
- [ ] Run `npx prisma migrate deploy` (not `db push`) for production migrations

---

## 📄 License

MIT
