from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json
import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Serve static files properly (CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# ✅ Serve the main HTML file when visiting "/"
@app.get("/")
def serve_home():
    return FileResponse("static/index.html")

# Load precomputed TF-IDF vectorizer and matrix
vectorizer = joblib.load("tfidf_vectorizer.joblib")
tfidf_matrix = joblib.load("tfidf_matrix.joblib")

def get_ipc_details(section, lang="English"):
    """Fetch IPC section details from SQLite database."""
    conn = sqlite3.connect("ipc.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ipc WHERE section=?", (section,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        translations = json.loads(row[5]) if row[5] else {}
        return {
            "Section": row[1],
            "Description": row[2],
            "Offense": row[3],
            "Punishment": row[4],
            "Translation": translations.get(lang, row[2])
        }
    return None

@app.get("/search/")
async def search_ipc(query: str, lang: str = "English"):
    """Search IPC sections using TF-IDF similarity."""
    query_vec = vectorizer.transform([query])
    sims = cosine_similarity(query_vec, tfidf_matrix)
    best_idx = np.argmax(sims, axis=1)[0]
    best_score = sims[0, best_idx]

    threshold = 0.1
    if best_score < threshold:
        return {"message": "No relevant IPC section found."}

    conn = sqlite3.connect("ipc.db")
    cursor = conn.cursor()
    cursor.execute("SELECT section FROM ipc ORDER BY id")
    sections = [row[0] for row in cursor.fetchall()]
    conn.close()

    best_section = sections[best_idx] if best_idx < len(sections) else None
    if best_section:
        return get_ipc_details(best_section, lang)
    
    return {"message": "No relevant IPC section found."}
