from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from database import SessionLocal, engine
from models import Base, User, Account, Transaction, Loan
from datetime import datetime, timedelta
import random

def seed_db():
    print("🚀 Initializing Enhanced Database Seeding...")
    
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"\n❌ Error connecting: {e}")
        return
    
    db = SessionLocal()
    
    # Wipe old data
    print("🧹 Cleaning up old data...")
    db.query(Transaction).delete()
    db.query(Loan).delete()
    db.query(Account).delete()
    db.query(User).delete()
    db.commit()

    print("\n📦 Generating 50+ Complex User Profiles with Realistic Financial Patterns...\n")
    
    # Enhanced personas with more diversity
    personas = [
        # === CRITICAL RISK PROFILES (Score 75-95) ===
        {"name": "Ananya Das", "role": "Junior Developer", "income": 45000, "epf": 1800, "status": "Critical", "scenario": "Severe Liquidity Crisis", "var_days": 8, "lcr": 0.5, "cc_util": 88.0},
        {"name": "Ramesh Kumar", "role": "Factory Worker", "income": 18000, "epf": 900, "status": "Critical", "scenario": "Multiple Micro-Loans", "micro_tx": 15, "cc_util": 95.0},
        {"name": "Vikram Malhotra", "role": "Marketing Manager", "income": 150000, "epf": 3000, "status": "Critical", "scenario": "Debt Trap - High Utilization", "cc_util": 92.0, "inquiries": 12},
        {"name": "Karan Johar", "role": "Unemployed", "income": 0, "epf": 0, "status": "Emergency", "scenario": "Job Loss + Gambling", "utility_lag": 60, "risk_merch": 25, "job_search": 0.95},
        {"name": "Rahul Dravid", "role": "Retired Professional", "income": 30000, "epf": 0, "status": "Critical", "scenario": "Asset Liquidation", "liq_flag": True, "sip_stop": True},
        {"name": "Arjun Rampal", "role": "Laid-off Engineer", "income": 80000, "epf": 0, "status": "Emergency", "scenario": "Sudden Job Loss", "epf_gap": True, "job_search": 0.9, "utility_lag": 30},
        {"name": "Farmer Ravi", "role": "Agriculture", "income": 12000, "epf": 0, "status": "Critical", "scenario": "Crop Failure + Debt", "disaster": True, "micro_tx": 8, "pincode": "500001"},
        {"name": "Deepak Chahar", "role": "Gig Driver", "income": 22000, "epf": 0, "status": "Critical", "scenario": "Income Volatility", "remit_drop": 65.0, "var_days": 12},
        {"name": "Priya Sharma", "role": "Freelancer", "income": 35000, "epf": 0, "status": "Critical", "scenario": "Irregular Income + High EMI", "remit_drop": 50.0, "cc_util": 78.0},
        {"name": "Amit Shah", "role": "Day Trader", "income": 500000, "epf": 0, "status": "Critical", "scenario": "Trading Losses + Hard Inquiries", "inquiries": 18, "liq_flag": True},
        
        # === HIGH RISK / WARNING (Score 50-75) ===
        {"name": "Suresh Reddy", "role": "Delivery Partner", "income": 25000, "epf": 0, "status": "Warning", "scenario": "Remittance Volatility", "remit_drop": 40.0, "micro_tx": 5},
        {"name": "Sneha Patil", "role": "College Student", "income": 5000, "epf": 0, "status": "Warning", "scenario": "Student Debt Burden", "cc_util": 45.0, "micro_tx": 6},
        {"name": "Pooja Hegde", "role": "Social Media Influencer", "income": 200000, "epf": 0, "status": "Warning", "scenario": "Lifestyle Inflation", "risk_merch": 8, "cc_util": 55.0},
        {"name": "Manish Tiwari", "role": "Bank Manager", "income": 90000, "epf": 2500, "status": "Warning", "scenario": "SIP Stoppage Signal", "sip_stop": True, "pledge": True},
        {"name": "Zara Khan", "role": "Consultant", "income": 120000, "epf": 0, "status": "Warning", "scenario": "Tax Compliance Gap", "tax": "Delayed", "cc_util": 48.0},
        {"name": "Rohit Sharma", "role": "Sales Executive", "income": 55000, "epf": 1800, "status": "Warning", "scenario": "Commission Dependency", "remit_drop": 35.0, "var_days": 6},
        {"name": "Kavya Reddy", "role": "Startup Employee", "income": 65000, "epf": 2000, "status": "Warning", "scenario": "Equity Illiquidity", "sip_stop": True, "cc_util": 52.0},
        {"name": "Sanjay Dutt", "role": "Restaurant Owner", "income": 80000, "epf": 0, "status": "Warning", "scenario": "Business Slowdown", "remit_drop": 30.0, "utility_lag": 15},
        {"name": "Neha Kakkar", "role": "Music Teacher", "income": 40000, "epf": 1200, "status": "Warning", "scenario": "Seasonal Income Dip", "var_days": 10, "lcr": 1.2},
        {"name": "Aditya Roy", "role": "Content Creator", "income": 75000, "epf": 0, "status": "Warning", "scenario": "Platform Dependency", "remit_drop": 45.0, "risk_merch": 5},
        
        # === MODERATE RISK (Score 35-50) ===
        {"name": "Rajesh Khanna", "role": "Government Employee", "income": 70000, "epf": 3500, "status": "Safe", "scenario": "Stable Income", "lcr": 3.5, "cc_util": 25.0},
        {"name": "Meera Nair", "role": "School Teacher", "income": 50000, "epf": 2000, "status": "Safe", "scenario": "Conservative Spender", "lcr": 4.0, "cc_util": 18.0},
        {"name": "Vijay Kumar", "role": "IT Professional", "income": 110000, "epf": 4500, "status": "Safe", "scenario": "Balanced Profile", "lcr": 3.0, "cc_util": 30.0},
        {"name": "Anjali Mehta", "role": "HR Manager", "income": 95000, "epf": 3800, "status": "Safe", "scenario": "Good Financial Health", "lcr": 3.8, "cc_util": 22.0},
        {"name": "Karthik Subramanian", "role": "Accountant", "income": 60000, "epf": 2400, "status": "Safe", "scenario": "Disciplined Saver", "lcr": 5.0, "cc_util": 15.0},
        
        # === LOW RISK / IDEAL CUSTOMERS (Score 10-35) ===
        {"name": "Kabir Singh", "role": "Senior Doctor", "income": 300000, "epf": 0, "status": "Clean", "scenario": "High Income Professional", "lcr": 8.0, "cc_util": 12.0, "sip_score": 1.0},
        {"name": "Nita Ambani", "role": "Business Owner", "income": 1000000, "epf": 0, "status": "Clean", "scenario": "Ultra HNI", "lcr": 15.0, "cc_util": 5.0},
        {"name": "Dr. Sunita Rao", "role": "Surgeon", "income": 450000, "epf": 0, "status": "Clean", "scenario": "Medical Professional", "lcr": 10.0, "cc_util": 8.0},
        {"name": "Ravi Shankar", "role": "Senior Architect", "income": 250000, "epf": 10000, "status": "Clean", "scenario": "Stable High Earner", "lcr": 7.5, "cc_util": 10.0},
        {"name": "Priyanka Chopra", "role": "Corporate Executive", "income": 350000, "epf": 14000, "status": "Clean", "scenario": "Executive Level", "lcr": 9.0, "cc_util": 6.0, "sip_score": 1.0},
        
        # === EDGE CASES & SPECIAL SCENARIOS ===
        {"name": "Edge Zero Income", "role": "Unemployed Student", "income": 0, "epf": 0, "status": "Critical", "scenario": "No Income Source", "micro_tx": 10},
        {"name": "Edge Ultra Rich", "role": "CEO", "income": 5000000, "epf": 100000, "status": "Clean", "scenario": "Ultra High Net Worth", "lcr": 50.0},
        {"name": "Disaster Victim", "role": "Flood Affected", "income": 30000, "epf": 1200, "status": "Critical", "scenario": "Natural Disaster", "disaster": True, "infra_fail": True, "pincode": "400001"},
        {"name": "Medical Emergency", "role": "Patient", "income": 55000, "epf": 2200, "status": "Critical", "scenario": "Health Crisis", "cc_util": 85.0, "micro_tx": 12},
        {"name": "Divorce Settlement", "role": "Legal Battle", "income": 100000, "epf": 4000, "status": "Warning", "scenario": "Legal Expenses", "cc_util": 70.0, "inquiries": 8},
        
        # === MIXED COMPLEXITY CASES ===
        {"name": "Complex Risk Alpha", "role": "Crypto Trader", "income": 150000, "epf": 0, "status": "Critical", "scenario": "High Risk Investments", "liq_flag": True, "risk_merch": 20, "cc_util": 80.0},
        {"name": "Complex Risk Beta", "role": "Multi-Business Owner", "income": 400000, "epf": 0, "status": "Warning", "scenario": "Business Diversification", "remit_drop": 25.0, "cc_util": 45.0},
        {"name": "Complex Risk Gamma", "role": "NRI Remittance", "income": 200000, "epf": 0, "status": "Warning", "scenario": "Foreign Income Dependency", "remit_drop": 55.0, "var_days": 15},
        
        # === SECTOR-SPECIFIC PROFILES ===
        {"name": "Tech Startup Founder", "role": "Entrepreneur", "income": 180000, "epf": 0, "status": "Warning", "scenario": "Startup Burn Rate", "cc_util": 65.0, "pledge": True},
        {"name": "Real Estate Agent", "role": "Property Dealer", "income": 120000, "epf": 0, "status": "Warning", "scenario": "Commission Based", "remit_drop": 40.0, "var_days": 8},
        {"name": "Airline Pilot", "role": "Commercial Pilot", "income": 280000, "epf": 11200, "status": "Safe", "scenario": "Aviation Professional", "lcr": 6.0, "cc_util": 20.0},
        {"name": "Fashion Designer", "role": "Designer", "income": 95000, "epf": 0, "status": "Warning", "scenario": "Seasonal Business", "remit_drop": 35.0, "cc_util": 50.0},
        {"name": "Gym Trainer", "role": "Fitness Coach", "income": 35000, "epf": 0, "status": "Warning", "scenario": "Client Dependency", "var_days": 7, "lcr": 1.5},
        {"name": "Uber Driver", "role": "Ride Share", "income": 28000, "epf": 0, "status": "Warning", "scenario": "Platform Worker", "remit_drop": 30.0, "micro_tx": 4},
        {"name": "YouTuber", "role": "Content Creator", "income": 85000, "epf": 0, "status": "Warning", "scenario": "Ad Revenue Volatility", "remit_drop": 50.0, "risk_merch": 6},
        
        # === ADDITIONAL DIVERSE PROFILES ===
        {"name": "Retired Army Officer", "role": "Pension", "income": 60000, "epf": 0, "status": "Safe", "scenario": "Pension Income", "lcr": 5.0, "cc_util": 12.0},
        {"name": "College Professor", "role": "Academic", "income": 85000, "epf": 3400, "status": "Safe", "scenario": "Academic Stability", "lcr": 4.5, "cc_util": 18.0},
        {"name": "Chartered Accountant", "role": "CA", "income": 180000, "epf": 0, "status": "Clean", "scenario": "Professional Services", "lcr": 7.0, "cc_util": 15.0},
        {"name": "Software Engineer", "role": "SDE-3", "income": 220000, "epf": 8800, "status": "Clean", "scenario": "Tech Professional", "lcr": 6.5, "cc_util": 20.0, "sip_score": 1.0},
        {"name": "Pharmacist", "role": "Medical Store", "income": 45000, "epf": 1800, "status": "Safe", "scenario": "Healthcare Worker", "lcr": 3.2, "cc_util": 25.0},
        {"name": "Electrician", "role": "Skilled Worker", "income": 32000, "epf": 1280, "status": "Warning", "scenario": "Daily Wage", "var_days": 5, "lcr": 1.8},
        {"name": "Lawyer", "role": "Legal Practitioner", "income": 160000, "epf": 0, "status": "Safe", "scenario": "Legal Professional", "lcr": 5.5, "cc_util": 28.0},
        {"name": "Journalist", "role": "Reporter", "income": 55000, "epf": 2200, "status": "Safe", "scenario": "Media Professional", "lcr": 3.0, "cc_util": 32.0},
        {"name": "Chef", "role": "Restaurant Chef", "income": 48000, "epf": 1920, "status": "Safe", "scenario": "Hospitality Worker", "lcr": 2.8, "cc_util": 35.0},
        {"name": "Photographer", "role": "Freelance Photo", "income": 42000, "epf": 0, "status": "Warning", "scenario": "Project Based", "remit_drop": 28.0, "var_days": 6},
    ]

    new_users = []
    new_accounts = []
    new_transactions = []
    new_loans = []
    
    # Enhanced transaction categories and merchants
    tx_categories = ["Food", "Rent", "Utilities", "Shopping", "Entertainment", "Medical", "Travel", "Education", "Investment", "Insurance"]
    merchants = {
        "Food": ["Swiggy", "Zomato", "McDonald's", "Starbucks", "Domino's", "KFC", "Local Restaurant", "Grocery Store"],
        "Rent": ["Landlord Transfer", "NoBroker", "Housing Society"],
        "Utilities": ["BESCOM", "Airtel", "Jio Fiber", "Gas Bill", "Water Bill", "Broadband"],
        "Shopping": ["Amazon", "Flipkart", "Myntra", "Zara", "H&M", "Big Bazaar", "DMart"],
        "Entertainment": ["Netflix", "Amazon Prime", "BookMyShow", "PVR Cinemas", "Spotify", "Gaming"],
        "Medical": ["Apollo Pharmacy", "Practo", "Hospital Bill", "Health Checkup", "Medicine"],
        "Travel": ["Uber", "Ola", "IRCTC", "Indigo", "SpiceJet", "MakeMyTrip"],
        "Education": ["Udemy", "Coursera", "School Fees", "Tuition", "Books"],
        "Investment": ["Zerodha", "Groww", "Mutual Fund SIP", "Stock Purchase", "Gold"],
        "Insurance": ["LIC Premium", "Health Insurance", "Car Insurance", "Term Insurance"],
        "Gambling": ["Dream11", "Bet365", "RummyCircle", "Online Casino", "Sports Betting"],
        "Loan": ["KreditBee", "MoneyTap", "Bajaj Finserv", "Credit Card Bill", "PayLater"]
    }

    print(f"Creating {len(personas)} user profiles...\n")
    
    for i, p in enumerate(personas):
        uid = f"U-2026-{i+1:03d}"
        
        # Calculate risk score based on multiple factors
        base_score = 30
        if p["status"] == "Critical" or p["status"] == "Emergency":
            base_score = random.randint(75, 95)
        elif p["status"] == "Warning":
            base_score = random.randint(50, 74)
        elif p["status"] == "Safe":
            base_score = random.randint(35, 49)
        else:  # Clean
            base_score = random.randint(10, 34)
        
        # Create User
        u = User(
            id=uid,
            name=p["name"],
            occupation=p["role"],
            monthly_income=p["income"],
            epf_contribution=p.get("epf", 0),
            current_risk_score=base_score,
            status=p["status"],
            distress_category=p["scenario"],
            salary_credit_variance_days=p.get("var_days", 0),
            liquidity_coverage_ratio=p.get("lcr", 2.5),
            remittance_volatility_percent=p.get("remit_drop", 0.0),
            credit_card_utilization=p.get("cc_util", 15.0),
            micro_credit_tx_count=p.get("micro_tx", 0),
            inquiry_density_7_days=p.get("inquiries", 0),
            utility_payment_latency_days=p.get("utility_lag", 0),
            high_risk_merchant_tx_count=p.get("risk_merch", 0),
            sip_consistency_score=0.0 if p.get("sip_stop") else p.get("sip_score", 0.5),
            portfolio_liquidation_flag=p.get("liq_flag", False),
            pledge_activity_flag=p.get("pledge", False),
            epf_gap_detected=p.get("epf_gap", False),
            tax_compliance_status=p.get("tax", "Compliant"),
            job_search_activity_index=p.get("job_search", 0.0),
            disaster_zone_flag=p.get("disaster", False),
            infrastructure_failure_flag=p.get("infra_fail", False),
            pincode=p.get("pincode", "110001")
        )
        new_users.append(u)
        
        # Create Account with realistic balance
        balance_multiplier = random.uniform(0.5, 4.0) if p["status"] in ["Clean", "Safe"] else random.uniform(0.05, 1.2)
        account_balance = max(p["income"] * balance_multiplier, 1000)
        
        acc = Account(
            id=f"ACC-{uid}", 
            user_id=uid, 
            type="Savings", 
            balance=round(account_balance, 2), 
            bank_name=random.choice(["HDFC", "ICICI", "SBI", "Axis", "Kotak"])
        )
        new_accounts.append(acc)

        # Determine spending behavior based on status
        if p["status"] == "Clean":
            spend_ratio = random.uniform(0.35, 0.70)  # High savings
        elif p["status"] == "Safe":
            spend_ratio = random.uniform(0.70, 0.95)  # Moderate savings
        elif p["status"] == "Warning":
            spend_ratio = random.uniform(0.95, 1.25)  # Living paycheck to paycheck
        else:  # Critical/Emergency
            spend_ratio = random.uniform(1.3, 2.8)  # Deep in debt
            
        target_spend = p["income"] * spend_ratio
        
        # Override for very low income (survival spending)
        if p["income"] < 15000:
            target_spend = max(target_spend, random.uniform(10000, 18000))

        # Generate transactions
        tentative_txs = []
        current_sum = 0
        
        # Salary Credit (if employed)
        if p["income"] > 0:
            salary_date = datetime.utcnow() - timedelta(days=random.randint(1, 7))
            new_transactions.append(Transaction(
                user_id=uid, account_id=acc.id, amount=p["income"], category="Salary",
                merchant_name="Employer Payroll", payment_mode="NEFT", transaction_type="Credit",
                timestamp=salary_date
            ))

        # Transaction count based on income and lifestyle
        if p["income"] < 30000:
            tx_count = random.randint(15, 35)
        elif p["income"] < 100000:
            tx_count = random.randint(35, 70)
        else:
            tx_count = random.randint(70, 120)

        for _ in range(tx_count):
            cat = random.choice(tx_categories)
            
            # Inject high-risk behavior
            if p.get("risk_merch", 0) > 5 and random.random() < 0.35:
                cat = "Gambling"
            if p.get("micro_tx", 0) > 3 and random.random() < 0.25:
                cat = "Loan"
                
            merch = random.choice(merchants.get(cat, ["Unknown Merchant"]))
            
            # Amount logic based on category
            if cat in ["Rent"]:
                amt = random.uniform(8000, 30000)
            elif cat in ["Shopping", "Travel", "Medical"]:
                amt = random.uniform(1000, 15000)
            elif cat in ["Gambling", "Loan"]:
                amt = random.uniform(500, 25000)
            elif cat in ["Investment", "Insurance"]:
                amt = random.uniform(2000, 20000)
            else:
                amt = random.uniform(50, 3000)
            
            tentative_txs.append({
                "category": cat,
                "merchant": merch,
                "amount": amt,
                "type": "Debit"
            })
            current_sum += amt
            
        # Scale transactions to match target spend
        if current_sum > 0:
            scale_factor = target_spend / current_sum
            for t in tentative_txs:
                final_amt = t["amount"] * scale_factor * random.uniform(0.85, 1.15)
                
                tx = Transaction(
                    user_id=uid, account_id=acc.id, amount=round(final_amt, 2), category=t["category"],
                    merchant_name=t["merchant"], 
                    payment_mode=random.choice(["UPI", "Card", "NetBanking", "Cash"]), 
                    transaction_type="Debit",
                    timestamp=datetime.utcnow() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
                )
                new_transactions.append(tx)
        
        # GENERATE LOANS with realistic distribution
        if p["status"] == "Clean":
            loan_count = random.randint(0, 2)
        elif p["status"] == "Safe":
            loan_count = random.randint(1, 2)
        elif p["status"] == "Warning":
            loan_count = random.randint(2, 3)
        else:  # Critical/Emergency
            loan_count = random.randint(3, 5)
        
        loan_types_pool = [
            {"type": "Personal Loan", "rate": random.uniform(10.5, 16.5), "tenure": random.randint(12, 60)},
            {"type": "Home Loan", "rate": random.uniform(8.3, 9.8), "tenure": random.randint(120, 300)},
            {"type": "Auto Loan", "rate": random.uniform(8.5, 11.5), "tenure": random.randint(36, 84)},
            {"type": "Education Loan", "rate": random.uniform(7.5, 12.5), "tenure": random.randint(60, 180)},
            {"type": "Credit Card", "rate": random.uniform(18.0, 42.0), "tenure": random.randint(6, 36)},
            {"type": "Business Loan", "rate": random.uniform(11.0, 18.0), "tenure": random.randint(24, 120)},
            {"type": "Gold Loan", "rate": random.uniform(7.0, 12.0), "tenure": random.randint(6, 36)},
        ]
        
        for _ in range(loan_count):
            loan_info = random.choice(loan_types_pool)
            
            # Principal calculation based on loan type and income
            if loan_info["type"] == "Home Loan":
                principal = p["income"] * random.uniform(50, 100) if p["income"] > 50000 else p["income"] * random.uniform(20, 40)
            elif loan_info["type"] == "Auto Loan":
                principal = p["income"] * random.uniform(10, 20)
            elif loan_info["type"] == "Education Loan":
                principal = p["income"] * random.uniform(15, 40)
            elif loan_info["type"] == "Credit Card":
                principal = p["income"] * random.uniform(0.3, 4)
            elif loan_info["type"] == "Business Loan":
                principal = p["income"] * random.uniform(20, 60)
            elif loan_info["type"] == "Gold Loan":
                principal = p["income"] * random.uniform(2, 8)
            else:  # Personal Loan
                principal = p["income"] * random.uniform(4, 12)
            
            principal = max(principal, 10000)
            
            # EMI calculation
            monthly_rate = loan_info["rate"] / (12 * 100)
            tenure = loan_info["tenure"]
            
            if monthly_rate > 0:
                emi = principal * monthly_rate * ((1 + monthly_rate) ** tenure) / (((1 + monthly_rate) ** tenure) - 1)
            else:
                emi = principal / tenure
            
            # Loan progress
            remaining_months = random.randint(int(tenure * 0.2), tenure)
            outstanding = principal * (remaining_months / tenure) * random.uniform(0.85, 1.15)
            
            start_date = datetime.utcnow() - timedelta(days=30 * (tenure - remaining_months))
            
            loan = Loan(
                user_id=uid,
                loan_type=loan_info["type"],
                principal_amount=round(principal, 2),
                outstanding_amount=round(outstanding, 2),
                monthly_emi=round(emi, 2),
                interest_rate=round(loan_info["rate"], 2),
                tenure_months=tenure,
                remaining_months=remaining_months,
                start_date=start_date
            )
            new_loans.append(loan)

    # Bulk Insert
    print(f"\n📥 Inserting into database:")
    print(f"   • {len(new_users)} User Profiles")
    print(f"   • {len(new_accounts)} Bank Accounts")
    print(f"   • {len(new_loans)} Loan Records")
    print(f"   • {len(new_transactions)} Transactions")
    
    db.add_all(new_users)
    db.add_all(new_accounts)
    db.add_all(new_loans)
    db.add_all(new_transactions)
    db.commit()
    
    # Summary statistics
    print(f"\n📊 Risk Distribution:")
    critical_count = len([u for u in new_users if u.status in ["Critical", "Emergency"]])
    warning_count = len([u for u in new_users if u.status == "Warning"])
    safe_count = len([u for u in new_users if u.status == "Safe"])
    clean_count = len([u for u in new_users if u.status == "Clean"])
    
    print(f"   • Critical/Emergency: {critical_count} users")
    print(f"   • Warning: {warning_count} users")
    print(f"   • Safe: {safe_count} users")
    print(f"   • Clean: {clean_count} users")
    
    total_exposure = sum([loan.outstanding_amount for loan in new_loans])
    print(f"\n💰 Total Portfolio Exposure: ₹{total_exposure:,.2f} ({total_exposure/10000000:.2f} Cr)")
        
    print("\n✅ Enhanced Seeding Complete! Database is ready with complex, realistic data.\n")
    db.close()

if __name__ == "__main__":
    seed_db()
