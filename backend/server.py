from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# --- Models ---
class NuzlockeRun(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    game: str
    core: str
    status: str = "active"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class NuzlockeRunCreate(BaseModel):
    name: str
    game: str
    core: str

class NuzlockeRunUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None

class Encounter(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    run_id: str
    location: str
    pokemon: str
    nickname: Optional[str] = None
    level: int = 1
    status: str = "alive"
    hp_percent: int = 100
    is_starter: bool = False
    notes: Optional[str] = None
    moves: Optional[List[str]] = []
    caught_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class EncounterCreate(BaseModel):
    location: str
    pokemon: str
    nickname: Optional[str] = None
    level: int = 1
    status: str = "alive"
    hp_percent: int = 100
    is_starter: bool = False
    notes: Optional[str] = None
    moves: Optional[List[str]] = []

class EncounterUpdate(BaseModel):
    status: Optional[str] = None
    nickname: Optional[str] = None
    level: Optional[int] = None
    hp_percent: Optional[int] = None
    notes: Optional[str] = None
    moves: Optional[List[str]] = None

# --- Routes ---
@api_router.get("/")
async def root():
    return {"message": "Nuzlocke Scanner API v1"}

@api_router.get("/nuzlocke/runs")
async def get_runs():
    runs = await db.nuzlocke_runs.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    result = []
    for run in runs:
        total = await db.encounters.count_documents({"run_id": run["id"]})
        alive = await db.encounters.count_documents({"run_id": run["id"], "status": "alive"})
        dead = await db.encounters.count_documents({"run_id": run["id"], "status": "dead"})
        result.append({**run, "total_encounters": total, "alive_count": alive, "dead_count": dead})
    return result

@api_router.post("/nuzlocke/runs")
async def create_run(data: NuzlockeRunCreate):
    run = NuzlockeRun(**data.model_dump())
    await db.nuzlocke_runs.insert_one(run.model_dump())
    return run

@api_router.get("/nuzlocke/runs/{run_id}")
async def get_run(run_id: str):
    run = await db.nuzlocke_runs.find_one({"id": run_id}, {"_id": 0})
    if not run:
        raise HTTPException(404, "Run not found")
    return run

@api_router.put("/nuzlocke/runs/{run_id}")
async def update_run(run_id: str, data: NuzlockeRunUpdate):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    update['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await db.nuzlocke_runs.update_one({"id": run_id}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(404, "Run not found")
    return await db.nuzlocke_runs.find_one({"id": run_id}, {"_id": 0})

@api_router.delete("/nuzlocke/runs/{run_id}")
async def delete_run(run_id: str):
    await db.nuzlocke_runs.delete_one({"id": run_id})
    await db.encounters.delete_many({"run_id": run_id})
    return {"deleted": True}

@api_router.get("/nuzlocke/runs/{run_id}/encounters")
async def get_encounters(run_id: str):
    encounters = await db.encounters.find({"run_id": run_id}, {"_id": 0}).sort("caught_at", -1).to_list(200)
    return encounters

@api_router.post("/nuzlocke/runs/{run_id}/encounters")
async def add_encounter(run_id: str, data: EncounterCreate):
    run = await db.nuzlocke_runs.find_one({"id": run_id})
    if not run:
        raise HTTPException(404, "Run not found")
    encounter = Encounter(run_id=run_id, **data.model_dump())
    await db.encounters.insert_one(encounter.model_dump())
    return encounter

@api_router.put("/nuzlocke/encounters/{encounter_id}")
async def update_encounter(encounter_id: str, data: EncounterUpdate):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    result = await db.encounters.update_one({"id": encounter_id}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(404, "Encounter not found")
    return await db.encounters.find_one({"id": encounter_id}, {"_id": 0})

@api_router.delete("/nuzlocke/encounters/{encounter_id}")
async def delete_encounter(encounter_id: str):
    await db.encounters.delete_one({"id": encounter_id})
    return {"deleted": True}

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()