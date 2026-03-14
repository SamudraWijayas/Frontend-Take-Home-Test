# Test Billing SaaS Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-blue?logo=tailwind)](https://tailwindcss.com)

A modern invoicing and customer management dashboard built with Next.js App Router. Features include customer listings, invoice CRUD (create/read/update/view), dashboard with revenue charts and summary cards, using mock data.

## 🚀 Local Setup & Run

### Prerequisites

- Node.js 20+ (recommended)
- npm/yarn/pnpm

### Quick Start

```bash
cd my-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) – Dashboard loads automatically.

### NPM Scripts

| Script          | Description            |
| --------------- | ---------------------- |
| `npm run dev`   | Start dev server (HMR) |
| `npm run build` | Production build       |
| `npm run start` | Run built app          |
| `npm run lint`  | Lint code with ESLint  |

## 📱 Key Features & Routes

- **Dashboard** `/` – Revenue charts (Recharts), summary cards, recent invoices table.
- **Customers** `/customers` – List & detail view.
- **Invoices** `/invoices` – List, detail, new invoice form.
- Dark mode toggle (Tailwind).
- Responsive UI components.

## 🛠 Tech Stack

| Category      | Tech                              | Version   | Purpose                           |
| ------------- | --------------------------------- | --------- | --------------------------------- |
| Framework     | Next.js (App Router)              | 16.1.6    | SSR/SSG, routing, optimization    |
| UI            | React                             | 19.2.3    | Components                        |
| Styling       | Tailwind CSS                      | 4         | Utility-first CSS, dark mode      |
| Forms         | React Hook Form + Zod + Resolvers | 7.x / 4.x | Type-safe validation              |
| Data Fetching | TanStack Query (React Query)      | 5.90      | Caching, sync, optimistic updates |
| Tables        | TanStack Table                    | 8.21      | Sorting, filtering, pagination    |
| Charts        | Recharts                          | 3.8       | Revenue/dashboard visuals         |
| State         | Zustand                           | 5.0       | Lightweight global state          |
| Icons         | Lucide React                      | 0.577     | SVG icons                         |
| Types         | TypeScript                        | 5         | Type safety                       |
| Lint          | ESLint + Next config              | 9         | Code quality                      |

**Dev Deps**: `@tailwindcss/postcss`, `@types/*`.

## 🤔 Why This Stack?

- **Next.js 16 App Router**: Modern routing, server components/actions for better perf/SEO. Chosen for full-stack capabilities without extra setup.
- **React Query + TanStack Table**: Handles complex data flows (invoices/customers sync) efficiently. Query for API mocking/real backend integration.
- **React Hook Form + Zod**: Schema validation prevents form errors; integrates seamlessly with TypeScript.
- **Tailwind v4**: Fast prototyping, consistent design system, built-in dark mode for pro dashboard feel.
- **Recharts/Zustand**: Lightweight for charts/state; avoids heavy alternatives like Redux.

## ⚠️ Challenges

1. **Data Synchronization**: Balancing React Query caching with Zustand UI state – solved with query invalidation on mutations.
2. **Table Performance**: TanStack Table handles 1000+ rows with virtualization, but large datasets need debounced search.
3. **Form Complexity**: Multi-step invoice creation (customer select + items) with Zod – challenging validation chaining.
4. **Mock to Production**: Current mock data (`src/mocks/data.ts`); real API integration requires service updates (`src/service/invoice.service.ts`).
5. **Dark Mode**: Tailwind class strategy ensures seamless toggle without layout shifts.

## 📝 Next Steps

- Replace mocks with real backend (e.g., Supabase/Stripe).
- Add auth (NextAuth).
- Deploy: Vercel (one-click from GitHub).

Built with ❤️ using Next.js create-next-app template.
