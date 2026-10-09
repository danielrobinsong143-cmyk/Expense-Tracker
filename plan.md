# SpendWise Implementation Plan

## Scope

SpendWise is a frontend-only React/Vite expense tracker for personal finance. It will use LocalStorage rather than a backend, database, authentication service, or paid external API. The application will be fully interactive across Dashboard, Transactions, Add Transaction, Analytics, Budgets, Categories, and Settings, with React Router navigation and shared Context state.

## Implementation approach

- **Stack:** React + Vite, JavaScript ES6+, React Router DOM, Recharts, Lucide React, date-fns, and a lightweight toast library.
- **State:** `ExpenseContext` owns validated transactions, budgets, categories, preferences, and settings; a separate `ThemeContext` applies the persisted light/dark theme. Mutations update state first and persist only the changed SpendWise storage slice.
- **Storage:** `storageService.js` uses namespaced keys, a schema version, safe JSON parsing, shape validation, sensible defaults, and migration-ready envelopes. It never calls broad `localStorage.clear()` and handles unavailable/corrupt storage gracefully.
- **Calculations:** `utils/calculations.js` provides pure helpers for balances, period comparisons, category totals, budget progress, savings rate, chart series, and analytics. Expense budgets only use expense transactions.
- **Exports:** `services/exportService.js` creates filtered CSV exports and full JSON backups; imports are parsed and validated before any state or storage mutation.
- **Routing:** Routes cover `/`, `/transactions`, `/add-transaction`, `/analytics`, `/budgets`, `/categories`, and `/settings`; edit flows use a route query/id without duplicating form logic.
- **Forms and dialogs:** Controlled forms share validation helpers. Add/edit and destructive confirmation dialogs are reusable and keyboard accessible. Toast feedback communicates successful and failed mutations.
- **Demo data:** First launch initializes clearly marked sample data only when no SpendWise data exists. Settings can reload demo data or clear/reset it only after explicit confirmation.

## Project structure

```text
spendwise/
├── public/
│   └── manus-routes.json
├── src/
│   ├── components/
│   │   ├── layout/       # App shell, sidebar, topbar, mobile drawer
│   │   ├── common/       # Modal, EmptyState, StatCard, Toast, form controls
│   │   ├── dashboard/    # Charts, recent transactions, budget overview
│   │   ├── transactions/ # Form, filters, table/cards, pagination
│   │   ├── budgets/      # Budget form and progress cards
│   │   ├── analytics/    # Period controls and visualizations
│   │   └── categories/   # Category form/list and icon picker
│   ├── context/
│   │   ├── ExpenseContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/            # Shared responsive and derived-state hooks
│   ├── pages/            # Route-level screens
│   ├── services/         # LocalStorage and import/export boundaries
│   ├── utils/            # Calculation, formatting, date and validation helpers
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── app.config.ts
├── package.json
└── vite.config.js
```

## Visual and interaction direction

- **Design movement:** editorial fintech dashboard—quiet, premium, and data-first rather than a generic admin grid.
- **Core principles:** clarity before decoration; progressive disclosure for dense financial data; trustworthy states and copy; comfortable touch targets and keyboard paths.
- **Color philosophy:** deep indigo is the dependable SpendWise anchor; cool slate surfaces keep the interface calm; emerald, coral, and amber are reserved for financial meaning, not decoration. Dark mode shifts surfaces to blue-black while preserving semantic contrast.
- **Layout paradigm:** a persistent left rail frames a spacious, asymmetric content canvas. The dashboard begins with a compact financial snapshot, then alternates wide analytical panels with focused supporting cards.
- **Signature elements:** a small indigo “pulse” mark in the wordmark; rounded metric cards with a thin accent edge; category dots and progress tracks reused consistently in lists, charts, and budgets.
- **Interaction philosophy:** every control gives visible feedback, filters remain composable, destructive actions explain consequences, and empty states provide the next useful action.
- **Animation:** 160–220ms ease-out transitions for surfaces, drawers, tabs, progress bars, and modal entry; no distracting looping motion. Chart and list updates should feel immediate.
- **Typography system:** system UI sans stack for reliable performance, with strong numeric hierarchy, compact eyebrow labels, and sentence-case headings. Monetary values use tabular numerals where supported.
- **Brand essence:** a calm command center for everyday money decisions; **clear, composed, dependable**.
- **Brand voice:** concise, encouraging, and factual. Example microcopy: “Your money, in focus.” and “You’re within this month’s plan.”
- **Wordmark/logo:** “SpendWise” paired with a small indigo pulse/ledger mark built from CSS shapes and Lucide geometry, not a plain text-only logo.
- **Signature brand color:** `#5146E5`, a vivid indigo that reads as confident in light mode and luminous in dark mode.

## Responsive behavior

Desktop uses a sticky rail and two-column analytical composition. Tablet collapses the rail into a compact drawer while preserving chart/card relationships. Mobile uses a bottom-safe drawer trigger, stacked cards, horizontally scrollable tab/filter groups where needed, compact transaction cards instead of tables, and touch-friendly form controls. Charts use `ResponsiveContainer` and accessible summary tables or text alternatives.

## Build and verification workflow

1. Create the Vite app files and install the pinned dependencies.
2. Register JavaScript/CSS diagnostics through the managed Webdev runtime before the first code batch.
3. Implement storage, models, pure calculations, context, routing, and the shell.
4. Implement dashboard and charts, then transaction CRUD and filters.
5. Implement analytics, budgets, categories, and settings/import/export/reset.
6. Add the route manifest and project metadata.
7. Run the production build, inspect diagnostics, and exercise the acceptance flows with deterministic sample data and code-level checks.
8. Start the preview server on the configured port, verify HTTP readiness and `/manus-routes.json`, and inspect browser-visible behavior only where needed.
9. Commit the finished files to the managed canonical repository so the version is checkpointed.

## Constraints and decisions

- Currency defaults to INR while allowing INR, USD, EUR, and GBP.
- No comparison percentage is shown when a prior period is unavailable; the UI uses a neutral “No comparison data” state.
- Categories in use cannot be silently deleted; the UI requires reassignment or blocks deletion with an explanation.
- Invalid imports never replace current data.
- Reset deletes only SpendWise keys after a two-step confirmation.
- The implementation will prioritize complete working behavior over decorative imagery; no external image assets are needed for this internal dashboard.
