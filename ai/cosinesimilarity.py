import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ==========================================
# CONFIG
# ==========================================

EMBEDDINGS_FILE = r"E:\baba bandooks\role_skill_embeddings.npy"
MAPPING_FILE = r"E:\baba bandooks\embedding_index_mapping.csv"
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
TOP_K = 5

# ==========================================
# LOAD DATA
# ==========================================

print("Loading embeddings...")
embeddings = np.load(EMBEDDINGS_FILE)

print("Loading mapping file...")
mapping_df = pd.read_csv(MAPPING_FILE)

print("Loading MiniLM model...")
model = SentenceTransformer(MODEL_NAME)

# ==========================================
# USER INPUT
# ==========================================

user_input = input("\nEnter your query (role or skills): ")

# Convert user query to embedding
query_embedding = model.encode(
    [user_input],
    convert_to_numpy=True,
    normalize_embeddings=True
)

# ==========================================
# COSINE SIMILARITY
# ======================p====================

similarities = cosine_similarity(query_embedding, embeddings)[0]

# Get top K indices
top_indices = np.argsort(similarities)[-TOP_K:][::-1]

# ==========================================
# DISPLAY RESULTS
# ==========================================

print("\nTop 5 Most Similar Roles + Skills:\n")

for rank, idx in enumerate(top_indices, 1):
    score = similarities[idx]
    role = mapping_df.iloc[idx]["Role"]
    skills = mapping_df.iloc[idx]["Skill"]

    print(f"{rank}. Similarity Score: {score:.4f}")
    print(f"   Role  : {role}")
    print(f"   Skills: {skills}")
    print("-" * 60)