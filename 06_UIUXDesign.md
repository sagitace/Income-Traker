# UI/UX Design Document

## Design System

### Color Palette

- **Primary**: #2563EB (Blue)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Orange)
- **Danger**: #EF4444 (Red)
- **Neutral**: #6B7280 (Gray)
- **Background**: #F9FAFB (Light Gray)

### Typography

- Headings: 16px (H4) to 32px (H1), Bold (700)
- Body: 14px Regular, Line height 1.5
- Small: 12px, Color: #6B7280

### Spacing

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### Border Radius

- sm: 4px
- md: 8px
- lg: 12px

---

## Page Layouts

### 1. Login Page

```
┌─────────────────────────────────────┐
│         Income Tracker              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │   Welcome Back              │   │
│  │                             │   │
│  │   Email: [_____________]    │   │
│  │                             │   │
│  │   Password: [_____________] │   │
│  │                             │   │
│  │   [ Login ]                 │   │
│  │                             │   │
│  │   Don't have an account?    │   │
│  │   [Sign Up]                 │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Components:**

- Form card (centered)
- Email input field
- Password input field
- Login button
- Register link
- Error messages
- Loading state

---

### 2. Dashboard Page

```
┌──────────────────────────────────────────────────────┐
│ ☰ Income Tracker    Menu Items...    👤 Profile  ✕  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Dashboard > Home                                   │
│                                                      │
│  ┌────────────────┐ ┌────────────────┐ ┌──────────┐ │
│  │ Total Income   │ │ Total Savings  │ │ Emergency│ │
│  │ $25,000.00     │ │ $5,000.00      │ │ $2500.00 │ │
│  └────────────────┘ └────────────────┘ └──────────┘ │
│                                                      │
│  Recent Transactions (Last 5)                        │
│  ┌──────────────────────────────────────────────────┐│
│  │ Date    │ Source │ Amount   │ Savings │ Emergency│
│  ├──────────────────────────────────────────────────┤│
│  │ 2026-04-05 │ Salary │ +5000 │ +1000   │ +500   │
│  │ 2026-04-01 │ Freelance │ +2000 │ +400   │ +200   │
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  Charts (Monthly & Yearly)                           │
│  ┌─────────────────────┐ ┌─────────────────────┐   │
│  │ Monthly Trend       │ │ Yearly Comparison   │   │
│  │ [Chart Placeholder] │ │ [Chart Placeholder] │   │
│  └─────────────────────┘ └─────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Key Features:**

- Summary cards (Income, Savings, Emergency)
- Recent transactions table
- Charts for trends
- Mobile-responsive grid

---

### 3. Income Module Page

