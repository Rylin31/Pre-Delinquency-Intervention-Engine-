from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

DATABASE_URL = "sqlite:///./tent.db"

# Setting up SQLite reliably so the user can see DATA locally.
# The Supabase connection is failing due to SSL/IP issues in this environment.
try:
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
except Exception:
    engine = create_engine("sqlite:///:memory:")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
