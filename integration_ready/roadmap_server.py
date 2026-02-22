"""
roadmap_server.py — Flask API that generates roadmap JSON on demand.

Start with: python roadmap_server.py
Then your other component calls: GET /api/roadmap?role=Front+End+Developer&known=HTML,CSS

Or open the viewer directly:
  http://localhost:5050/viewer?role=Front+End+Developer&known=HTML,CSS
"""

import json
import re
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory, Response
from flask_cors import CORS

# ── CONFIG ──────────────────────────────────────────────────────────────────
REPO_PATH = r"E:\VelocityAI\integration_ready\developer-roadmap"
PORT      = 5050
# ────────────────────────────────────────────────────────────────────────────

app = Flask(__name__, static_folder=".")
CORS(app)   # allow your quiz component (different port) to call this API

# ── Role → repo folder mapping ───────────────────────────────────────────────
ROLE_TO_FOLDER = {
    "front end developer":               "frontend",
    "back end developer":                "backend",
    "full stack developer":              "full-stack",
    "devops engineer":                   "devops",
    "platform engineer":                 "devops",
    "cloud engineer":                    "aws",
    "cloud solutions architect":         "aws",
    "software engineer":                 "backend",
    "data analyst":                      "data-analyst",
    "business intelligence analyst":     "bi-analyst",
    "data scientist":                    "ai-data-scientist",
    "machine learning engineer":         "machine-learning",
    "mlops engineer":                    "mlops",
    "artificial intelligence engineer":  "ai-engineer",
    "cybersecurity analyst":             "cyber-security",
    "network security engineer":         "cyber-security",
    "ux designer":                       "ux-design",
    "game developer":                    "game-developer",
    "product manager":                   "product-manager",
}

SKIP_TYPES = {
    "group","label","section","column","title",
    "vertical","horizontal","divider","spacer",
    "text","note","annotation",
}
SKIP_PHRASES = [
    "visit ","roadmap.sh","beginner friendly",
    "check out","more details","for more","https://",
    "vertical node","horizontal node",
]


# ── Core extraction logic ────────────────────────────────────────────────────

def resolve_folder(role: str) -> str:
    return ROLE_TO_FOLDER.get(role.strip().lower(), role.strip().lower())


def get_label(node):
    d = node.get("data", {})
    raw = d.get("label", d.get("title", d.get("text", "")))
    return re.sub(r"<[^>]+>", "", str(raw)).strip()


def is_annotation(label):
    low = label.lower()
    return any(p in low for p in SKIP_PHRASES)


def load_md(cdir, node_id):
    if not cdir.exists():
        return ""
    clean = node_id.rstrip("-")
    for f in cdir.glob("*.md"):
        part = f.stem.split("@")[-1] if "@" in f.stem else ""
        if part in (clean, node_id):
            return f.read_text(encoding="utf-8")
    return ""


def extract(role_input: str, known_skills: list[str]) -> dict:
    folder   = resolve_folder(role_input)
    repo     = Path(REPO_PATH)
    json_path = repo / "src/data/roadmaps" / folder / f"{folder}.json"

    if not json_path.exists():
        raise FileNotFoundError(
            f"Roadmap not found for role '{role_input}' (folder: '{folder}'). "
            f"Expected: {json_path}"
        )

    data  = json.loads(json_path.read_text(encoding="utf-8"))
    nodes = data.get("nodes", [])
    edges = data.get("edges", [])
    cdir  = repo / "src/data/roadmaps" / folder / "content"
    known_lower = {s.lower().strip() for s in known_skills}

    # Connected node IDs
    connected_ids = set()
    def norm(s): return s.split("__")[0] if "__" in s else s
    for e in edges:
        connected_ids.add(norm(e.get("source", "")))
        connected_ids.add(norm(e.get("target", "")))

    out_nodes = []
    for n in nodes:
        label = get_label(n)
        if not label:
            continue
        ntype = (n.get("type") or "").lower()
        if ntype in SKIP_TYPES:
            continue
        if is_annotation(label):
            continue
        if n["id"] not in connected_ids and len(label) > 35:
            continue

        pos   = n.get("position", {})
        style = n.get("style", {})
        nd    = n.get("data", {})
        w = style.get("width") or nd.get("width") or n.get("width") or (200 if ntype != "subtopic" else 150)
        h = style.get("height") or nd.get("height") or n.get("height") or 40
        try:
            w = float(str(w).replace("px",""))
            h = float(str(h).replace("px",""))
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
            "known":   label.lower() in known_lower,
            "skipped": label.lower() in known_lower,   # alias for viewer
        })

    node_ids = {n["id"] for n in out_nodes}
    out_edges = []
    for e in edges:
        src = norm(e.get("source",""))
        tgt = norm(e.get("target",""))
        if src not in node_ids or tgt not in node_ids:
            continue
        estyle = e.get("style") or {}
        out_edges.append({
            "id":     e.get("id", f"{src}-{tgt}"),
            "source": src,
            "target": tgt,
            "dashed": bool(
                estyle.get("strokeDasharray") or
                "dashed" in str(e.get("type","")).lower()
            ),
        })

    return {
        "role":   role_input,
        "folder": folder,
        "nodes":  out_nodes,
        "edges":  out_edges,
        "known":  list(known_lower),
    }


# ── API Routes ───────────────────────────────────────────────────────────────

@app.route("/api/roadmap")
def api_roadmap():
    """
    GET /api/roadmap?role=Front+End+Developer&known=HTML,CSS,JavaScript

    Returns roadmap JSON directly — call this from your quiz component
    to get data, or redirect user to /viewer for the visual roadmap.
    """
    role = request.args.get("role", "").strip()
    if not role:
        return jsonify({"error": "Missing 'role' parameter"}), 400

    known_raw = request.args.get("known", "")
    known = [s.strip() for s in known_raw.split(",") if s.strip()] if known_raw else []

    try:
        result = extract(role, known)
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Extraction failed: {e}"}), 500

    return jsonify(result)


@app.route("/viewer")
def viewer():
    """
    GET /viewer?role=Front+End+Developer&known=HTML,CSS

    Serves the roadmap_viewer.html page.
    The page reads ?role and ?known from the URL and fetches /api/roadmap.
    """
    return send_from_directory(".", "roadmap_viewer.html")


@app.route("/api/roles")
def api_roles():
    """Returns all supported roles and their mapped folders."""
    return jsonify({
        "roles": [
            {"role": k.title(), "folder": v}
            for k, v in ROLE_TO_FOLDER.items()
        ]
    })


if __name__ == "__main__":
    print(f"\n  Roadmap API running at http://localhost:{PORT}")
    print(f"  Example: http://localhost:{PORT}/viewer?role=Front+End+Developer&known=HTML,CSS\n")

  import os
  app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