```
┌──────────────────────────────────────────────────────┐
│ ☰ Income Tracker    Menu Items...    👤 Profile  ✕  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Income > Transactions                              │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ Add New Income Entry                             │ │
│  │                                                  │ │
│  │ Amount: [_____________]  Source: [____________] │ │
│  │                                                  │ │
│  │ Year: [2026 ▼]  Month: [04 ▼]  Day: [05 ▼]    │ │
│  │                                                  │ │
│  │ Notes (Optional): [_________________________]    │ │
│  │                                                  │ │
│  │                                      [ Add ]    │ │
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  Filter & Search                                     │
│  ┌──────────────────────────────────────────────────┐│
│  │ Source: [All ▼]  From: [__/__ ]  To: [__/__ ]  │ │
│  │                                    [Search]     │ │
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  Income Entries                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ Date    │ Source  │ Amount  │ Savings │ Emergency│
│  ├──────────────────────────────────────────────────┤│
│  │ 2026-04-05│ Salary  │ 5000   │ 1000    │ 500    │
│  │ 2026-04-01│ Freelance│ 2000  │ 400     │ 200    │
│  │ 2026-03-28│ Salary  │ 5000   │ 1000    │ 500    │
│  │                            [Edit] [Delete]     │
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  Pagination: [< Prev] 1 2 3 [Next >]               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Mobile View (Stacked):**

```
┌──────────────────────────┐
│ Add Income Entry         │
│                          │
│ Amount: [___________]    │
│ Source: [___________]    │
│ Year: [2026 ▼]          │
│ Month: [04 ▼]           │
│ Day: [05 ▼]             │
│ Notes: [__________]      │
│                          │
│  [      Add      ]       │
└──────────────────────────┘
```

**Components:**

- Mobile-friendly income form (dropdowns for Year/Month/Day)
- Responsive grid (1 column on mobile, 2+ on desktop)
- Filter panel (source, date range)
- Sortable table with all details
- Edit/Delete actions
- Pagination controls

---

### 4. Ipon Module (Savings & Emergency)

```
┌──────────────────────────────────────────────────────┐
│ ☰ Income Tracker    Menu Items...    👤 Profile  ✕  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Ipon > Savings & Emergency Fund                    │
│                                                      │
│  View By: [This Month ▼]                            │
│                                                      │
│  ┌─────────────────────┐       ┌─────────────────┐  │
│  │ Total Savings       │       │ Total Emergency │  │
│  │ $5,000.00           │       │ $2,500.00       │  │
│  │                     │       │                 │  │
│  │ 20% of Income       │       │ 10% of Income   │  │
│  └─────────────────────┘       └─────────────────┘  │
│                                                      │
│  ┌──────────────────────┐       ┌────────────────┐  │
│  │ Savings Trend        │       │ Emergency Fund │  │
│  │ [Chart]              │       │ [Chart]        │  │
│  │ Monthly breakdown    │       │ Monthly growth │  │
│  └──────────────────────┘       └────────────────┘  │
│                                                      │
│  Monthly Breakdown                                   │
│  ┌──────────────────────────────────────────────────┐│
│  │ Month  │ Savings │ Emergency │ Total Allocated  │
│  ├──────────────────────────────────────────────────┤│
│  │ Apr    │ 1000    │ 500       │ 1500            │
│  │ Mar    │ 1000    │ 500       │ 1500            │
│  │ Feb    │ 1000    │ 500       │ 1500            │
│  │ Jan    │ 1000    │ 500       │ 1500            │
│  └──────────────────────────────────────────────────┘│
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Key Features:**

- Summary cards (Savings & Emergency)
- Trend charts
- Monthly breakdown table
- View filters (This Month, Year, Custom Range)

---

### 5. Year Module

```
┌──────────────────────────────────────────────────────┐
│ ☰ Income Tracker    Menu Items...    👤 Profile  ✕  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Year > 2026 Summary                                │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │                                                  │ │
│  │ Total Year Income: $25,000                      │ │
│  │ Total Savings: $5,000   |  Total Emergency: $2.5k
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  ┌──────────────────────┐       ┌────────────────┐  │
│  │ Yearly Trend         │       │ Income vs      │  │
│  │ [Chart]              │       │ Savings        │  │
│  │ All months           │       │ [Chart]        │  │
│  └──────────────────────┘       └────────────────┘  │
│                                                      │
│  Monthly Breakdown Table                             │
│  ┌──────────────────────────────────────────────────┐│
│  │ Mo │ Income  │ Savings │ Emergency │ Total      │
│  ├──────────────────────────────────────────────────┤│
│  │ Jan│ 5000    │ 1000    │ 500       │ 1500      │
│  │ Feb│ 5000    │ 1000    │ 500       │ 1500      │
│  │ Mar│ 5000    │ 1000    │ 500       │ 1500      │
│  │ Apr│ 5000    │ 1000    │ 500       │ 1500      │
│  │ May│ 0       │ 0       │ 0         │ 0         │
│  │...                                               │
│  └──────────────────────────────────────────────────┘│
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Features:**

- Year selection
- Summary metrics
- Comparison charts
- Complete monthly breakdown
- Export options

---

### 6. Settings Page

```
┌──────────────────────────────────────────────────────┐
│ ☰ Income Tracker    Menu Items...    👤 Profile  ✕  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Settings > Ipon Configuration                      │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ Allocation Percentages                           │ │
│  │                                                  │ │
│  │ Savings Percentage: [__20__] %                  │ │
│  │ ▓▓▓▓▓ (20% allocation)                           │ │
│  │                                                  │ │
│  │ Emergency Fund %:   [__10__] %                  │ │
│  │ ▓▓ (10% allocation)                              │ │
│  │                                                  │ │
│  │ Note: Changes apply to new income entries only.  │ │
│  │       Historical records remain unchanged.       │ │
│  │                                                  │ │
│  │                              [Update] [Cancel]   │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ Account Settings                                 │ │
│  │                                                  │ │
│  │ Email: john@example.com                         │ │
│  │ [Change Email]                                   │ │
│  │                                                  │ │
│  │ Password: ••••••••••                             │ │
│  │ [Change Password]                                │ │
│  │                                                  │ │
│  │ [Delete Account]                                │ │
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ Data & Export                                    │ │
│  │                                                  │ │
│  │ [Export as CSV]  [Export as Excel]               │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘│
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Sections:**

