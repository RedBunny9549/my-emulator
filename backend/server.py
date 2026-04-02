import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# THE MAGIC FIX: Allow all origins so Vercel can always connect
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

# In-memory storage for demonstration (replace with MongoDB logic if you have it)
runs_db = []

@app.get("/api/nuzlocke/runs")
def get_runs():
    return runs_db

@app.post("/api/nuzlocke/runs")
def create_run(run: NuzlockeRun):
    new_run = {"id": str(len(runs_db) + 1), "game": run.game, "name": run.name}
    runs_db.append(new_run)
    return new_run

@app.get("/")
def read_root():
    return {"message": "Nuzlocke Scanner API v1"}
