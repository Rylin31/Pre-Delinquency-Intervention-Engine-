from datetime import datetime

# Mock Database
USERS = {
    "U-1024": {
        "id": "U-1024",
        "name": "Arjun Mehta",
        "occupation": "Software Engineer",
        "income": 120000,
        "epf_contribution": 1800,
        "investment_liquidity": 45000,
        "total_liability": 35000,
        "risk_score": 82,
        "history": [65, 68, 72, 78, 80, 82],
        "distress_reason": None,
        "status": "Critical",
        "volatility": "High",
        "last_action": "Discovery Sent"
    },
    "U-1025": {
        "id": "U-1025",
        "name": "Priya Sharma",
        "occupation": "Freelance Designer",
        "income": 85000,
        "epf_contribution": 0,
        "investment_liquidity": 120000,
        "total_liability": 15000,
        "risk_score": 65,
        "history": [40, 42, 45, 50, 60, 65],
        "distress_reason": None,
        "status": "Warning",
        "volatility": "Medium",
        "last_action": "Pending"
    },
    "U-1028": {
        "id": "U-1028",
        "name": "Rohan Gupta",
        "occupation": "Day Trader",
        "income": 200000, # Volatile
        "epf_contribution": 0,
        "investment_liquidity": 500000,
        "total_liability": 800000,
        "risk_score": 88,
        "history": [55, 60, 85, 45, 88], # Highly volatile
        "distress_reason": None, 
        "status": "Critical",
        "volatility": "Extreme",
         "last_action": "Intervention"
    },
    "U-1031": {
        "id": "U-1031",
        "name": "Sita Verma",
        "occupation": "Teacher",
        "income": 45000,
        "epf_contribution": 1000,
        "investment_liquidity": 20000,
        "total_liability": 5000,
        "risk_score": 54, 
        "history": [50, 52, 51, 53, 54],
        "distress_reason": None,
        "status": "Warning",
        "volatility": "Low",
        "last_action": "Clean"
    }
}

def get_all_users():
    return list(USERS.values())

def get_user(user_id):
    return USERS.get(user_id)

def update_user_distress(user_id, reason):
    if user_id in USERS:
        USERS[user_id]["distress_reason"] = reason
        # Simulate Gates Logic update
        if reason == "job":
            USERS[user_id]["risk_score"] = 95 # Skyrocket risk
            USERS[user_id]["status"] = "Emergency"
        elif reason == "salary":
            USERS[user_id]["risk_score"] = max(USERS[user_id]["risk_score"], 70)
            USERS[user_id]["status"] = "Warning"
        return USERS[user_id]
    return None
