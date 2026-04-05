from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Income Schemas
class IncomeCreate(BaseModel):
    amount: float = Field(..., gt=0)
    source: str = Field(..., min_length=1, max_length=255)
    year: int = Field(..., ge=2020, le=2099)
    month: int = Field(..., ge=1, le=12)
    day: int = Field(..., ge=1, le=31)
    date: datetime
    notes: Optional[str] = None

class IncomeUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    source: Optional[str] = Field(None, min_length=1, max_length=255)
    year: Optional[int] = Field(None, ge=2020, le=2099)
    month: Optional[int] = Field(None, ge=1, le=12)
    day: Optional[int] = Field(None, ge=1, le=31)
    date: Optional[datetime] = None
    notes: Optional[str] = None

class IncomeResponse(BaseModel):
    id: str
    user_id: str
    amount: float
    savings_amount: float
    emergency_amount: float
    source: str
    year: int
    month: int
    day: int
    date: datetime
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Ipon Settings Schemas
class IponSettingsUpdate(BaseModel):
    savings_percentage: Optional[float] = Field(None, ge=0, le=100)
    emergency_percentage: Optional[float] = Field(None, ge=0, le=100)

class IponSettingsResponse(BaseModel):
    id: str
    user_id: str
    savings_percentage: float
    emergency_percentage: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Auth Schemas
class TokenRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# Dashboard Schemas
class SummaryResponse(BaseModel):
    total_income: float
    total_savings: float
    total_emergency: float
    entry_count: int
    average_monthly: float

class MonthlySummary(BaseModel):
    total_income: float
    total_savings: float
    total_emergency: float
    entry_count: int

class MonthlyResponse(BaseModel):
    summary: MonthlySummary
    entries: list[IncomeResponse]

class YearlySummary(BaseModel):
    total_income: float
    total_savings: float
    total_emergency: float
    entry_count: int

class YearlyResponse(BaseModel):
    summary: YearlySummary
    monthly_breakdown: list[dict]
