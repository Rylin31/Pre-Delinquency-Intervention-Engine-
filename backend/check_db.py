from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URLs from environment variables
URL_DIRECT = os.getenv("SUPABASE_DB_URL_DIRECT")
URL_POOLER = os.getenv("SUPABASE_DB_URL_POOLER")

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
