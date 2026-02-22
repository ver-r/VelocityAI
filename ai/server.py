# ==========================================
# server.py
# Intelligent Career Risk System Backend
# ==========================================

import numpy as np
import pandas as pd
import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ==========================================
# CONFIG
# ==========================================

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
EMBEDDINGS_FILE = BASE_DIR / "role_skill_embeddings.npy"

embeddings = np.load(EMBEDDINGS_FILE)


MAPPING_FILE = BASE_DIR / "embedding_index_mapping.csv"
ENGINEERED_FEATURES_FILE = BASE_DIR / "engineered_features.csv"
MODEL_FILE = BASE_DIR / "skill_decline_risk_model.pkl"
SCALER_FILE = BASE_DIR / "skill_scaler.pkl"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
TOP_K = 5

# ==========================================
# LOAD EVERYTHING ON STARTUP
# ==========================================

print("Loading embeddings...")
embeddings = np.load(EMBEDDINGS_FILE)

print("Loading mapping...")
mapping_df = pd.read_csv(MAPPING_FILE)

print("Loading engineered features...")
features_df = pd.read_csv(ENGINEERED_FEATURES_FILE)

print("Loading risk model...")
risk_model = joblib.load(MODEL_FILE)
scaler = joblib.load(SCALER_FILE)
print("Loading MiniLM model...")
embedder = SentenceTransformer(MODEL_NAME)

print("System Ready ✅")

# ==========================================
# FASTAPI INIT
# ==========================================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to backend service
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# REQUEST FORMAT
# ==========================================

class UserInput(BaseModel):
    text: str   # e.g. "python, nlp, deep learning"


# ==========================================
# HELPER FUNCTIONS
# ==========================================

