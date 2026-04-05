"""
Database initialization script
Run this once to create all tables in PostgreSQL
"""
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

from sqlalchemy import text
from app.db.database import engine, Base
from app.db.models import User, IponSettings, Income

def init_db():
    """Create all tables"""
    print("Creating tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        
        # Optional: Create indexes
        with engine.connect() as conn:
            try:
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_income_user_id ON income(user_id)"))
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_income_date ON income(date)"))
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_income_user_date ON income(user_id, date)"))
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)"))
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)"))
                conn.execute(text("CREATE INDEX IF NOT EXISTS idx_ipon_settings_user_id ON ipon_settings(user_id)"))
                conn.commit()
                print("✅ Indexes created successfully!")
            except Exception as e:
                print(f"Note: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_db()
