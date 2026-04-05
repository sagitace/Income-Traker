from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas import IponSettingsUpdate, IponSettingsResponse
from app.services.settings import get_or_create_settings, update_settings
from app.services.auth import verify_token

router = APIRouter(prefix="/settings", tags=["settings"])

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token format")
    
    return verify_token(token)

@router.get("/ipon", response_model=IponSettingsResponse)
def get_ipon_settings(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's IPON (savings/emergency) settings"""
    settings = get_or_create_settings(db, user_id)
    return settings

@router.put("/ipon", response_model=IponSettingsResponse)
def update_ipon_settings(
    settings_data: IponSettingsUpdate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's IPON settings"""
    settings = update_settings(db, user_id, settings_data)
    return settings
