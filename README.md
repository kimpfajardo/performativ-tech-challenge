# 🧠 Performativ Tech Challenge

This is my submission for the **Performativ Frontend Technical Assessment**. The project is a responsive interface that fetches data from the provided API resource.

- Live demo: https://performativ-tech-challenge-tzhv.vercel.app
- Video demo: https://drive.google.com/file/d/166-rNx93M97uYQLhuWhXBWG8-uruwrab/view?usp=sharing
---

## ✨ Features

- Transaction Page - CRUD methods for transactions, Toggle between table and grid view and improved pagination
- Performance Page - Interactive line chart, filter by dates (from and to) and a graphical summary for a specific timeseries point
- Holdings Page - Interactive Pie Chart, Summary stat cards and navigation through the holding data tree on both list view and pie chart
  
---

## 🧱 Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zod** – schema validation for API responses
- **clsx** – for conditional class management
- **Lucide-react** – icon set
- **ShadCN UI** - for reusable components and charts

---

## 📂 Folder Structure

```
src/
├── app/                  # Next.js App Router structure (holdings, performance and transactions)
│   └── (dashboard)       # Root route with main UI
│       └── layout.tsx    # Layout and navigation common for 3 subpages
│       └── holdings
│           └── page.tsx  # Contains user assets and graphs
│       └── performance
│           └── page.tsx  # Contains timeseries data and graphs
│       └── transactions
│           └── page.tsx  # Contains user transactions and basic CRUD operations
├── components/           # Shared UI components (e.g., SearchInput, ResultItem)
├── lib/                  # Helpers and utilities (types, context, actions and hooks)
├── config/               # Third-party setups like axios
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/kimpfajardo/performativ-tech-challenge.git
cd performativ-tech-challenge
bun install
bun dev
```

Visit `http://localhost:3000` to use the app.

---

## 🙌 Thanks

Thanks to Performativ for the opportunity to work on this challenge. Looking forward to your feedback!

— **Kim Fajardo**
