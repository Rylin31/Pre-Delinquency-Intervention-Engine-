from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from database import get_db, engine, Base
import models

# Create tables (if running for the first time without seed)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Risk Engine API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for Response
class UserResponse(BaseModel):
    id: str
    name: str
    occupation: str
    monthly_income: float
    epf_contribution: float
    current_risk_score: int
    status: str
    volatility: str
    
    class Config:
        from_attributes = True

class DistressUpdate(BaseModel):
    user_id: str
    reason: str

@app.get("/api/users")
def read_users(db: Session = Depends(get_db)):
    # Fetch all users from DB
    users = db.query(models.User).all()
    # Map to frontend expected format
    return [
        {
            "id": u.id,
            "name": u.name,
            "occupation": u.occupation,
            "income": u.monthly_income,
            "epf_contribution": u.epf_contribution,
            "history": [u.current_risk_score - 10, u.current_risk_score - 5, u.current_risk_score], 
            "score": u.current_risk_score,
            "status": u.status,
            "volatility": u.distress_category or "Medium", # Mapped from new schema
            "last_action": "Pending",
            "exposure": u.monthly_income * 20 # Mock Loan Exposure
        }
        for u in users
    ]

@app.get("/api/users/{user_id}")
def read_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Aggregate Expenditure by Category
    expenditure = {}
    total_spend = 0
    for tx in user.transactions:
        if tx.transaction_type == "Debit": # Only count debits as expenditure
             if tx.category not in expenditure:
                 expenditure[tx.category] = 0
             expenditure[tx.category] += tx.amount
             total_spend += tx.amount
    
    # Format for chart (Top 5 categories + Others)
    sorted_exp = sorted(expenditure.items(), key=lambda x: x[1], reverse=True)
    chart_data = [{"name": k, "value": round(v, 2)} for k, v in sorted_exp[:5]]
    
    if len(sorted_exp) > 5:
        others_val = sum(v for k, v in sorted_exp[5:])
        chart_data.append({"name": "Others", "value": round(others_val, 2)})

    # Aggregate Loans
    total_emi = 0
    loan_details = []
    for loan in user.loans:
        total_emi += loan.monthly_emi
        loan_details.append({
            "type": loan.loan_type,
            "principal": round(loan.principal_amount, 2),
            "outstanding": round(loan.outstanding_amount, 2),
            "emi": round(loan.monthly_emi, 2),
            "interest_rate": loan.interest_rate,
            "remaining_months": loan.remaining_months
        })
    
    # Calculate repayment capacity
    disposable_income = user.monthly_income - total_spend - total_emi
    can_repay = disposable_income >= 0

    # Construct response
    return {
        "id": user.id,
        "name": user.name,
        "occupation": user.occupation,
        "income": user.monthly_income,
        "epf_contribution": user.epf_contribution,
        "investment_liquidity": user.liquidity_coverage_ratio * user.monthly_income, 
        "total_liability": user.monthly_income * 0.4, # Mock
        "risk_score": user.current_risk_score,
        "history": [user.current_risk_score - 5, user.current_risk_score - 2, user.current_risk_score],
        "distress_reason": user.distress_category,
        "status": user.status,
        "volatility": user.distress_category or "Medium",
        "last_action": "Discovery Sent",
        "shap_values": generate_mock_shap(user),
        "expenditure_breakdown": chart_data,
        "total_spend": round(total_spend, 2),
        "loans": loan_details,
        "total_emi": round(total_emi, 2),
        "disposable_income": round(disposable_income, 2),
        "can_repay": can_repay
    }

@app.post("/api/discovery")
def update_distress(data: DistressUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return intervention strategy based on reason
    intervention = {
        "action": "Hold",
        "message": "Analyzing inputs..."
    }
    
    if data.reason == "job":
         intervention = {
            "action": "Emergency Protocol",
            "message": "Income verification requested. Late fees waived for 30 days.",
            "type": "structural"
        }
    elif data.reason == "salary":
        intervention = {
             "action": "Grace Period",
             "message": "Payment date shifted by 7 days. No penalty.",
             "type": "liquidity"
        }
        
    return {"user": {"id": user.id, "status": user.status}, "intervention": intervention}

# --- Internal Logic Mocking ---

def generate_mock_shap(user):
    # Returns explanation for the score based on real fields
    reasons = []
    
    if user.epf_contribution == 0:
        reasons.append({"feature": "EPF Contribution", "impact": 15, "desc": "Lack of steady employment signal"})
    
    if user.distress_category and "Liquidity" in user.distress_category:
        reasons.append({"feature": "Liquidity Crunch", "impact": 18, "desc": "Low coverage ratio detected"})
        
    if user.credit_card_utilization > 50:
         reasons.append({"feature": "Credit Utilization", "impact": 12, "desc": f"Usage is {user.credit_card_utilization}% of limit"})

    if getattr(user, 'disaster_zone_flag', False):
         reasons.append({"feature": "Geo-Risk", "impact": 25, "desc": "Location in active disaster zone"})
        
    if not reasons:
         reasons.append({"feature": "General Risk", "impact": 5, "desc": "Standard usage patterns"})
         
    return reasons

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
