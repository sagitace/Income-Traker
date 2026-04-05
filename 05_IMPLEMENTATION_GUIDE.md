# Income Tracker - Implementation Guide

## Phase 1: Project Setup (1-2 hours)

### Backend Setup

#### 1.1 Create Project Structure

```bash
mkdir backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or source venv/bin/activate  # Linux/Mac

# Install core dependencies
pip install fastapi uvicorn sqlalchemy sqlmodel pydantic pydantic-settings
pip install psycopg2-binary python-jose python-multipart bcrypt
pip install alembic pytest httpx python-dotenv openpyxl
pip freeze > requirements.txt
```

#### 1.2 Create `.env` file

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/income_tracker
SQLALCHEMY_ECHO=True

# JWT
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Server
DEBUG=True
LOG_LEVEL=INFO
```

#### 1.3 Initialize Database

```bash
# Create database in PostgreSQL
psql -U postgres
CREATE DATABASE income_tracker;
\q

# Run schema script
psql -U postgres -d income_tracker -f 01_DATABASE_SCHEMA.sql
```

---

### Frontend Setup

#### 1.4 Create React Project

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom axios tailwindcss postcss autoprefixer
npm install chart.js react-chartjs-2 react-icons
npx tailwindcss init -p
```

#### 1.5 Create `.env` file

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Income Tracker
```

---

## Phase 2: Backend Implementation (4-6 hours)

### 2.1 Configuration & Core Setup

#### File: `app/config.py`

```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    SQLALCHEMY_ECHO: bool = False

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # App
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
```

#### File: `app/core/security.py`

```python
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from app.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
settings = get_settings()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
```

### 2.2 Database Models

#### File: `app/db/models.py`

```python
from sqlalchemy import Column, String, Float, Date, DateTime, Boolean, Numeric, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    # Relationships
    ipon_settings = relationship("IponSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    income = relationship("Income", back_populates="user", cascade="all, delete-orphan")

class IponSettings(Base):
    __tablename__ = "ipon_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False, index=True)
    savings_percentage = Column(Numeric(5, 2), default=20.00, nullable=False)
    emergency_percentage = Column(Numeric(5, 2), default=10.00, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="ipon_settings")

class Income(Base):
    __tablename__ = "income"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    savings_amount = Column(Numeric(12, 2), nullable=False)
    emergency_amount = Column(Numeric(12, 2), nullable=False)
    source = Column(String(255), nullable=False)
    year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)
    day = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="income")

    # Indexes
    __table_args__ = (
        Index('idx_income_user_date', 'user_id', 'date'),
    )
```

### 2.3 Pydantic Schemas

#### File: `app/schemas/income.py`

```python
from pydantic import BaseModel, Field
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

class IncomeCreate(BaseModel):
    amount: Decimal = Field(..., gt=0)
    source: str = Field(..., min_length=1, max_length=255)
    year: int = Field(..., ge=2020, le=2099)
    month: int = Field(..., ge=1, le=12)
    day: int = Field(..., ge=1, le=31)
    date: date
    notes: Optional[str] = None

class IncomeUpdate(BaseModel):
    amount: Optional[Decimal] = Field(None, gt=0)
    source: Optional[str] = Field(None, min_length=1, max_length=255)
    year: Optional[int] = Field(None, ge=2020, le=2099)
    month: Optional[int] = Field(None, ge=1, le=12)
    day: Optional[int] = Field(None, ge=1, le=31)
    date: Optional[date] = None
    notes: Optional[str] = None

class IncomeResponse(BaseModel):
    id: str
    amount: Decimal
    savings_amount: Decimal
    emergency_amount: Decimal
    source: str
    year: int
    month: int
    day: int
    date: date
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class IncomeListResponse(BaseModel):
    items: list[IncomeResponse]
    total: int
    skip: int
    limit: int
```

#### File: `app/schemas/settings.py`

```python
from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal

class IponSettingsUpdate(BaseModel):
    savings_percentage: Decimal = Field(..., ge=0, le=100)
    emergency_percentage: Decimal = Field(..., ge=0, le=100)

