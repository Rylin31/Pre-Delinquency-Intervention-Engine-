# 🏦 Pre-Delinquency Intervention Engine

A sophisticated financial risk monitoring and early intervention system designed to identify customers at risk of loan default before delinquency occurs. Built with FastAPI, Next.js, and modern data analytics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-14-black.svg)

## 🎯 Overview

The Pre-Delinquency Intervention Engine uses advanced financial indicators and behavioral patterns to predict potential loan defaults **before** they happen. This proactive approach enables financial institutions to:

- **Reduce NPAs** (Non-Performing Assets) through early intervention
- **Improve customer retention** with timely support
- **Optimize risk management** using real-time analytics
- **Enhance portfolio health** through predictive insights

## ✨ Key Features

### 📊 Real-Time Risk Monitoring
- Multi-dimensional risk scoring algorithm
- 25+ financial health indicators
- Live dashboard with actionable insights
- Automated risk categorization (Critical, Warning, Safe, Clean)

### 🎯 Predictive Analytics
- **Liquidity Analysis**: Salary variance, LCR tracking
- **Debt Monitoring**: Credit utilization, micro-loan patterns
- **Behavioral Signals**: Merchant risk, gambling detection
- **Asset Liquidation**: SIP stoppage, portfolio pledging
- **Employment Indicators**: EPF gaps, job search activity
- **Geo-Environmental**: Disaster zones, infrastructure failures

### 💼 Comprehensive User Profiles
- 50+ diverse customer personas
- Realistic transaction patterns
- Multi-loan portfolio tracking
- Historical financial behavior

### 📈 Interactive Dashboards
- Portfolio exposure visualization
- Risk distribution charts
- Success rate metrics
- Recovery queue management

## 🏗️ Architecture

```
Pre-Delinquency-Intervention-Engine/
├── backend/                 # FastAPI Backend
│   ├── main.py             # API endpoints
│   ├── models.py           # SQLAlchemy models
│   ├── database.py         # Database configuration
│   ├── seed.py             # Data generation script
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable components
│   │   └── contexts/      # React contexts
│   ├── public/            # Static assets
│   └── package.json       # Node dependencies
│
├── .gitignore             # Git ignore rules
├── .env.example           # Environment template
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Rylin31/Pre-Delinquency-Intervention-Engine-.git
cd Pre-Delinquency-Intervention-Engine-
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (optional for local development)
cp ../.env.example .env

# Seed the database with sample data
python seed.py

# Start the backend server
uvicorn main:app --reload
```

Backend will run at: **http://127.0.0.1:8000**

API Documentation: **http://127.0.0.1:8000/docs**

#### 3️⃣ Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run at: **http://localhost:3000**

### 🎉 Access the Application

Open your browser and navigate to:
- **Dashboard**: http://localhost:3000
- **API Docs**: http://127.0.0.1:8000/docs

## 📚 API Endpoints

### Users
- `GET /api/users` - Get all users with risk profiles
- `GET /api/users/{user_id}` - Get specific user details
- `POST /api/users` - Create new user (admin)

### Analytics
- `GET /api/analytics/exposure` - Portfolio exposure metrics
- `GET /api/analytics/risk-distribution` - Risk category breakdown
- `GET /api/analytics/trends` - Historical trend analysis

### Loans
- `GET /api/loans/{user_id}` - Get user's loan portfolio
- `GET /api/loans/summary` - Aggregate loan statistics

### Transactions
- `GET /api/transactions/{user_id}` - User transaction history
- `GET /api/transactions/patterns` - Spending pattern analysis

## 🔒 Security Best Practices

### ⚠️ Before Deploying to Production

1. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` as a template
   - Store secrets in secure vaults (AWS Secrets Manager, Azure Key Vault)

2. **Database Security**
   - Change default database credentials
   - Use PostgreSQL/MySQL for production (not SQLite)
   - Enable SSL/TLS for database connections
   - Implement row-level security (RLS)

3. **API Security**
   - Implement JWT authentication
   - Add rate limiting
   - Enable CORS only for trusted domains
   - Use HTTPS in production

4. **Data Privacy**
   - Anonymize sensitive customer data
   - Implement GDPR/data protection compliance
   - Add audit logging
   - Encrypt data at rest and in transit

5. **Code Security**
   - Run `pip audit` for Python vulnerabilities
   - Run `npm audit` for Node.js vulnerabilities
   - Keep dependencies updated
   - Use environment-specific configurations

## 🛠️ Configuration

### Backend Configuration

Edit `backend/.env`:

```env
DATABASE_URL=sqlite:///./pre_delinquency.db
API_HOST=127.0.0.1
API_PORT=8000
CORS_ORIGINS=http://localhost:3000
```

### Frontend Configuration

Edit `frontend/src/app/page.js` (API endpoint):

```javascript
fetch('http://127.0.0.1:8000/api/users')
```

For production, use environment variables:

```javascript
fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`)
```

## 📊 Risk Scoring Algorithm

The system evaluates users across multiple dimensions:

### Liquidity Indicators (30%)
- Salary credit variance
- Liquidity Coverage Ratio (LCR)
- Remittance volatility

### Debt Indicators (25%)
- Credit card utilization
- Micro-credit transaction count
- Hard inquiry density

### Behavioral Indicators (20%)
- High-risk merchant transactions
- Utility payment latency
- Gambling/betting activity

### Asset Indicators (15%)
- SIP consistency score
- Portfolio liquidation flags
- Pledge activity

### Employment Indicators (10%)
- EPF contribution gaps
- Job search activity index
- Tax compliance status

## 🎨 UI Features

- **Barclays-Inspired Design**: Professional, minimalist aesthetic
- **Dark/Light Mode**: Theme persistence with localStorage
- **Responsive Charts**: Recharts with dynamic theming
- **Real-time Updates**: Live data refresh
- **Interactive Tables**: Sortable, filterable data views

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables in platform dashboard
2. Use PostgreSQL addon for database
3. Set `DATABASE_URL` to PostgreSQL connection string
4. Deploy using Git integration

### Frontend Deployment (Vercel/Netlify)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Add environment variable: `NEXT_PUBLIC_API_URL`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** - Modern Python web framework
- **Next.js** - React framework for production
- **Recharts** - Composable charting library
- **SQLAlchemy** - Python SQL toolkit
- **Framer Motion** - Animation library

## 📧 Contact

**Project Maintainer**: Rylin31

**GitHub**: [https://github.com/Rylin31](https://github.com/Rylin31)

**Repository**: [Pre-Delinquency-Intervention-Engine](https://github.com/Rylin31/Pre-Delinquency-Intervention-Engine-.git)

---

**⚠️ Disclaimer**: This is a demonstration project for educational purposes. For production use in financial institutions, ensure compliance with local regulations, data protection laws, and industry standards. Always consult with legal and compliance teams before deploying financial risk systems.

---

Made with ❤️ for better financial risk management
