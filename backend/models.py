from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    occupation = Column(String)
    monthly_income = Column(Float)
    
    # Financial Stress Indicators
    current_risk_score = Column(Integer)
    status = Column(String) # Transient (Critical), Structural (Emergency), Clean
    distress_category = Column(String) # Transient, Structural, etc.
    final_score = Column(Integer) # Post-Calibration
    
    # Group A: Liquidity (Weight 30%)
    salary_credit_variance_days = Column(Integer, default=0) # Days delayed vs median
    liquidity_coverage_ratio = Column(Float, default=2.0) # Savings / BMI
    nach_failures_count = Column(Integer, default=0) 
    remittance_volatility_percent = Column(Float, default=0.0)
    
    # Group B: Debt (Weight 20%)
    micro_credit_tx_count = Column(Integer, default=0)
    credit_card_utilization = Column(Float, default=20.0) # Percentage
    atm_withdrawal_velocity = Column(Float, default=1.0) # vs 180-day avg
    inquiry_density_7_days = Column(Integer, default=0)
    
    # Group C: Operational (Weight 10%)
    discretionary_spend_reduction = Column(Float, default=0.0) # Percentage drop
    utility_payment_latency_days = Column(Integer, default=0)
    high_risk_merchant_tx_count = Column(Integer, default=0) # Gambling/Gaming
    insurance_premium_status = Column(String, default="Active") # Active, Lapsed
    
    # Group D: Assets (Weight 15%)
    sip_consistency_score = Column(Float, default=1.0)
    asset_volatility_flag = Column(Boolean, default=False)
    portfolio_liquidation_flag = Column(Boolean, default=False)
    pledge_activity_flag = Column(Boolean, default=False)
    
    # Group E: Employment (Weight 15%)
    epf_contribution = Column(Float)
    epf_gap_detected = Column(Boolean, default=False)
    tax_compliance_status = Column(String, default="Compliant")
    job_search_activity_index = Column(Float, default=0.0) # 0-1 scale
    
    # Group F: Geo-Environmental (Weight 10%)
    pincode = Column(String)
    disaster_zone_flag = Column(Boolean, default=False)
    infrastructure_failure_flag = Column(Boolean, default=False)
    
    # Relationships
    accounts = relationship("Account", back_populates="owner")
    transactions = relationship("Transaction", back_populates="owner")
    loans = relationship("Loan", back_populates="owner")

class Account(Base):
    __tablename__ = "accounts"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String)
    balance = Column(Float)
    bank_name = Column(String)
    
    owner = relationship("User", back_populates="accounts")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    account_id = Column(String, ForeignKey("accounts.id"))
    
    amount = Column(Float)
    currency = Column(String, default="INR")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    category = Column(String)
    merchant_name = Column(String)
    payment_mode = Column(String)
    transaction_type = Column(String)
    
    owner = relationship("User", back_populates="transactions")

class Loan(Base):
    __tablename__ = "loans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    
    loan_type = Column(String)  # Personal, Home, Auto, Education, Credit Card
    principal_amount = Column(Float)  # Original loan amount
    outstanding_amount = Column(Float)  # Remaining amount
    monthly_emi = Column(Float)  # Monthly EMI payment
    interest_rate = Column(Float)  # Annual interest rate
    tenure_months = Column(Integer)  # Total tenure in months
    remaining_months = Column(Integer)  # Remaining months
    start_date = Column(DateTime)
    
    owner = relationship("User", back_populates="loans")

