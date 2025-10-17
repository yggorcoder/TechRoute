# server/main.py
import os, sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, Dict
from pydantic import BaseModel

# Se o pacote "api" está dentro de server/, este append é desnecessário,
# mas pode ficar aqui sem problema:
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.routers import router as visit_router
from api.auth_router import router as auth_router

origins = [
    "https://calm-wave-0e27f731e.3.azurestaticapps.net",  # FRONT NA AZURE
    "http://localhost",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
]

app = FastAPI(title="TechRoute API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],     # garante OPTIONS/POST/PUT/DELETE
    allow_headers=["*"],
)

# 🔹 Prefixos explícitos — padroniza paths:
app.include_router(visit_router, prefix="/visits")
app.include_router(auth_router,  prefix="/auth")

# 🔹 Healthcheck para validar subida:
@app.get("/health")
def health():
    return {"status": "ok"}

# 🔹 Endpoint de eco para isolar problemas de método/CORS:
class EchoPayload(BaseModel):
    data: Dict[str, Any]

@app.post("/echo")
def echo(payload: EchoPayload):
    return {"you_sent": payload.data}

# (opcional) raiz amigável
@app.get("/")
def root():
    return {"name": "TechRoute API", "docs": "/docs"}
