# Income Tracker - Full-Stack Web Application

A comprehensive, production-ready income tracking system built with **FastAPI**, **React**, and **PostgreSQL**.

## Overview

Income Tracker is a sophisticated financial management application that automatically calculates and tracks your income, savings, and emergency funds. It provides powerful reporting tools with monthly and yearly summaries, data visualization, and export capabilities.

### Key Features

✅ **User Authentication**

- Secure JWT-based auth
- Password hashing with bcrypt
- Refresh token mechanism

✅ **Income Management**

- Create, read, update, delete income entries
- Automatic savings & emergency fund allocation
- Historical accuracy (no retroactive changes)

✅ **Ipon Module**

- Aggregates savings and emergency funds
- Monthly and yearly views
- Pure aggregation (no calculations)

✅ **Dashboard**

- Real-time financial overview
- Summary cards (Total Income, Savings, Emergency)
- Charts and data visualization
- Month and year views

✅ **Reporting**

- Monthly breakdowns
- Yearly summaries
- Export to CSV/Excel
- Detailed transaction history

✅ **Settings**

- Configurable savings percentage
- Configurable emergency fund percentage
- Settings apply to new entries only

✅ **Responsive Design**

- Mobile-first approach
- Tailwind CSS styling
- Works on all devices
- Accessible UI

---

## Technology Stack

### Backend

- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy / SQLModel
- **Authentication**: JWT (python-jose)
- **Validation**: Pydantic
- **Async**: Uvicorn

### Frontend

- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP**: Axios
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Build**: Vite

### DevOps

- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Database**: PostgreSQL (self-hosted or managed)

---

## Project Structure

```
Income Tracker/
│
├── backend/                          # FastAPI application
│   ├── app/
│   │   ├── api/v1/endpoints/        # Route handlers
│   │   │   ├── auth.py
│   │   │   ├── income.py
│   │   │   ├── settings.py
│   │   │   └── dashboard.py
│   │   ├── core/                    # Security & exceptions
│   │   │   ├── security.py
│   │   │   └── exceptions.py
│   │   ├── db/                      # Database
│   │   │   ├── models.py
│   │   │   └── session.py
│   │   ├── schemas/                 # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── income.py
│   │   │   └── settings.py
│   │   ├── services/                # Business logic
│   │   │   ├── auth.py
│   │   │   ├── income.py
│   │   │   ├── settings.py
│   │   │   └── dashboard.py
│   │   ├── main.py                  # App initialization
│   │   └── config.py                # Configuration
│   ├── tests/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                         # React application
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── income/
│   │   │   ├── ipon/
│   │   │   ├── year/
│   │   │   ├── settings/
│   │   │   └── common/
│   │   ├── pages/                   # Page components
│   │   ├── context/                 # State management
│   │   │   ├── AuthContext.jsx
│   │   │   ├── IncomeContext.jsx
│   │   │   └── SettingsContext.jsx
│   │   ├── hooks/                   # Custom hooks
│   │   ├── utils/                   # Utilities
│   │   │   ├── api.js
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   ├── styles/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── docker-compose.yml
│
├── 01_DATABASE_SCHEMA.sql            # PostgreSQL schema
├── 02_API_ENDPOINTS.md               # API documentation
├── 03_BACKEND_STRUCTURE.md           # Backend architecture
├── 04_FRONTEND_STRUCTURE.md          # Frontend architecture
├── 05_IMPLEMENTATION_GUIDE.md        # Step-by-step implementation
├── 06_UIUXDesign.md                  # UI/UX specifications
│
├── QUICKSTART.md                     # Quick setup guide
├── README.md                         # This file
└── LICENSE
```

---

## Core Architecture Principles

### 1. Financial Data Integrity

**Critical Rule: Once saved, income records NEVER change automatically**

When a user creates an income entry:

1. Current `ipon_settings` percentages are read
2. `savings_amount` and `emergency_amount` are calculated ONCE
3. All three values are stored permanently
4. These values NEVER recalculate, even if percentages change

### 2. Ipon Module Pattern

The Ipon Module is **pure aggregation only**:

- Uses `SUM()` SQL queries exclusively
- Never recalculates stored values
- Provides monthly and yearly views
- Zero business logic

Example query:

```sql
SELECT
  SUM(savings_amount) as total_savings,
  SUM(emergency_amount) as total_emergency
FROM income
WHERE user_id = ? AND date BETWEEN ? AND ?
```

### 3. Settings Apply Forward Only

Percentage changes only affect NEW entries:

- Changing settings doesn't update historical records
- Historical data remains financially accurate
- Users can track actual past behavior
- Percentage history visible in records (implicit)

### 4. API Design

RESTful with proper HTTP semantics:

- `POST` - Create new resource
- `GET` - Retrieve resource(s)
- `PUT` - Update existing resource
- `DELETE` - Remove resource
- Proper status codes (201, 404, 401, etc.)

---

## Database Schema Highlights

### Key Tables

**users**

- UUID primary key
- Email, username (unique)
- Password hash (bcrypt)
- Timestamps

**ipon_settings**

