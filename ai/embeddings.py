import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer

# ==========================================
# CONFIG
# ==========================================

INPUT_CSV = r"E:\baba bandooks\datasets\Role Skill Mapping.csv"
OUTPUT_EMB_FILE = "role_skill_embeddings.npy"
OUTPUT_MAPPING_FILE = "embedding_index_mapping.csv"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"  # MiniLM v2

# ==========================================
# LOAD CSV
# ==========================================

df = pd.read_csv(INPUT_CSV)

print("Columns in dataset:", df.columns.tolist())

# Ensure required columns exist
required_columns = ["Role", "Skill"]

for col in required_columns:
    if col not in df.columns:
        raise ValueError(f"Column '{col}' not found in CSV")

# Preserve original CSV index
df["original_index"] = df.index

# ==========================================
# CLEAN + COMBINE ROLE + SKILLS
# ==========================================

# Clean skill column (remove extra spaces)
df["Skill"] = df["Skill"].astype(str).apply(
    lambda x: ", ".join([s.strip() for s in x.split(",")])
)

# Combine Role + skill into one text string
texts = (
    df["Role"].astype(str) + " | " +
    df["Skill"].astype(str)
).tolist()

# ==========================================
# LOAD MODEL
# ==========================================

print("Loading MiniLM v2 model...")
model = SentenceTransformer(MODEL_NAME)

# ==========================================
# GENERATE EMBEDDINGS
# ==========================================

print("Generating embeddings...")
embeddings = model.encode(
    texts,
    batch_size=32,
    show_progress_bar=True,
    convert_to_numpy=True,
    normalize_embeddings=True  # important for cosine similarity
)

print("Embeddings shape:", embeddings.shape)

# ==========================================
# SAVE OUTPUT
# ==========================================

# Save embeddings
np.save(OUTPUT_EMB_FILE, embeddings)

# Save mapping file (to preserve index + text)
df[["original_index", "Role", "Skill"]].to_csv(
    OUTPUT_MAPPING_FILE,
    index=False
)

print("Done ✅")
print(f"Embeddings saved to: {OUTPUT_EMB_FILE}")
print(f"Mapping saved to: {OUTPUT_MAPPING_FILE}")



'''
import numpy as np
import pandas as pd

embeddings = np.load("role_skill_embeddings.npy")
mapping = pd.read_csv("embedding_index_mapping.csv")

# Example
i = 10
vector = embeddings[i]
role = mapping.iloc[i]["Role"]
skills = mapping.iloc[i]["skill"]'''