class IponSettingsResponse(BaseModel):
    id: str
    user_id: str
    savings_percentage: Decimal
    emergency_percentage: Decimal
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

### 2.4 Service Layer (Business Logic)

#### File: `app/services/income.py`

```python
from sqlalchemy.orm import Session
from sqlalchemy import and_
from decimal import Decimal
from datetime import date
from uuid import UUID
from app.db.models import Income, IponSettings, User
from app.schemas.income import IncomeCreate, IncomeUpdate
from fastapi import HTTPException, status

class IncomeService:
    @staticmethod
    def create_income(
        db: Session,
        user_id: UUID,
        income_data: IncomeCreate
    ):
        """Create income entry with calculated savings/emergency amounts"""

        # Get current ipon settings
        settings = db.query(IponSettings).filter(
            IponSettings.user_id == user_id
        ).first()

        if not settings:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ipon settings not found"
            )

        # Calculate amounts based on current percentages
        savings_amount = income_data.amount * (settings.savings_percentage / 100)
        emergency_amount = income_data.amount * (settings.emergency_percentage / 100)

        # Create income record with pre-calculated values
        db_income = Income(
            user_id=user_id,
            amount=income_data.amount,
            savings_amount=savings_amount,
            emergency_amount=emergency_amount,
            source=income_data.source,
            year=income_data.year,
            month=income_data.month,
            day=income_data.day,
            date=income_data.date,
            notes=income_data.notes
        )

        db.add(db_income)
        db.commit()
        db.refresh(db_income)
        return db_income

    @staticmethod
    def get_income_list(
        db: Session,
        user_id: UUID,
        skip: int = 0,
        limit: int = 50,
        date_from: date = None,
        date_to: date = None,
        source: str = None
    ):
        """Get paginated income entries with optional filters"""
        query = db.query(Income).filter(Income.user_id == user_id)

        if date_from:
            query = query.filter(Income.date >= date_from)
        if date_to:
            query = query.filter(Income.date <= date_to)
        if source:
            query = query.filter(Income.source.ilike(f"%{source}%"))

        total = query.count()
        items = query.order_by(Income.date.desc()).offset(skip).limit(limit).all()

        return {"items": items, "total": total, "skip": skip, "limit": limit}

    @staticmethod
    def get_income_by_id(db: Session, user_id: UUID, income_id: UUID):
        """Get single income entry"""
        income = db.query(Income).filter(
            and_(Income.id == income_id, Income.user_id == user_id)
        ).first()

        if not income:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Income not found"
            )
        return income

    @staticmethod
    def update_income(
        db: Session,
        user_id: UUID,
        income_id: UUID,
        income_data: IncomeUpdate
    ):
        """Update income entry (recalculate amounts if needed)"""
        income = IncomeService.get_income_by_id(db, user_id, income_id)

        # Get current settings for recalculation
        settings = db.query(IponSettings).filter(
            IponSettings.user_id == user_id
        ).first()

        # Update fields
        if income_data.amount is not None:
            income.amount = income_data.amount
            # Recalculate amounts
            income.savings_amount = income_data.amount * (settings.savings_percentage / 100)
            income.emergency_amount = income_data.amount * (settings.emergency_percentage / 100)

        if income_data.source is not None:
            income.source = income_data.source
        if income_data.year is not None:
            income.year = income_data.year
        if income_data.month is not None:
            income.month = income_data.month
        if income_data.day is not None:
            income.day = income_data.day
        if income_data.date is not None:
            income.date = income_data.date
        if income_data.notes is not None:
            income.notes = income_data.notes

        db.commit()
        db.refresh(income)
        return income

    @staticmethod
    def delete_income(db: Session, user_id: UUID, income_id: UUID):
        """Delete income entry"""
        income = IncomeService.get_income_by_id(db, user_id, income_id)
        db.delete(income)
        db.commit()
```

#### File: `app/services/settings.py`

