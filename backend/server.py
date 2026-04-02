import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow all origins to bypass CORS issues on Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NuzlockeRun(BaseModel):
    game: str
    name: str

# In-memory storage (Resets on Railway deploy. Connect a DB later for permanent saves!)
runs_db = []
encounters_db = {}

@app.get("/")
def read_root():
    return {"message": "Nuzlocke Scanner API v1"}

@app.get("/api/nuzlocke/runs")
def get_runs():
    return runs_db

@app.post("/api/nuzlocke/runs")
def create_run(run: NuzlockeRun):
    new_id = str(len(runs_db) + 1)
    new_run = {"id": new_id, "game": run.game, "name": run.name}
    runs_db.append(new_run)
    encounters_db[new_id] = [] # Initialize empty encounter list
    return new_run

# --- NEW FIXES: Added missing endpoints for NuzlockeRunPage.js ---

@app.get("/api/nuzlocke/runs/{run_id}")
def get_single_run(run_id: str):
    run = next((r for r in runs_db if str(r["id"]) == run_id), None)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

@app.get("/api/nuzlocke/runs/{run_id}/encounters")
def get_run_encounters(run_id: str):
    if run_id not in encounters_db:
        return []
    return encounters_db[run_id]
