from sqlalchemy.orm import Session
from app.db.models import IponSettings
from app.schemas import IponSettingsUpdate

def get_or_create_settings(db: Session, user_id: str):
    settings = db.query(IponSettings).filter(IponSettings.user_id == user_id).first()
    
    if not settings:
        settings = IponSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return settings

def update_settings(db: Session, user_id: str, settings_data: IponSettingsUpdate):
    settings = get_or_create_settings(db, user_id)
    
    if settings_data.savings_percentage is not None:
        settings.savings_percentage = settings_data.savings_percentage
    if settings_data.emergency_percentage is not None:
        settings.emergency_percentage = settings_data.emergency_percentage
    
    db.commit()
    db.refresh(settings)
    return settings