```python
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.models import IponSettings, User
from app.schemas.settings import IponSettingsUpdate
from fastapi import HTTPException, status

class SettingsService:
    @staticmethod
    def get_or_create_settings(db: Session, user_id: UUID):
        """Get settings or create with defaults"""
        settings = db.query(IponSettings).filter(
            IponSettings.user_id == user_id
        ).first()

        if not settings:
            settings = IponSettings(
                user_id=user_id,
                savings_percentage=20.00,
                emergency_percentage=10.00
            )
            db.add(settings)
            db.commit()
            db.refresh(settings)

        return settings

    @staticmethod
    def update_settings(
        db: Session,
        user_id: UUID,
        settings_data: IponSettingsUpdate
    ):
        """Update ipon settings"""
        settings = SettingsService.get_or_create_settings(db, user_id)

        settings.savings_percentage = settings_data.savings_percentage
        settings.emergency_percentage = settings_data.emergency_percentage

        db.commit()
        db.refresh(settings)
        return settings
```

#### File: `app/services/dashboard.py`

```python
from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID
from datetime import date
from app.db.models import Income

class DashboardService:
    @staticmethod
    def get_summary(db: Session, user_id: UUID):
        """Get overall financial summary - aggregation only, no calculation"""
        result = db.query(
            func.sum(Income.amount).label('total_income'),
            func.sum(Income.savings_amount).label('total_savings'),
            func.sum(Income.emergency_amount).label('total_emergency'),
            func.count(Income.id).label('entries_count')
        ).filter(Income.user_id == user_id).first()

        return {
            "total_income": float(result.total_income or 0),
            "total_savings": float(result.total_savings or 0),
            "total_emergency": float(result.total_emergency or 0),
            "entries_count": result.entries_count or 0
        }

    @staticmethod
    def get_monthly_summary(db: Session, user_id: UUID, year: int, month: int):
        """Get monthly summary - pure aggregation"""
        from datetime import datetime

        start_date = date(year, month, 1)
        if month == 12:
            end_date = date(year + 1, 1, 1)
        else:
            end_date = date(year, month + 1, 1)

        income_entries = db.query(Income).filter(
            Income.user_id == user_id,
            Income.date >= start_date,
            Income.date < end_date
        ).all()

        result = db.query(
            func.sum(Income.amount).label('total_income'),
            func.sum(Income.savings_amount).label('total_savings'),
            func.sum(Income.emergency_amount).label('total_emergency'),
            func.count(Income.id).label('entries_count')
        ).filter(
            Income.user_id == user_id,
            Income.date >= start_date,
            Income.date < end_date
        ).first()

        return {
            "year": year,
            "month": month,
            "total_income": float(result.total_income or 0),
            "total_savings": float(result.total_savings or 0),
            "total_emergency": float(result.total_emergency or 0),
            "entries_count": result.entries_count or 0,
            "entries": income_entries
        }

    @staticmethod
    def get_yearly_summary(db: Session, user_id: UUID, year: int):
        """Get yearly summary with monthly breakdown"""
        monthly_breakdown = []

        for month in range(1, 13):
            start_date = date(year, month, 1)
            if month == 12:
                end_date = date(year + 1, 1, 1)
            else:
                end_date = date(year, month + 1, 1)

            result = db.query(
                func.sum(Income.amount).label('total_income'),
                func.sum(Income.savings_amount).label('total_savings'),
                func.sum(Income.emergency_amount).label('total_emergency')
            ).filter(
                Income.user_id == user_id,
                Income.date >= start_date,
                Income.date < end_date
            ).first()

            monthly_breakdown.append({
                "month": month,
                "income": float(result.total_income or 0),
                "savings": float(result.total_savings or 0),
                "emergency": float(result.total_emergency or 0)
            })

        # Overall yearly totals
        yearly_result = db.query(
            func.sum(Income.amount).label('total_income'),
            func.sum(Income.savings_amount).label('total_savings'),
            func.sum(Income.emergency_amount).label('total_emergency')
        ).filter(
            Income.user_id == user_id,
            Income.date >= date(year, 1, 1),
            Income.date < date(year + 1, 1, 1)
        ).first()

        return {
            "year": year,
            "total_income": float(yearly_result.total_income or 0),
            "total_savings": float(yearly_result.total_savings or 0),
            "total_emergency": float(yearly_result.total_emergency or 0),
            "monthly_breakdown": monthly_breakdown
        }
```

