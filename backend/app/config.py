from pydantic_settings import BaseSettings
from pathlib import Path

# Get the project root directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    # SQLite for development (no TCP/IP issues)
    DATABASE_URL: str = "sqlite:///./income_tracker.db"
    SECRET_KEY: str = "your-secret-key-change-in-production-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = str(BASE_DIR / ".env")
        case_sensitive = False

settings = Settings()
