# Velocity - AI-Powered Career Risk Analysis Platform

> Intelligent career resilience platform that analyzes your skills, predicts market trends, and recommends personalized learning paths to future-proof your career.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Python](https://img.shields.io/badge/python-%3E%3D3.9-blue.svg)

---

## 🚀 Overview

Velocity helps professionals stay ahead of market changes by:

- **AI-Powered Role Matching** - Find career paths that align with your skills using semantic similarity
- **Skill Risk Analysis** - Identify which skills are declining and which are growing
- **Career Resilience Score** - Get a quantified measure of your career stability
- **Personalized Roadmaps** - Interactive learning paths tailored to your goals
- **Market Trends Dashboard** - Real-time insights into tech skill demand

---

## 🎯 Key Features

### 1. Smart Skills Assessment
- Select from 50+ categorized technical skills
- Choose from 40+ career roles
- Instant AI analysis of your profile

### 2. AI-Driven Insights
- **Role Matching**: Top 5 career recommendations with confidence scores
- **Risk Prediction**: ML-powered decline risk for each skill
- **Context-Aware Scoring**: Adjusts for high-demand vs declining technologies

### 3. Interactive Roadmaps
- Visual learning paths for each recommended role
- Highlights skills you already know
- Shows gaps and learning priorities
- Provides resources to study from

### 4. Market Intelligence
- Top growing skills in the market
- Top declining skills to avoid
- Market stability index
- Risk distribution analytics

---

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │ ───> │   Backend   │ ───> │ AI Service  │ ───> │  MongoDB    │
│  (React)    │ <─── │  (Node.js)  │ <─── │  (FastAPI)  │      │  Database   │
│  Port 5174  │      │  Port 5000  │      │  Port 8000  │      └─────────────┘
└─────────────┘      └─────────────┘      └─────────────┘
                                                 │
                                                 ↓
                                         ┌─────────────┐
                                         │  Roadmap    │
                                         │  (Flask)    │
                                         │  Port 5050  │
                                         └─────────────┘
```

### Tech Stack

**Frontend**
- React 18 + Vite
- Clerk Authentication
- React Router
- Tailwind CSS (custom styling)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Clerk SDK for JWT verification
- RESTful API design

**AI/ML Service**
- FastAPI (Python)
- SentenceTransformers (all-MiniLM-L6-v2)
- scikit-learn (Random Forest)
- NumPy + Pandas
- Cosine Similarity for role matching

**Roadmap Viewer**
- Flask (Python)
- Developer Roadmap integration
- Interactive SVG rendering

---

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **Python** >= 3.9
- **MongoDB** (Atlas account or local instance)
- **Clerk Account** (for authentication)

---

## 🛠️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/velocity.git
cd velocity
```

### 2. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

#### AI Service
```bash
cd ai
pip install -r ../requirements.txt
```

### 3. Environment Configuration

#### Frontend `.env`
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

#### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/velocity
CLERK_SECRET_KEY=sk_test_your_key_here
AI_SERVICE_URL=http://localhost:8000
```

### 4. Setup Clerk Authentication

1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Copy publishable key to frontend `.env`
4. Copy secret key to backend `.env`
5. Enable email/password authentication

### 5. Setup MongoDB

**Option A: MongoDB Atlas (Recommended)**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Add to backend `.env`

**Option B: Local MongoDB**
```bash
# Install MongoDB locally
# Update MONGO_URI to: mongodb://localhost:27017/velocity
```

---

## 🚀 Running the Application

### Development Mode

Open 4 terminal windows:

#### Terminal 1: Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5174
```

#### Terminal 2: Backend
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

#### Terminal 3: AI Service
```bash
cd ai
python server.py
# Or: uvicorn server:app --reload --port 8000
# Runs on http://localhost:8000
```

#### Terminal 4: Roadmap Viewer
```bash
cd integration_ready
python roadmap_server.py
# Runs on http://localhost:5050
```

### Access Application

Open browser to: **http://localhost:5174**

---

## 📁 Project Structure

```
velocity/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Quiz.jsx
│   │   │   └── dashboard/
│   │   │       ├── Overview.jsx
│   │   │       └── Trends.jsx
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API client
│   │   └── main.jsx
│   └── package.json
│
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   ├── quiz.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── trends.routes.js
│   │   ├── models/          # MongoDB schemas
│   │   │   └── User.js
│   │   ├── middleware/      # Auth middleware
│   │   │   └── clerkAuth.js
│   │   ├── config/          # Database config
│   │   │   └── db.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── ai/                       # Python AI service
│   ├── server.py            # FastAPI server
│   ├── embeddings.py        # Embedding generation
│   ├── cosinesimilarity.py  # Similarity calculations
│   ├── role_skill_embeddings.npy
│   ├── embedding_index_mapping.csv
│   ├── engineered_features.csv
│   ├── skill_decline_risk_model.pkl
│   └── skill_scaler.pkl
│
├── integration_ready/        # Roadmap viewer
│   ├── roadmap_server.py
│   ├── roadmap_viewer.html
│   └── developer-roadmap/   # Roadmap data
│
├── requirements.txt          # Python dependencies
├── package.json             # Root package config
└── README.md
```

---

## 🧠 How It Works

### 1. Skill Analysis Pipeline

```
User Skills → Text Embedding → Cosine Similarity → Top 5 Roles
                                                         ↓
                                              Feature Engineering
                                                         ↓
                                              ML Risk Prediction
                                                         ↓
                                              Context Adjustments
                                                         ↓
                                              Final Risk Scores
```

### 2. Risk Calculation

**Base Model**: Random Forest trained on:
- GitHub repository trends (EWMA)
- Search interest trends (EWMA)
- 3-month momentum indicators
- Growth/decline rates

**Context Adjustments**:
- High-demand skills (Python, React, AWS): -40% risk
- Declining skills (Flash, jQuery): +30% risk
- High-growth roles (Data Scientist, ML Engineer): -50% risk

**Risk Categories**:
- Low Risk: < 35%
- Medium Risk: 35% - 65%
- High Risk: > 65%

### 3. Role Matching

Uses **SentenceTransformer** (all-MiniLM-L6-v2) to:
1. Convert user skills to 384-dimensional embedding
2. Compare with pre-computed role embeddings
3. Calculate cosine similarity
4. Return top 5 matches with confidence scores

---

## 🎨 Screenshots

### Landing Page
Clean, modern interface with gradient backgrounds

### Skills Quiz
- Step 1: Select from 70+ categorized skills
- Step 2: Choose target career role

### Dashboard Overview
- Career resilience score
- AI-recommended roles with risk badges
- Skill decline risk analysis
- Interactive role cards

### Market Trends
- Top growing/declining skills
- Market stability gauge
- Risk distribution charts

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### AI Service Tests
```bash
cd ai
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🚢 Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend
```bash
# Set environment variables
# Deploy from backend/ directory
```

### AI Service
```bash
# Set Python runtime
# Deploy from ai/ directory
```

### Environment Variables
- Update CORS origins
- Use production MongoDB URI
- Use production Clerk keys
- Set NODE_ENV=production

---

## 🔒 Security

- JWT-based authentication via Clerk
- CORS protection (configurable origins)
- Input validation on all endpoints
- MongoDB injection prevention via Mongoose
- Environment variables for sensitive data
- No API keys exposed in frontend

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---
