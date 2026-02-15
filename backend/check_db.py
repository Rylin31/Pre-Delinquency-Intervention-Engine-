from sqlalchemy import create_engine
import os

# Trying both options
URL_DIRECT = "postgresql://postgres:Rahul%4031082006@db.ocsmppwxorxvyiafdwyf.supabase.co:5432/postgres?sslmode=require"
URL_POOLER = "postgresql://postgres.ocsmppwxorxvyiafdwyf:Rahul%4031082006@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"

def check(url, name):
    print(f"Testing {name}...")
    try:
        engine = create_engine(url)
        with engine.connect() as conn:
            print(f"✅ Connection successful to {name}!")
            return True
    except Exception as e:
        print(f"❌ Failed connecting to {name}: {e}")
        return False

if __name__ == "__main__":
    if not check(URL_DIRECT, "Direct Connection"):
        check(URL_POOLER, "Transaction Pooler")
