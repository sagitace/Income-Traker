from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas import SummaryResponse, MonthlyResponse, YearlyResponse
from app.services.income import (
    get_monthly_summary, get_yearly_summary, get_overall_summary
)
from app.services.auth import verify_token

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token format")
    
    return verify_token(token)

@router.get("/summary", response_model=SummaryResponse)
def get_summary(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get overall summary of user's finances"""
    return get_overall_summary(db, user_id)

@router.get("/monthly/{year}/{month}", response_model=MonthlyResponse)
def get_monthly(
    year: int,
    month: int,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get monthly summary for a specific month"""
    if month < 1 or month > 12:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid month")
    return get_monthly_summary(db, user_id, year, month)

@router.get("/yearly/{year}", response_model=YearlyResponse)
def get_yearly(
    year: int,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get yearly summary for a specific year"""
    return get_yearly_summary(db, user_id, year)
