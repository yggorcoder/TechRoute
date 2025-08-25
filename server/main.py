from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import router as visit_router




app = FastAPI(title="TechRoute API")
app.include_router(visit_router)

origins = [
     "http://localhost",
    "http://localhost:5500",  # Origem comum do VS Code Live Server
    "http://127.0.0.1:5500", # Outra variação

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(visit_router)