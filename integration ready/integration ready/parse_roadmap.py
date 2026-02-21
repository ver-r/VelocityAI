"""
parse_roadmap.py — Edit CONFIG then run: python parse_roadmap.py
"""

# ===========================================================================
# CONFIG
# ===========================================================================
REPO_PATH = r"C:\Users\naeva\OneDrive\Desktop\Makeathon 2026\developer-roadmap"

# Set ROLE to one of the 19 supported user-facing role names:
#
#   "Front End Developer"         → roadmap: frontend
#   "Back End Developer"          → roadmap: backend
#   "Full Stack Developer"        → roadmap: full-stack
#   "DevOps Engineer"             → roadmap: devops
#   "Platform Engineer"           → roadmap: devops          (closest match)
#   "Cloud Engineer"              → roadmap: aws             (closest match)
#   "Cloud Solutions Architect"   → roadmap: aws             (closest match)
#   "Software Engineer"           → roadmap: backend         (closest match)
#   "Data Analyst"                → roadmap: data-analyst
#   "Business Intelligence Analyst" → roadmap: data-analyst  (closest match)
#   "Data Scientist"              → roadmap: ai-data-scientist
#   "Machine Learning Engineer"   → roadmap: mlops
#   "MLOps Engineer"              → roadmap: mlops
#   "Artificial Intelligence Engineer" → roadmap: ai-engineer
#   "Cybersecurity Analyst"       → roadmap: cyber-security
#   "Network Security Engineer"   → roadmap: cyber-security  (closest match)
#   "UX Designer"                 → roadmap: ux-design
#   "Game Developer"              → roadmap: game-developer
#   "Product Manager"             → roadmap: product-manager

ROLE = "Front End Developer"

# Skills the user already knows — these will be HIGHLIGHTED (red) in the viewer
# rather than skipped. Use exact skill names from the skill list.
KNOWN_SKILLS = ["HTML", "CSS"]

OUTPUT_FILE = "roadmap_data.json"
# ===========================================================================

import json, re
from pathlib import Path


# ---------------------------------------------------------------------------
# Role → repo folder name mapping
# ---------------------------------------------------------------------------
ROLE_TO_FOLDER = {
    "front end developer":              "frontend",
    "back end developer":               "backend",
    "full stack developer":             "full-stack",
    "devops engineer":                  "devops",
    "platform engineer":                "devops",           # closest match
    "cloud engineer":                   "aws",              # closest match
    "cloud solutions architect":        "aws",              # closest match
    "software engineer":                "backend",          # closest match
    "data analyst":                     "data-analyst",
    "business intelligence analyst":    "data-analyst",     # closest match
    "data scientist":                   "ai-data-scientist",
    "machine learning engineer":        "mlops",
    "mlops engineer":                   "mlops",
    "artificial intelligence engineer": "ai-engineer",
    "cybersecurity analyst":            "cyber-security",
    "network security engineer":        "cyber-security",   # closest match
    "ux designer":                      "ux-design",
    "game developer":                   "game-developer",
    "product manager":                  "product-manager",
}


def resolve_folder(role: str) -> str:
    """Map a user-facing role name to the roadmap.sh repo folder name."""
    key = role.strip().lower()
    if key in ROLE_TO_FOLDER:
        return ROLE_TO_FOLDER[key]
    # If already a valid folder name, pass through
    return key


def load_json(repo, folder):
    p = Path(repo) / "src/data/roadmaps" / folder / f"{folder}.json"
    if not p.exists():
        raise FileNotFoundError(
            f"Roadmap file not found: {p}\n"
            f"Make sure the repo is cloned and the role is supported."
        )
    return json.loads(p.read_text(encoding="utf-8"))


def get_content_dir(repo, folder):
    return Path(repo) / "src/data/roadmaps" / folder / "content"


def load_md(cdir, node_id):
    if not cdir.exists():
        return ""
    clean = node_id.rstrip("-")
    for f in cdir.glob("*.md"):
        part = f.stem.split("@")[-1] if "@" in f.stem else ""
        if part in (clean, node_id):
            return f.read_text(encoding="utf-8")
    return ""


