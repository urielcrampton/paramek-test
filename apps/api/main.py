from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os, psycopg2, psycopg2.extras, requests

app = FastAPI(title="WTI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://wti:wti@localhost:5434/wti")
COUNTRIES_API_BASE = os.getenv("COUNTRIES_API_BASE", "https://restcountries.com/v3.1")

def get_conn():
    return psycopg2.connect(DATABASE_URL)

class TripIn(BaseModel):
    name: str
    country: str
    start_date: str
    end_date: str
    notes: str = ""

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/")
def root():
    return {"message": "WTI API is running", "version": "1.0.0"}

# --- Countries proxy (API pública) ---
@app.get("/countries")
def countries(q: str = ""):
    url = f"{COUNTRIES_API_BASE}/name/{q}" if q else f"{COUNTRIES_API_BASE}/all"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    # reduce payload
    data = [{"name": x.get("name",{}).get("common"), "cca2": x.get("cca2"), "flag": x.get("flag")} for x in r.json()]
    return [d for d in data if d["name"]]

# --- CRUD Trips, SQL crudo + stored procedures ---
@app.get("/trips")
def list_trips():
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM trips ORDER BY id DESC")
            return cur.fetchall()

@app.post("/trips")
def create_trip(body: TripIn):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM sp_create_trip(%s,%s,%s,%s,%s)",
                        (body.name, body.country, body.start_date, body.end_date, body.notes))
            row = cur.fetchone()
            if not row: raise HTTPException(400, "create failed")
            conn.commit()
            return row

@app.put("/trips/{trip_id}")
def update_trip(trip_id: int, body: TripIn):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM sp_update_trip(%s,%s,%s,%s,%s,%s)",
                        (trip_id, body.name, body.country, body.start_date, body.end_date, body.notes))
            row = cur.fetchone()
            if not row: raise HTTPException(404, "not found")
            conn.commit()
            return row

@app.delete("/trips/{trip_id}")
def delete_trip(trip_id: int):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM trips WHERE id=%s", (trip_id,))
            if cur.rowcount == 0: raise HTTPException(404, "not found")
            conn.commit()
            return {"deleted": trip_id}