def get_top_roles_and_skills(user_text):
    
    query_embedding = embedder.encode(
        [user_text],
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    similarities = cosine_similarity(query_embedding, embeddings)[0]

    top_indices = np.argsort(similarities)[-TOP_K:][::-1]

    results = []
    all_skills = []

    for idx in top_indices:
        role = mapping_df.iloc[idx]["Role"]
        skills = mapping_df.iloc[idx]["Skill"]

        skill_list = [s.strip().lower() for s in skills.split(",")]
        all_skills.extend(skill_list)

        results.append({
            "role": role,
            "skills": skill_list,
            "similarity_score": float(similarities[idx])
        })

    return results, list(set(all_skills))


def compute_skill_risk(skills_list):
    """
    Compute skill decline risk with context-aware adjustments
    """
    # High-demand skills that should have lower risk
    HIGH_DEMAND_SKILLS = {
        'python', 'javascript', 'typescript', 'react', 'node.js', 'aws',
        'docker', 'kubernetes', 'machine learning', 'deep learning', 
        'data science', 'ai', 'nlp', 'tensorflow', 'pytorch', 'sql',
        'postgresql', 'mongodb', 'rest', 'api design', 'system design',
        'microservices', 'cloud', 'devops', 'ci/cd', 'git'
    }
    
    # Legacy or declining skills
    DECLINING_SKILLS = {
        'flash', 'silverlight', 'perl', 'cobol', 'visual basic',
        'jquery', 'backbone.js', 'angular.js'
    }

    skill_risks = []

    for skill in skills_list:
        skill_lower = skill.lower()
        
        skill_data = features_df[
            features_df["skill"].str.lower() == skill_lower
        ]

        if len(skill_data) == 0:
            # If skill not in dataset, assume moderate-low risk for unknown skills
            base_prob = 0.35
        else:
            skill_row = skill_data.iloc[0]
            model_features = scaler.feature_names_in_
            X_df = pd.DataFrame(
                [skill_row[model_features].values],
                columns=model_features
            )
            X_scaled = scaler.transform(X_df)
            base_prob = risk_model.predict_proba(X_scaled)[0][1]

        # Apply context-aware adjustments
        adjusted_prob = base_prob
        
        # Reduce risk for high-demand skills
        if skill_lower in HIGH_DEMAND_SKILLS:
            adjusted_prob = base_prob * 0.6  # 40% reduction
        
        # Increase risk for known declining skills
        elif skill_lower in DECLINING_SKILLS:
            adjusted_prob = min(0.95, base_prob * 1.3)
        
        # Cap the risk at reasonable levels
        adjusted_prob = max(0.05, min(0.90, adjusted_prob))

        skill_risks.append({
            "skill": skill,
            "decline_risk_probability": float(adjusted_prob),
            "raw_model_score": float(base_prob)
        })

    return skill_risks


def compute_role_decline_risk(role_name, role_skills):
    """
    Compute role decline risk with market-aware adjustments
    """
    # High-growth roles that should have lower risk
    HIGH_GROWTH_ROLES = {
        'data scientist', 'machine learning engineer', 'ai engineer',
        'cloud engineer', 'devops engineer', 'full stack developer',
        'software engineer', 'data engineer', 'mlops engineer',
        'cloud solutions architect', 'platform engineer', 'site reliability engineer'
    }
    
    # Declining or saturated roles
    DECLINING_ROLES = {
        'flash developer', 'webmaster', 'data entry specialist'
    }
    
    skill_list = [s.strip().lower() for s in role_skills.split(",")]
    risk_scores = []
    
    for skill in skill_list:
        skill_data = features_df[features_df["skill"].str.lower() == skill.lower()]
        if len(skill_data) == 0:
            continue
            
        skill_row = skill_data.iloc[0]
        model_features = scaler.feature_names_in_
        X_df = pd.DataFrame([skill_row[model_features].values], columns=model_features)
        X_scaled = scaler.transform(X_df)
        prob = risk_model.predict_proba(X_scaled)[0][1]
        risk_scores.append(prob)
    
    if not risk_scores:
        return None
    
    avg_risk = np.mean(risk_scores)
    max_risk = np.max(risk_scores)
    high_risk_count = sum(1 for r in risk_scores if r > 0.6)
    
    # Base calculation
    base_role_score = 0.5 * avg_risk + 0.3 * max_risk + 0.2 * (high_risk_count / len(risk_scores))
    
    # Apply role-specific adjustments
    role_lower = role_name.lower()
    adjusted_score = base_role_score
    
    if role_lower in HIGH_GROWTH_ROLES:
        adjusted_score = base_role_score * 0.5  # 50% reduction for high-growth roles
    elif role_lower in DECLINING_ROLES:
        adjusted_score = min(0.95, base_role_score * 1.4)
    
    # Cap at reasonable levels
    adjusted_score = max(0.05, min(0.85, adjusted_score))
    
    # Determine risk category with adjusted thresholds
    if adjusted_score < 0.35:
        risk_category = "Low Risk"
    elif adjusted_score < 0.65:
        risk_category = "Medium Risk"
    else:
        risk_category = "High Risk"
    
    return {
        "role": role_name,
        "role_decline_score": float(adjusted_score),
        "risk_category": risk_category,
        "average_skill_risk": float(avg_risk),
        "highest_skill_risk": float(max_risk),
        "high_risk_skills_count": high_risk_count,
        "total_skills_analyzed": len(risk_scores)
    }


# ==========================================
# MAIN API ROUTE
# ==========================================

@app.post("/analyze")
def analyze(user_input: UserInput):

    roles_output, skills_list = get_top_roles_and_skills(user_input.text)

    skill_risk_output = compute_skill_risk(skills_list)
    
    # Compute role decline risk for each matched role
    role_decline_analysis = []
    for role_data in roles_output:
        role_name = role_data["role"]
        role_skills = role_data["skills"]
        role_skills_str = ", ".join(role_skills)
        
        role_risk = compute_role_decline_risk(role_name, role_skills_str)
        if role_risk:
            role_risk["similarity_score"] = role_data["similarity_score"]
            role_decline_analysis.append(role_risk)

    return {
        "matched_roles": roles_output,
        "skill_decline_risk": skill_risk_output,
        "role_decline_analysis": role_decline_analysis
    }

@app.get("/health")
def health():
    return {"status": "AI service running 🚀"}

@app.get("/market-trends")
def market_trends():

    all_results = []

    model_features = scaler.feature_names_in_

    for _, row in features_df.iterrows():

        X_df = pd.DataFrame(
            [row[model_features].values],
            columns=model_features
        )

        X_scaled = scaler.transform(X_df)
        prob = risk_model.predict_proba(X_scaled)[0][1]

        all_results.append({
            "skill": row["skill"],
            "decline_risk_probability": float(prob)
        })

    trends_df = pd.DataFrame(all_results)

    # Sort ascending = growing
    top_growing = trends_df.sort_values(
        "decline_risk_probability"
    ).head(5)

    # Sort descending = declining
    top_declining = trends_df.sort_values(
        "decline_risk_probability",
        ascending=False
    ).head(5)

    # Market Stability Index
    stability_index = float(
        1 - trends_df["decline_risk_probability"].mean()
    )

    # Risk Buckets
    low = len(trends_df[trends_df["decline_risk_probability"] < 0.33])
    medium = len(
        trends_df[
            (trends_df["decline_risk_probability"] >= 0.33) &
            (trends_df["decline_risk_probability"] < 0.66)
        ]
    )
    high = len(trends_df[trends_df["decline_risk_probability"] >= 0.66])

    return {
        "top_growing_skills": top_growing.to_dict(orient="records"),
        "top_declining_skills": top_declining.to_dict(orient="records"),
        "market_stability_index": stability_index,
        "risk_distribution": {
            "low": low,
            "medium": medium,
            "high": high
        }
    }