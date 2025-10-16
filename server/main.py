from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import router as visit_router
from api.auth_router import router as auth_router




app = FastAPI(title="TechRoute API")
app.include_router(visit_router)
app.include_router(auth_router)


origins = [
    "https://calm-wave-0e27f731e.3.azurestaticapps.net",
     "http://localhost",
    "http://localhost:5500",  # Origem comum do VS Code Live Server
    "http://127.0.0.1:5500", # Outra variação
    "http://localhost:5173",  # Origem do Vite dev server

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(visit_router)