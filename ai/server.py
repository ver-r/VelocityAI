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

    skill_risks = []

    for skill in skills_list:

        skill_data = features_df[
            features_df["skill"].str.lower() == skill.lower()
        ]

        if len(skill_data) == 0:
            continue

        skill_row = skill_data.iloc[0]

        # 🔥 Use exact model features
        model_features = scaler.feature_names_in_

        X_df = pd.DataFrame(
            [skill_row[model_features].values],
            columns=model_features
        )

        X_scaled = scaler.transform(X_df)

        prob = risk_model.predict_proba(X_scaled)[0][1]

        skill_risks.append({
            "skill": skill,
            "decline_risk_probability": float(prob)
        })

    return skill_risks


# ==========================================
# MAIN API ROUTE
# ==========================================

@app.post("/analyze")
def analyze(user_input: UserInput):

    roles_output, skills_list = get_top_roles_and_skills(user_input.text)

    skill_risk_output = compute_skill_risk(skills_list)

    return {
        "matched_roles": roles_output,
        "skill_decline_risk": skill_risk_output
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