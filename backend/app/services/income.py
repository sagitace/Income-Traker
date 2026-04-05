from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.db.models import Income, IponSettings
from app.schemas import IncomeCreate, IncomeUpdate
from datetime import datetime

def create_income(db: Session, user_id: str, income_data: IncomeCreate):
    # Get user settings
    settings = db.query(IponSettings).filter(IponSettings.user_id == user_id).first()
    
    if not settings:
        # Create default settings if not exists
        settings = IponSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    # Calculate savings and emergency amounts based on settings at time of creation
    savings_amount = income_data.amount * (settings.savings_percentage / 100)
    emergency_amount = income_data.amount * (settings.emergency_percentage / 100)
    
    # Create income entry
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

def get_user_incomes(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(Income).filter(Income.user_id == user_id).offset(skip).limit(limit).all()

def get_income_by_id(db: Session, user_id: str, income_id: str):
    return db.query(Income).filter(
        and_(Income.id == income_id, Income.user_id == user_id)
    ).first()

def update_income(db: Session, user_id: str, income_id: str, income_data: IncomeUpdate):
    db_income = get_income_by_id(db, user_id, income_id)
    if not db_income:
        return None
    
    # Update fields
    if income_data.amount is not None:
        db_income.amount = income_data.amount
    if income_data.source is not None:
        db_income.source = income_data.source
    if income_data.year is not None:
        db_income.year = income_data.year
    if income_data.month is not None:
        db_income.month = income_data.month
    if income_data.day is not None:
        db_income.day = income_data.day
    if income_data.date is not None:
        db_income.date = income_data.date
    if income_data.notes is not None:
        db_income.notes = income_data.notes
    
    db.commit()
    db.refresh(db_income)
    return db_income

def delete_income(db: Session, user_id: str, income_id: str):
    db_income = get_income_by_id(db, user_id, income_id)
    if db_income:
        db.delete(db_income)
        db.commit()
        return True
    return False

def get_monthly_summary(db: Session, user_id: str, year: int, month: int):
    incomes = db.query(Income).filter(
        and_(
            Income.user_id == user_id,
            Income.year == year,
            Income.month == month
        )
    ).all()
    
    total_income = sum(i.amount for i in incomes)
    total_savings = sum(i.savings_amount for i in incomes)
    total_emergency = sum(i.emergency_amount for i in incomes)
    
    return {
        "summary": {
            "total_income": total_income,
            "total_savings": total_savings,
            "total_emergency": total_emergency,
            "entry_count": len(incomes),
        },
        "entries": incomes
    }

def get_yearly_summary(db: Session, user_id: str, year: int):
    incomes = db.query(Income).filter(
        and_(Income.user_id == user_id, Income.year == year)
    ).all()
    
    total_income = sum(i.amount for i in incomes)
    total_savings = sum(i.savings_amount for i in incomes)
    total_emergency = sum(i.emergency_amount for i in incomes)
    
    # Group by month
    monthly_breakdown = {}
    for income in incomes:
        month = income.month
        if month not in monthly_breakdown:
            monthly_breakdown[month] = {
                "month": month,
                "total_income": 0,
                "total_savings": 0,
                "total_emergency": 0,
                "entry_count": 0
            }
        monthly_breakdown[month]["total_income"] += income.amount
        monthly_breakdown[month]["total_savings"] += income.savings_amount
        monthly_breakdown[month]["total_emergency"] += income.emergency_amount
        monthly_breakdown[month]["entry_count"] += 1
    
    return {
        "summary": {
            "total_income": total_income,
            "total_savings": total_savings,
            "total_emergency": total_emergency,
            "entry_count": len(incomes),
        },
        "monthly_breakdown": list(monthly_breakdown.values())
    }

def get_overall_summary(db: Session, user_id: str):
    result = db.query(
        func.sum(Income.amount).label("total_income"),
        func.sum(Income.savings_amount).label("total_savings"),
        func.sum(Income.emergency_amount).label("total_emergency"),
        func.count(Income.id).label("count")
    ).filter(Income.user_id == user_id).first()
    
    total_income = result.total_income or 0
    total_savings = result.total_savings or 0
    total_emergency = result.total_emergency or 0
    count = result.count or 0
    
    average_monthly = total_income / 12 if count > 0 else 0
    
    return {
        "total_income": total_income,
        "total_savings": total_savings,
        "total_emergency": total_emergency,
        "entry_count": count,
        "average_monthly": average_monthly
    }
