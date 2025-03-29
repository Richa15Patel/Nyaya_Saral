import sqlite3
import json
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib

# Load IPC data
with open("ipc_translated.json", "r", encoding="utf-8") as f:
    ipc_data = json.load(f)

# Connect to SQLite database (or create it)
conn = sqlite3.connect("ipc.db")
cursor = conn.cursor()

# Drop the table if it exists
cursor.execute("DROP TABLE IF EXISTS ipc")

# Create IPC table with the translations column
cursor.execute('''
    CREATE TABLE ipc (
        id INTEGER PRIMARY KEY,
        section TEXT,
        description TEXT,
        offense TEXT,
        punishment TEXT,
        translations TEXT
    )
''')

# Insert IPC data into database
for item in ipc_data:
    cursor.execute(
        "INSERT INTO ipc (section, description, offense, punishment, translations) VALUES (?, ?, ?, ?, ?)",
        (
            item["Section"],
            item["Description"],
            item["Offense"],
            item["Punishment"],
            json.dumps(item.get("translations", {}))
        )
    )

conn.commit()
conn.close()

# Build TF-IDF index on the descriptions
descriptions = [item["Description"] for item in ipc_data]
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(descriptions)

# Save the vectorizer and matrix to disk
joblib.dump(vectorizer, "tfidf_vectorizer.joblib")
joblib.dump(tfidf_matrix, "tfidf_matrix.joblib")

print("✅ Database created and TF-IDF index saved successfully!")