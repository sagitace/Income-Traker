# Frontend Project Structure

## Folder Organization

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── index.jsx              # Entry point
│   ├── App.jsx                # Root component
│   ├── App.css
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SummaryCard.jsx
│   │   │   ├── MonthlyChart.jsx
│   │   │   └── YearlyChart.jsx
│   │   │
│   │   ├── income/
│   │   │   ├── IncomeList.jsx
│   │   │   ├── IncomeForm.jsx
│   │   │   ├── IncomeTable.jsx
│   │   │   └── IncomeItem.jsx
│   │   │
│   │   ├── ipon/
│   │   │   ├── IponModule.jsx
│   │   │   ├── SavingsChart.jsx
│   │   │   ├── EmergencyChart.jsx
│   │   │   └── IponSummary.jsx
│   │   │
│   │   ├── settings/
│   │   │   ├── IponSettings.jsx
│   │   │   └── SettingsForm.jsx
│   │   │
│   │   ├── year/
│   │   │   ├── YearModule.jsx
│   │   │   ├── YearlyBreakdown.jsx
│   │   │   └── MonthlyBreakdownTable.jsx
│   │   │
│   │   └── reports/
│   │       ├── ExportOptions.jsx
│   │       └── ExportButton.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── IncomePage.jsx
│   │   ├── IponPage.jsx
│   │   ├── YearPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state
│   │   ├── IncomeContext.jsx   # Income data state
│   │   └── SettingsContext.jsx # Settings state
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useIncome.js
│   │   ├── useSettings.js
│   │   ├── useFetch.js
│   │   └── useLocalStorage.js
│   │
│   ├── utils/
│   │   ├── api.js              # Axios instance & API calls
│   │   ├── formatters.js       # Number/date formatting
│   │   ├── validators.js       # Form validation
│   │   └── constants.js        # App constants
│   │
│   ├── styles/
│   │   ├── tailwind.css        # Tailwind config
│   │   ├── index.css           # Global styles
│   │   └── variables.css       # CSS variables
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js (or webpack.config.js)
└── README.md
```

---

## Key Files Description

### Components

#### `common/`

- **Navbar.jsx**: Top navigation with user menu
- **Sidebar.jsx**: Navigation menu (mobile-responsive)
- **LoadingSpinner.jsx**: Loading state indicator
- **ErrorBoundary.jsx**: Error handling wrapper

#### `auth/`

- **ProtectedRoute.jsx**: Guards routes requiring authentication

#### `dashboard/`

- **Dashboard.jsx**: Main dashboard container
- **SummaryCard.jsx**: Quick stats cards
- **MonthlyChart.jsx**: Bar/line chart for monthly data
- **YearlyChart.jsx**: Chart for yearly trends

#### `income/`

- **IncomeForm.jsx**: Form for adding/editing income (only amount, source, date, notes)
- **IncomeTable.jsx**: Table displaying income entries
- **IncomeList.jsx**: List view with filters

#### `ipon/`

- **IponModule.jsx**: Main container
- **SavingsChart.jsx**: Visualization of savings data
- **EmergencyChart.jsx**: Visualization of emergency fund data
- **IponSummary.jsx**: Aggregated totals display

#### `settings/`

- **IponSettings.jsx**: Settings management UI
- **SettingsForm.jsx**: Form for updating percentages

#### `year/`

- **YearModule.jsx**: Main container
- **YearlyBreakdown.jsx**: Year overview
- **MonthlyBreakdownTable.jsx**: Detailed monthly table

#### `reports/`

- **ExportOptions.jsx**: Export format selection
- **ExportButton.jsx**: Trigger CSV/Excel export

### Hooks

- **useAuth.js**: Authentication logic
- **useIncome.js**: Income CRUD operations
- **useSettings.js**: Settings management
- **useFetch.js**: Generic API calls
- **useLocalStorage.js**: Persistent state

### Utilities

- **api.js**: Axios instance with auth headers, base URL
- **formatters.js**: Currency, date formatting
- **validators.js**: Form validation rules

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.11.0",
    "axios": "^1.4.0",
    "tailwindcss": "^3.3.0",
    "chart.js": "^4.2.0",
    "react-chartjs-2": "^5.2.0",
    "react-icons": "^4.8.0"
  },
  "devDependencies": {
    "vite": "^4.3.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## State Management Architecture

### AuthContext

- User data
- Auth tokens
- Login/logout methods
- Current user

### IncomeContext

- Income entries
- Filters
- CRUD operations
- Pagination

### SettingsContext

- Current ipon percentages
- Update settings
- Loading state

---

## Responsive Design

- Mobile-first approach with Tailwind CSS
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Sidebar collapses on mobile
- Forms stack vertically on small screens
- Charts adapt to container width
