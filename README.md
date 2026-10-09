# SpendWise Expense Tracker

A responsive React + Vite personal finance dashboard with transaction CRUD, analytics, budgets, categories, charts, LocalStorage persistence, CSV export, and JSON backup/import.

## Requirements

- Node.js 18 or newer (Node.js 20 LTS or newer recommended)
- npm (the project uses the lockfile for reproducible installs)

## Run on Windows

1. Extract the ZIP file to a folder such as `C:\Projects\SpendWise`.
2. Open PowerShell in the extracted folder.
3. Install dependencies:

   ```powershell
   npm install
   ```

4. Start the development server:

   ```powershell
   npm run dev
   ```

5. Open the local URL shown by Vite, usually `http://localhost:3000/`.

The Vite server is configured to listen on all interfaces so it can also be opened from another device on your local network when appropriate.

## Production build

Create an optimized production build:

```powershell
npm run build
```

To preview the production build locally:

```powershell
npm run preview
```

## Included functionality

- Dashboard with live balance, income, expenses, savings rate, budgets, and Recharts visualizations
- Transaction add, edit, delete, search, filters, sorting, pagination, and CSV export
- Analytics with period controls, category distribution, and spending trends
- Monthly and category budgets with normal, warning, and exceeded states
- Default and custom income/expense categories
- Light/dark theme and INR/USD/EUR/GBP currency preferences
- LocalStorage persistence under namespaced `spendwise:` keys
- CSV export and validated JSON backup/import
- Safe two-step reset workflow

## Data and privacy

This is a frontend-only application. It does not require a backend, database, login, or external API key. Transactions, budgets, categories, and preferences are stored in the browser's LocalStorage. Use **Settings → Export application data** to create a JSON backup before moving to another browser or clearing site data.

## Project structure

```text
src/
  App.jsx                    Application shell, routes, pages, forms, charts
  main.jsx                   React entry point and providers
  index.css                  Responsive light/dark design system
  context/ExpenseContext.jsx Shared state and persistence actions
  services/storageService.js LocalStorage model and safe storage helpers
  services/exportService.js  CSV and JSON export helpers
  utils/calculations.js      Pure financial calculations and chart series
  utils/demoData.js          Optional realistic sample dataset
public/
  manus-routes.json          Managed preview route manifest
package.json                 Scripts and dependencies
package-lock.json            Locked dependency versions
vite.config.js               Vite configuration
app.config.ts                Managed project metadata
index.html                   HTML entry point
```

## Notes

- Do not copy `node_modules` between machines; run `npm install` after extraction.
- The project intentionally contains no secrets or environment-specific credentials.
