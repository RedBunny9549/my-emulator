from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Emulator API", version="1.0.0")

# Netlify static frontend - no backend needed. CORS kept permissive for local dev.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Emulator API - Netlify static frontend, no backend required"}


@app.get("/api/health")
def health():
    return {"status": "ok"}