- One-to-one relationship with users
- Configurable percentages (0-100)
- Applied only to new entries

**income**

- UUID primary key
- Foreign key to users
- Pre-calculated `savings_amount` and `emergency_amount`
- Indexed on (user_id, date) for fast queries
- Immutable computed values

### Key Constraints

```sql
-- Financial amounts must be non-negative
CHECK (amount >= 0 AND savings_amount >= 0 AND emergency_amount >= 0)

-- Percentages must be valid
CHECK (savings_percentage >= 0 AND savings_percentage <= 100)
```

---

## API Overview

### Authentication Flow

```
User → Register → Login → Access Token + Refresh Token
            ↓
User → Make Requests (with Bearer Token)
            ↓
If Token Expired → Refresh Token → New Access Token
```

### Core Endpoints

#### Income Management

```
POST   /api/income                  Create entry
GET    /api/income                  List entries (paginated, filterable)
GET    /api/income/{id}             Get single entry
PUT    /api/income/{id}             Update entry
DELETE /api/income/{id}             Delete entry
```

#### Settings

```
GET    /api/settings/ipon           Get current percentages
PUT    /api/settings/ipon           Update percentages
```

#### Dashboard (Aggregation)

```
GET    /api/dashboard/summary       Overall totals
GET    /api/dashboard/monthly/{y}/{m}  Monthly breakdown
GET    /api/dashboard/yearly/{y}    Yearly breakdown
```

---

## Frontend Architecture

### State Management

**AuthContext**

- User data
- Access/refresh tokens
- Login/logout/register methods

**IncomeContext** (optional, if using Context API)

- Income entries list
- Filters and pagination
- CRUD operations
- Cache management

**SettingsContext**

- Ipon percentages
- Update method
- Loading state

### Component Hierarchy

```
App
├── Navbar
├── Sidebar
├── Routes
│   ├── LoginPage
│   │   └── LoginForm
│   ├── RegisterPage
│   │   └── RegisterForm
│   ├── DashboardPage
│   │   ├── SummaryCards
│   │   └── Charts
│   ├── IncomePage
│   │   ├── IncomeForm (create/edit)
│   │   ├── FilterPanel
│   │   └── IncomeTable
│   ├── IponPage
│   │   ├── SummaryCards
│   │   ├── Trends Chart
│   │   └── BreakdownTable
│   ├── YearPage
│   │   ├── YearSelector
│   │   ├── YearChart
│   │   └── MonthlyBreakdown
│   ├── SettingsPage
│   │   ├── PercentageSettings
│   │   └── ExportOptions
│   └── ProtectedRoute (with auth guard)
└── Footer
```

### Key Hooks

- `useAuth()` - Authentication state and methods
- `useIncome()` - Income CRUD and list management
- `useSettings()` - Ipon settings management
- `useFetch()` - Generic API data fetching with caching
- `useLocalStorage()` - Persistent client-side state

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Git

### Quick Setup (5 minutes)

```bash
# 1. Clone repository
git clone <repo>
cd income-tracker

# 2. Setup database
createdb income_tracker
psql -d income_tracker -f 01_DATABASE_SCHEMA.sql

# 3. Setup and run backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "DATABASE_URL=postgresql://user:pass@localhost/income_tracker
SECRET_KEY=your-secret-key" > .env
python -m uvicorn app.main:app --reload

# 4. Setup and run frontend (new terminal)
cd frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
npm run dev

# 5. Access
Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs
Frontend: http://localhost:5173
```

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

---

## Implementation Guide

The project includes a comprehensive [Implementation Guide](05_IMPLEMENTATION_GUIDE.md) with:

- ✅ Phase 1: Project Setup
- ✅ Phase 2: Backend Implementation
- ✅ Phase 3: Frontend Implementation
- ✅ Phase 4: Testing & Deployment
- ✅ Phase 5: Production Deployment

Each phase includes:

- Step-by-step instructions
- Code examples
- Best practices
- Configuration files

---

## Documentation Files

| File                                                     | Purpose                                                   |
| -------------------------------------------------------- | --------------------------------------------------------- |
| [01_DATABASE_SCHEMA.sql](01_DATABASE_SCHEMA.sql)         | PostgreSQL schema with tables, indexes, and triggers      |
| [02_API_ENDPOINTS.md](02_API_ENDPOINTS.md)               | Complete API documentation with request/response examples |
| [03_BACKEND_STRUCTURE.md](03_BACKEND_STRUCTURE.md)       | Backend folder structure and architecture                 |
| [04_FRONTEND_STRUCTURE.md](04_FRONTEND_STRUCTURE.md)     | Frontend folder structure and organization                |
| [05_IMPLEMENTATION_GUIDE.md](05_IMPLEMENTATION_GUIDE.md) | Complete step-by-step implementation guide                |
| [06_UIUXDesign.md](06_UIUXDesign.md)                     | UI/UX specifications and component layouts                |
| [QUICKSTART.md](QUICKSTART.md)                           | Quick setup guide and common commands                     |
| [README.md](README.md)                                   | This file                                                 |

---

## Deployment Options

### Frontend

