A Flask server that sits between your quiz component and the viewer. Install deps with:
bashpip install flask flask-cors
python roadmap_server.py
```

It exposes 3 endpoints:
- **`GET /api/roadmap?role=Front+End+Developer&known=HTML,CSS`** — returns roadmap JSON. Your quiz component calls this.
- **`GET /viewer?role=Front+End+Developer&known=HTML,CSS`** — serves the visual roadmap page. Redirect user here when they click a role card.
- **`GET /api/roles`** — returns all 19 supported roles (useful for your quiz dropdown).

### `roadmap_viewer.html` (updated, minimal change)
Now reads `?role` and `?known` from the URL and fetches from `/api/roadmap` automatically. **Falls back to the old `roadmap_data.json` behaviour** if no URL params — so your existing setup still works.

### `parse_roadmap.py` (unchanged from last version)
Still works standalone for testing/pre-generating JSON files.

---

## How your quiz component integrates

When the user clicks one of the top-3 role cards, just redirect to:
```
http://localhost:5050/viewer?role=Data+Scientist&known=Python,Pandas,NumPy
The known param is a comma-separated list of whatever skills the user selected in step 1 of the quiz — those nodes will appear red/highlighted in the roadmap automatically.