# Income Tracker - Quick Start Guide

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Git

---

## 5-Minute Setup

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb income_tracker

# Load schema
psql -U postgres -d income_tracker -f 01_DATABASE_SCHEMA.sql
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=postgresql://username:password@localhost:5432/income_tracker
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30" > .env

# Run the server
python -m uvicorn app.main:app --reload
```

**Backend running at:** `http://localhost:8000`
**API Docs at:** `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env

# Start development server
npm run dev
```

**Frontend running at:** `http://localhost:5173`

---

## Project Structure Quick Reference

```
Income Tracker/
├── backend/
│   └── app/
│       ├── api/v1/endpoints/    (API routes)
│       ├── core/                 (Security, exceptions)
│       ├── db/                   (Database models)
│       ├── schemas/              (Pydantic schemas)
│       └── services/             (Business logic)
│
├── frontend/
│   └── src/
│       ├── components/           (React components)
│       ├── pages/                (Page components)
│       ├── context/              (State management)
│       ├── hooks/                (Custom hooks)
│       └── utils/                (Helper functions)
│
├── 01_DATABASE_SCHEMA.sql
├── 02_API_ENDPOINTS.md
├── 03_BACKEND_STRUCTURE.md
├── 04_FRONTEND_STRUCTURE.md
├── 05_IMPLEMENTATION_GUIDE.md
└── 06_UIUXDesign.md
```

---

## Key API Endpoints

### Authentication

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get access token
- `POST /api/auth/refresh` - Refresh token

### Income

- `POST /api/income` - Create income entry
- `GET /api/income` - List income entries
- `PUT /api/income/{id}` - Update entry
- `DELETE /api/income/{id}` - Delete entry

### Settings

- `GET /api/settings/ipon` - Get percentages
- `PUT /api/settings/ipon` - Update percentages

### Dashboard

- `GET /api/dashboard/summary` - Overall summary
- `GET /api/dashboard/monthly/{year}/{month}` - Monthly data
- `GET /api/dashboard/yearly/{year}` - Yearly data

---

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "john_doe",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Create income (replace TOKEN with actual token)
curl -X POST http://localhost:8000/api/income \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "source": "Salary",
    "year": 2026,
    "month": 4,
    "day": 5,
    "date": "2026-04-05",
    "notes": "Monthly salary"
  }'
```

### Using Swagger UI

Navigate to `http://localhost:8000/docs` and use the interactive API documentation.

---

## Development Workflow

### Backend Development

1. **Create new endpoint:**
   - Add route in `app/api/v1/endpoints/`
   - Add schema in `app/schemas/`
   - Add service logic in `app/services/`

2. **Database changes:**

   ```bash
   # Create migration
   alembic revision --autogenerate -m "Description"

   # Apply migration
   alembic upgrade head
   ```

3. **Testing:**
   ```bash
   pytest
   pytest --cov=app
   ```

### Frontend Development

1. **Create new component:**

   ```bash
   # Create component file
   src/components/feature/NewComponent.jsx

   # Import and use in pages
   ```

2. **State management:**
   - Use Context API for global state
   - Custom hooks for logic reuse
   - localStorage for persistence

3. **Styling:**
   - Use Tailwind classes
   - Mobile-first approach
   - Check responsive design

---

## Common Commands

### Backend

```bash
# Start server
python -m uvicorn app.main:app --reload

# Run specific test
pytest tests/test_income.py

# Install new package
pip install package_name
pip freeze > requirements.txt

# Create migration
alembic revision --autogenerate -m "message"
alembic upgrade head
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

---

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/income_tracker
SQLALCHEMY_ECHO=True

# JWT
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Server
DEBUG=True
LOG_LEVEL=INFO
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Income Tracker
```

---

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**

```bash
# Use different port
python -m uvicorn app.main:app --port 8001 --reload
```

**Database connection error:**

```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Test connection: psql connection_string
```

**Import errors:**

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**Port 5173 already in use:**

```bash
npm run dev -- --port 3000
```

**API endpoints not responding:**

- Verify backend is running on http://localhost:8000
- Check VITE_API_BASE_URL in .env
- Check browser console for CORS errors

**Tailwind styles not applying:**

```bash
# Rebuild Tailwind
npx tailwindcss -i ./src/styles/tailwind.css -o ./dist/output.css
```

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up database
3. ✅ Configure environment variables
4. ✅ Start backend and frontend
5. ✅ Test with API documentation
6. 📝 Implement core features
7. 🎨 Customize UI
8. 🧪 Run tests
9. 📦 Build for production
10. 🚀 Deploy

---

## Production Checklist

Before deploying:

- [ ] Change SECRET_KEY to random string
- [ ] Set DEBUG=False
- [ ] Configure CORS origins
- [ ] Use managed database (Supabase/Neon)
- [ ] Set up SSL/HTTPS
- [ ] Configure logging
- [ ] Add rate limiting
- [ ] Set up monitoring
- [ ] Run security checks
- [ ] Test all endpoints
- [ ] Set up CI/CD
- [ ] Configure backups

---

## Support Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/
- SQLAlchemy: https://www.sqlalchemy.org/
- Tailwind CSS: https://tailwindcss.com/
- Postgres Docs: https://www.postgresql.org/docs/

---

## License

MIT License - Feel free to use for personal/commercial projects

---

## Questions?

Refer to the detailed documentation:

- **API Details**: `02_API_ENDPOINTS.md`
- **Backend Architecture**: `03_BACKEND_STRUCTURE.md`
- **Frontend Architecture**: `04_FRONTEND_STRUCTURE.md`
- **Full Implementation**: `05_IMPLEMENTATION_GUIDE.md`
- **UI/UX Design**: `06_UIUXDesign.md`

Happy building! 🚀
