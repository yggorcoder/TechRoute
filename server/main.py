# server/main.py
import os
import sys
from typing import Any, Dict
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Garante import do pacote local no App Service
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.routers import router as visit_router  # after sys.path
from api.auth_router import router as auth_router
from application.auth_service import seed_fake_db

# ---------- Lifespan (substitui on_event) ----------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP
    try:
        seed_fake_db()
        print("[seed] fake users loaded")
    except Exception as e:
        print("[seed][WARN]", e)
    yield
    # SHUTDOWN (se precisar, limpe recursos aqui)
    # ex.: fechar conexões, etc.

app = FastAPI(title="TechRoute API", lifespan=lifespan)

# ---------- CORS ----------
origins = [
    "https://calm-wave-0e27f731e.3.azurestaticapps.net",
    "http://localhost",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Routers ----------
app.include_router(visit_router)
app.include_router(auth_router, prefix="/auth")

# ---------- Utilitários ----------
@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}

class EchoPayload(BaseModel):
    data: Dict[str, Any]

@app.post("/echo")
def echo(payload: EchoPayload) -> Dict[str, Any]:
    return {"you_sent": payload.data}

@app.get("/")
def root() -> Dict[str, str]:
    return {"name": "TechRoute API", "docs": "/docs"}