- Ipon percentage settings with visual sliders
- Account management
- Data export options
- Informational notices

---

## Navigation Structure

### Sidebar Menu

```
┌─────────────────┐
│ Income Tracker  │
├─────────────────┤
│ 🏠 Dashboard    │
│ 💰 Income       │
│ 🏦 Ipon         │
│ 📊 Year Report  │
│ ⚙️  Settings     │
├─────────────────┤
│ 👤 Profile      │
│ 🚪 Logout       │
└─────────────────┘
```

### Breadcrumb Navigation

```
Home > Module > Section > Detail
Example: Home > Income > Transactions > View All
```

---

## Responsive Breakpoints

### Mobile (< 640px)

- Full-width layout
- Sidebar collapses to hamburger menu
- Single-column cards
- Simplified tables (rows stack)
- Bottom navigation bar

### Tablet (640px - 1024px)

- 2-column layout for cards
- Sidebar visible
- Readable tables
- Touch-friendly buttons (48px min)

### Desktop (> 1024px)

- Full sidebar
- Multi-column layouts
- Full tables
- Detailed charts

---

## Interactive Elements

### Buttons

```
Primary:    [  Blue Button ]
Secondary:  [  Gray Button ]
Danger:     [  Red Button  ]
Success:    [  Green Button]
States:     Normal, Hover, Active, Disabled
Min Height: 40px, Padding: 8px 16px
```

### Forms

- Spacing: 16px between fields
- Labels: 14px, above input
- Inputs: 40px height, 8px padding
- Validation: Real-time feedback
- Error states: Red text below field

### Tables

- Striped rows (alternating colors)
- Hover effect on rows
- Action buttons (Edit, Delete) on each row
- Pagination: 10-50 items per page
- Sortable columns

### Charts

- Responsive to container
- Margins: 16px
- Legend below chart
- Smooth animations
- Accessible color schemes

---

## Accessibility

✅ WCAG 2.1 AA Compliance

- Color contrast: 4.5:1 for text
- Alt text for all images
- Keyboard navigation support
- Focus indicators visible
- Semantic HTML
- Form labels connected to inputs
- Error messages descriptive

---

## Loading & Error States

### Loading

```
┌─────────────────────────────┐
│  ⟳ Loading...               │
│                             │
│  [Progress bar 30%]         │
└─────────────────────────────┘
```

### Error

```
┌─────────────────────────────┐
│ ⚠️  Something went wrong     │
│                             │
│ Failed to load data.        │
│ Please try again.           │
│                             │
│              [Retry]        │
└─────────────────────────────┘
```

### Empty State

```
┌─────────────────────────────┐
│                             │
│  📭  No Income Yet           │
│                             │
│  Get started by adding your │
│  first income entry.        │
│                             │
│      [Add Income]           │
└─────────────────────────────┘
```

---

## Motion & Animation

- Page transitions: 200ms fade
- Button hover: 100ms color change
- Chart animations: 500ms on load
- Dropdown menus: 150ms smooth
- Modals: 200ms slide + fade

---

## Dark Mode (Optional Future Enhancement)

If implementing dark mode:

- Background: #1F2937
- Text: #F9FAFB
- Cards: #374151
- Borders: #4B5563
