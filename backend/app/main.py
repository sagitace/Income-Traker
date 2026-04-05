import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.routes import auth, income, settings, dashboard

# Create tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Income Tracker API",
    description="API for managing income, savings, and emergency fund tracking",
    version="2.0"
)

# CORS middleware - read from environment with fallback to localhost
cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://localhost:8080"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(income.router)
app.include_router(settings.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {
        "message": "Income Tracker API v2.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