### 2.5 API Routes

#### File: `app/api/v1/endpoints/income.py`

```python
from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date
from app.db.session import get_db
from app.core.security import get_current_user
from app.services.income import IncomeService
from app.schemas.income import IncomeCreate, IncomeUpdate, IncomeResponse, IncomeListResponse

router = APIRouter(prefix="/income", tags=["income"])

@router.post("", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
async def create_income(
    income_data: IncomeCreate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return IncomeService.create_income(
        db, UUID(user_id), income_data
    )

@router.get("", response_model=IncomeListResponse)
async def get_income_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    date_from: date = Query(None),
    date_to: date = Query(None),
    source: str = Query(None),
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = IncomeService.get_income_list(
        db, UUID(user_id), skip, limit, date_from, date_to, source
    )
    return result

@router.get("/{income_id}", response_model=IncomeResponse)
async def get_income(
    income_id: str,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return IncomeService.get_income_by_id(db, UUID(user_id), UUID(income_id))

@router.put("/{income_id}", response_model=IncomeResponse)
async def update_income(
    income_id: str,
    income_data: IncomeUpdate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return IncomeService.update_income(
        db, UUID(user_id), UUID(income_id), income_data
    )

@router.delete("/{income_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_income(
    income_id: str,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    IncomeService.delete_income(db, UUID(user_id), UUID(income_id))
```

#### File: `app/api/v1/endpoints/auth.py`

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import timedelta
from app.db.session import get_db
from app.db.models import User, IponSettings
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    get_current_user
)
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str
    first_name: str = None
    last_name: str = None

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str = None

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Create user
    user = User(
        email=request.email,
        username=request.username,
        password_hash=hash_password(request.password),
        first_name=request.first_name,
        last_name=request.last_name
    )
    db.add(user)
    db.flush()

    # Create default ipon settings
    settings = IponSettings(user_id=user.id)
    db.add(settings)
    db.commit()

    return {
        "id": str(user.id),
        "email": user.email,
        "username": user.username
    }

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()

    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 1800,
        "refresh_token": refresh_token
    }
```

### 2.6 Main Application

#### File: `app/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import income, auth, settings, dashboard