def get_label(node):
    d = node.get("data", {})
    raw = d.get("label", d.get("title", d.get("text", "")))
    return re.sub(r"<[^>]+>", "", str(raw)).strip()


# Node types that are purely decorative / navigational — never show these
SKIP_TYPES = {
    "group", "label", "section", "column", "title",
    "vertical", "horizontal", "divider", "spacer",
    "text", "note", "annotation",
}

# Phrases that identify annotation-only nodes regardless of type
SKIP_PHRASES = [
    "visit ", "roadmap.sh", "beginner friendly",
    "check out", "more details", "for more", "https://",
    "vertical node", "horizontal node",
]


def is_annotation(label):
    low = label.lower()
    return any(p in low for p in SKIP_PHRASES)


def extract(repo, role_input, known_skills):
    folder = resolve_folder(role_input)
    print(f"Role : {role_input}  →  folder: {folder}")

    data  = load_json(repo, folder)
    nodes = data.get("nodes", [])
    edges = data.get("edges", [])
    cdir  = get_content_dir(repo, folder)

    known_lower = {s.lower().strip() for s in known_skills}

    # Build edge connection set
    connected_ids = set()
    for e in edges:
        def norm(s): return s.split("__")[0] if "__" in s else s
        connected_ids.add(norm(e.get("source", "")))
        connected_ids.add(norm(e.get("target", "")))

    out_nodes = []
    for n in nodes:
        label = get_label(n)
        if not label:
            continue

        ntype = (n.get("type") or "").lower()

        # Filter out decorative node types
        if ntype in SKIP_TYPES:
            continue

        # Filter out annotation text regardless of type
        if is_annotation(label):
            continue

        # Filter: unconnected nodes with long labels are almost always annotations
        if n["id"] not in connected_ids and len(label) > 35:
            continue

        pos   = n.get("position", {})
        style = n.get("style", {})
        nd    = n.get("data", {})

        w = style.get("width") or nd.get("width") or n.get("width") or (200 if ntype != "subtopic" else 150)
        h = style.get("height") or nd.get("height") or n.get("height") or 40

        try:
            w = float(str(w).replace("px", ""))
            h = float(str(h).replace("px", ""))
        except:
            w, h = 200, 40

        out_nodes.append({
            "id":      n["id"],
            "label":   label,
            "type":    ntype,
            "x":       float(pos.get("x", 0)),
            "y":       float(pos.get("y", 0)),
            "w":       w,
            "h":       h,
            "content": load_md(cdir, n["id"]),
            # "known" = true means the user already knows this skill → highlighted red in viewer
            "known":   label.lower() in known_lower,
            # Keep "skipped" as an alias for backwards compatibility with existing viewer
            "skipped": label.lower() in known_lower,
        })

    # Edges — only between visible nodes
    node_ids = {n["id"] for n in out_nodes}

    def norm(s):
        return s.split("__")[0] if "__" in s else s

    out_edges = []
    for e in edges:
        src = norm(e.get("source", ""))
        tgt = norm(e.get("target", ""))
        if src not in node_ids or tgt not in node_ids:
            continue
        estyle = e.get("style") or {}
        out_edges.append({
            "id":     e.get("id", f"{src}-{tgt}"),
            "source": src,
            "target": tgt,
            "dashed": bool(
                estyle.get("strokeDasharray") or
                "dashed" in str(e.get("type", "")).lower()
            ),
        })

    return {
        "role":   role_input,
        "folder": folder,
        "nodes":  out_nodes,
        "edges":  out_edges,
        "known":  list(known_lower),
    }


def main():
    print(f"Repo : {REPO_PATH}")
    print(f"Known skills (highlighted red): {KNOWN_SKILLS}")

    result = extract(REPO_PATH, ROLE, KNOWN_SKILLS)

    types = {}
    for node in result["nodes"]:
        types[node["type"]] = types.get(node["type"], 0) + 1

    known_count = sum(1 for n in result["nodes"] if n["known"])
    print(f"Nodes: {len(result['nodes'])}  Edges: {len(result['edges'])}")
    print(f"Known/highlighted nodes: {known_count}")
    print(f"Types: {types}")

    Path(OUTPUT_FILE).write_text(
        json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"Saved → {OUTPUT_FILE}")


if __name__ == "__main__":
    main()