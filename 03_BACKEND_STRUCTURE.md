# Backend Project Structure

## Folder Organization

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Configuration settings
│   ├── dependencies.py         # Shared dependencies
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── endpoints/
│   │       │   ├── __init__.py
│   │       │   ├── auth.py     # Authentication routes
│   │       │   ├── income.py   # Income CRUD routes
│   │       │   ├── settings.py # Ipon settings routes
│   │       │   ├── dashboard.py # Dashboard routes
│   │       │   └── reports.py  # Export/Reports routes
│   │       └── router.py       # Main router combining all endpoints
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py         # JWT, password hashing
│   │   ├── exceptions.py       # Custom exceptions
│   │   └── constants.py        # App constants
│   │
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py          # Database session management
│   │   ├── base.py             # Base model for ORM models
│   │   └── models.py           # SQLAlchemy ORM models
│   │
│   ├── migrations/             # Alembic migrations folder
│   │   ├── alembic.ini
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py             # User Pydantic schemas
│   │   ├── income.py           # Income Pydantic schemas
│   │   ├── settings.py         # Settings Pydantic schemas
│   │   ├── dashboard.py        # Dashboard Pydantic schemas
│   │   └── common.py           # Shared schemas (pagination, responses)
│   │
│   └── services/
│       ├── __init__.py
│       ├── auth.py             # Authentication business logic
│       ├── income.py           # Income operations
│       ├── settings.py         # Settings operations
│       ├── dashboard.py        # Dashboard calculations
│       └── reports.py          # Report generation
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py             # Pytest fixtures
│   ├── test_auth.py
│   ├── test_income.py
│   ├── test_settings.py
│   └── test_dashboard.py
│
├── .env                        # Environment variables
├── .env.example               # Example environment file
├── .gitignore
├── requirements.txt           # Python dependencies
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Key Files Description

### `app/main.py`

- Creates FastAPI application instance
- Includes middleware (CORS, request logging)
- Mounts API routers
- Health check endpoint

### `app/config.py`

- Database URL
- JWT settings (secret key, algorithm, expiration)
- Environment variables
- Application settings

### `app/core/security.py`

- Password hashing and verification
- JWT token creation and verification
- Current user dependency

### `app/db/models.py`

- SQLAlchemy ORM models for:
  - User
  - IponSettings
  - Income

### `app/db/session.py`

- Database connection management
- Session factory
- Dependency injection for sessions

### `app/schemas/`

- Request/response validation
- Type hints for API documentation
- Data transformation

### `app/services/`

- Business logic
- Database operations
- Calculations (income entry with computed savings/emergency amounts)
- Aggregations (Ipon module using SUM queries only)

### `app/api/v1/endpoints/`

- Route handlers
- Parameter validation
- Response formatting

---

## Dependencies Installation

```bash
pip install fastapi
pip install uvicorn
pip install sqlalchemy
pip install sqlmodel
pip install pydantic
pip install pydantic-settings
pip install alembic
pip install psycopg2-binary
pip install python-jose
pip install python-multipart
pip install bcrypt
pip install pytest
pip install httpx
pip install openpyxl
pip install python-csv
pip install python-dotenv
```

Or use the provided `requirements.txt`