- **Vercel** (Recommended): `vercel deploy`
- **Netlify**: Connect GitHub repo
- **AWS S3 + CloudFront**: Static hosting
- **Self-hosted**: Docker container

### Backend

- **Render** or **Railway**: Git-connected auto-deployment
- **DigitalOcean** or **AWS EC2**: Docker + Docker Compose
- **AWS Lambda**: Serverless (requires refactoring)

### Database

- **Supabase**: Managed PostgreSQL (recommended)
- **Neon**: Serverless PostgreSQL
- **AWS RDS**: Managed database service
- **Self-hosted**: PostgreSQL in Docker

### Example: Full Docker Deployment

```bash
docker-compose up -d
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
# Database: localhost:5432
```

---

## Security Considerations

✅ **Implemented**

- Password hashing (bcrypt)
- JWT token authentication
- CORS configuration
- SQL injection prevention (SQLAlchemy ORM)
- XSS protection (React escaping)
- CSRF protection (SameSite cookies)

⚠️ **Production Checklist**

- [ ] Change SECRET_KEY
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for specific domains
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Setup logging and monitoring
- [ ] Regular database backups
- [ ] Security headers (HSTS, CSP)
- [ ] OWASP compliance
- [ ] Regular dependency updates

---

## Testing

### Backend

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test
pytest tests/test_income.py
```

### Frontend

```bash
# Setup test environment
npm install --save-dev @testing-library/react vitest

# Run tests
npm run test
```

---

## Performance Optimization

### Database

- Indexes on (user_id, date) for fast queries
- Query optimization with SUM aggregations
- Connection pooling with SQLAlchemy
- Pagination for large datasets (limit 100)

### Frontend

- React code splitting with Vite
- Lazy loading images
- API response caching
- localStorage for settings
- Virtual scrolling for large tables

### Backend

- Async/await for non-blocking I/O
- Database query optimization
- Proper pagination
- Response compression
- Caching headers for static assets

---

## Monitoring & Logging

Recommended setup:

- **Logging**: Python logging + ELK Stack
- **Monitoring**: Prometheus + Grafana
- **APM**: New Relic or Datadog
- **Error Tracking**: Sentry
- **Uptime Monitoring**: UptimeRobot
- **Database**: pgAdmin for PostgreSQL

---

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

### Code Standards

- Backend: PEP 8 with Black formatter
- Frontend: ESLint + Prettier
- Tests: Minimum 80% coverage
- Documentation: Inline comments + README updates

---

## Roadmap

### Phase 1: MVP ✅

- [x] User authentication
- [x] Income CRUD
- [x] Ipon settings
- [x] Dashboard
- [x] Reports

### Phase 2: Enhancements 🚀

- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Budget planning
- [ ] Bill reminders
- [ ] Multi-currency support
- [ ] Data import (CSV)

### Phase 3: Enterprise 📦

- [ ] Team/family accounts
- [ ] Role-based access control
- [ ] Audit logs
- [ ] Two-factor authentication
- [ ] Advanced integrations (banking APIs)
- [ ] Real-time sync across devices

---

## Troubleshooting

### Backend Issues

**Database Connection Error**

```bash
# Verify database is running
psql -U postgres -d income_tracker -c "SELECT 1"

# Check .env DATABASE_URL
# Reset connection: DROP DATABASE income_tracker; CREATE DATABASE income_tracker;
```

**Port 8000 Already in Use**

```bash
# Use different port
python -m uvicorn app.main:app --port 8001
```

**Import Errors**

```bash
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**API Not Responding**

- Verify backend is running: http://localhost:8000/health
- Check .env VITE_API_BASE_URL
- Check browser console for CORS errors
- Verify Authorization header is being sent

**Tailwind Styles Not Applied**

```bash
npm install
npm run dev  # Full rebuild
```

See [QUICKSTART.md](QUICKSTART.md#troubleshooting) for more solutions.

---

## Support & Resources

- **Documentation**: See individual markdown files
- **API Testing**: Swagger UI at `http://localhost:8000/docs`
- **Code Examples**: See [Implementation Guide](05_IMPLEMENTATION_GUIDE.md)
- **Architecture**: See structure documentation files

### External Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## License

MIT License - See LICENSE file for details

```
MIT License

Copyright (c) 2026 Income Tracker Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Changelog

### v1.0.0 - April 5, 2026

- Initial release
- Core features implemented
- Full API documentation
- Comprehensive UI/UX design
- Complete implementation guide
- Production-ready code

---

## Credits & Acknowledgments

Built with modern web technologies and best practices.

Special thanks to:

- FastAPI community
- React community
- PostgreSQL team
- Tailwind CSS team

---

## Contact & Questions

For questions, issues, or suggestions:

1. Check [QUICKSTART.md](QUICKSTART.md) for common issues
2. Review API documentation in [02_API_ENDPOINTS.md](02_API_ENDPOINTS.md)
3. See implementation details in [05_IMPLEMENTATION_GUIDE.md](05_IMPLEMENTATION_GUIDE.md)

---

**Happy Tracking! 🎉**

Build your financial freedom with Income Tracker.
