from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas import IncomeCreate, IncomeUpdate, IncomeResponse
from app.services.income import (
    create_income, get_user_incomes, get_income_by_id, 
    update_income, delete_income
)
from app.services.auth import verify_token

router = APIRouter(prefix="/income", tags=["income"])

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token format")
    
    return verify_token(token)

@router.post("/", response_model=IncomeResponse)
def create_new_income(
    income: IncomeCreate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new income entry"""
    return create_income(db, user_id, income)

@router.get("/", response_model=list[IncomeResponse])
def list_incomes(
    skip: int = 0,
    limit: int = 100,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all income entries for current user"""
    return get_user_incomes(db, user_id, skip, limit)

@router.get("/{income_id}", response_model=IncomeResponse)
def get_income(
    income_id: str,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific income entry"""
    income = get_income_by_id(db, user_id, income_id)
    if not income:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Income not found")
    return income

@router.put("/{income_id}", response_model=IncomeResponse)
def update_existing_income(
    income_id: str,
    income: IncomeUpdate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an income entry"""
    updated_income = update_income(db, user_id, income_id, income)
    if not updated_income:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Income not found")
    return updated_income

@router.delete("/{income_id}")
def delete_existing_income(
    income_id: str,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an income entry"""
    if not delete_income(db, user_id, income_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Income not found")
    return {"detail": "Income deleted successfully"}