app = FastAPI(
    title="Income Tracker API",
    version="1.0.0",
    description="Full-stack income tracking application"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(income.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

---

## Phase 3: Frontend Implementation (4-6 hours)

### 3.1 Context & Hooks Setup

#### File: `src/context/AuthContext.jsx`

```javascript
import React, { createContext, useState, useCallback } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      setToken(response.data.access_token);
      setUser(response.data.user);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email, username, password, firstName, lastName) => {
      setIsLoading(true);
      try {
        await api.post("/auth/register", {
          email,
          username,
          password,
          first_name: firstName,
          last_name: lastName,
        });
        return true;
      } catch (error) {
        console.error("Registration failed:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }, []);

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

#### File: `src/utils/api.js`

```javascript
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        localStorage.setItem("access_token", response.data.access_token);
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
```

### 3.2 Key Component Examples

#### File: `src/components/income/IncomeForm.jsx`

```javascript
import React, { useState } from "react";
import api from "../../utils/api";

export default function IncomeForm({ onSuccess }) {
  const today = new Date();
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    date: today.toISOString().split("T")[0],
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? value : value,
    }));

    // Auto-update date when year/month/day changes
    if (["year", "month", "day"].includes(name)) {
      const year = name === "year" ? parseInt(value) : formData.year;
      const month = name === "month" ? parseInt(value) : formData.month;
      const day = name === "day" ? parseInt(value) : formData.day;
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "amount" ? value : parseInt(value),
        date: dateStr,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/income", {
        amount: parseFloat(formData.amount),
        source: formData.source,
        year: formData.year,
        month: formData.month,
        day: formData.day,
        date: formData.date,
        notes: formData.notes || null,
      });

      setFormData({
        amount: "",
        source: "",
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });

      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create income entry");
    } finally {
      setLoading(false);
    }
  };

  // Generate year options (2020 to current + 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2020 + 6 },
    (_, i) => 2020 + i,
  );

  // Generate day options based on month
  const daysInMonth = new Date(formData.year, formData.month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 md:p-6 rounded-lg shadow"
    >
      <h2 className="text-lg md:text-xl font-bold mb-4">Add Income</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm md:text-base">
          {error}
        </div>
      )}

      {/* Row 1: Amount and Source */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="5000.00"
            className="w-full px-3 py-2 md:py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            required
            placeholder="Salary, Freelance, etc."
            className="w-full px-3 py-2 md:py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Row 2: Year, Month, Day */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full px-2 py-2 md:py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="w-full px-2 py-2 md:py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Day
          </label>
          <select
            name="day"
            value={formData.day}
            onChange={handleChange}
            className="w-full px-2 py-2 md:py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {String(d).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Notes */}
      <div className="mb-4">
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <input
          type="text"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any notes..."
          className="w-full px-3 py-2 md:py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto bg-blue-600 text-white px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
      >
        {loading ? "Adding..." : "Add Income"}
      </button>
    </form>
  );
}
```

#### File: `src/pages/DashboardPage.jsx`

```javascript
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function DashboardPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchSummary = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setSummary(response.data);
      } catch (error) {
        console.error("Failed to fetch summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [isAuthenticated]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Total Income</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${summary.total_income.toFixed(2)}
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">Total Savings</h3>
            <p className="text-2xl font-bold text-green-600">
              ${summary.total_savings.toFixed(2)}
            </p>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">
              Emergency Fund
            </h3>
            <p className="text-2xl font-bold text-orange-600">
              ${summary.total_emergency.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Phase 4: Testing & Deployment (2-3 hours)

### 4.1 Backend Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=app
```

### 4.2 Frontend Build

```bash
cd frontend
npm run build
npm run preview
```

### 4.3 Docker Deployment

#### File: `backend/Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### File: `docker-compose.yml`

```yaml
version: "3.8"

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: income_user
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: income_tracker
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://income_user:secure_password@db:5432/income_tracker
      SECRET_KEY: super-secret-key-change-in-production
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## Phase 5: Deployment Options

### Production Deployment

**Frontend:**

- Vercel: `vercel deploy`
- Netlify: `netlify deploy`

**Backend:**

- Render: Connect GitHub repo, auto-deploy
- Railway: Same as Render
- VPS (DigitalOcean, AWS EC2): Docker + Docker Compose

**Database:**

- Supabase: Managed PostgreSQL
- Neon: Serverless PostgreSQL
- AWS RDS: Managed database service

---

## Key Implementation Principles

### ✅ Data Integrity

- Savings and emergency amounts are calculated ONCE at income creation
- No retroactive recalculation
- Use transactions for consistency

### ✅ Ipon Module Pattern

- Only SUM aggregations
- No business logic
- Use indexes for performance

### ✅ Security

- JWT-based authentication
- Password hashing with bcrypt
- HTTPS in production
- Rate limiting recommended

### ✅ API Design

- RESTful endpoints
- Proper HTTP status codes
- Pagination with skip/limit
- Filtering options

### ✅ Frontend

- Responsive design with Tailwind
- Client-side validation
- Error handling
- Loading states

---

## Summary Checklist

- [x] Database schema with proper relationships
- [x] API endpoint definitions
- [x] Backend folder structure
- [x] Frontend folder structure
- [x] Core service implementations
- [x] Sample component code
- [x] Implementation workflow
- [x] Docker setup
- [x] Security best practices

**Total Development Time:** ~16-18 hours
**Difficulty:** Intermediate to Advanced
