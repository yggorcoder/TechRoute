from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import router as visit_router
from api.auth_router import router as auth_router

# --- ETAPA 1: DEFINIR AS ORIGENS PERMITIDAS ---
# Adicione a URL do seu frontend da Azure aqui
origins = [
    "https://calm-wave-0e27f731e.3.azurestaticapps.net", 
    "http://localhost",
    "http://localhost:5500", 
    "http://127.0.0.1:5500", 
    "http://localhost:5173",
]

# --- ETAPA 2: CRIAR O APP ---
app = FastAPI(title="TechRoute API")

# --- ETAPA 3: ADICIONAR O MIDDLEWARE DE CORS (ANTES DOS ROUTERS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ETAPA 4: INCLUIR OS ROUTERS (DEPOIS DO MIDDLEWARE) ---
app.include_router(visit_router)
app.include_router(auth_router)

# --- COMENTÁRIO PARA FORÇAR O DEPLOY ---
# Atualização final para corrigir a ordem do middleware e CORS