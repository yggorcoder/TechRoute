from pydantic import BaseModel, Field
from datetime import date, time, datetime
from typing import List, Optional
from enum import Enum

# --- Modelos de Visita (Existentes) ---

class Status(str, Enum):
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    RESCHEDULED = "RESCHEDULED"
    CANCELLED = "CANCELLED"

class StatusUpdate(BaseModel):
    new_status: Status
    comment: Optional[str] = None
    new_date: Optional[date] = None
    new_time: Optional[time] = None

class StatusHistoryItem(BaseModel):
    status: Status
    timestamp: datetime = Field(default_factory=datetime.now)
    comment: Optional[str] = None

class NoteItem(BaseModel):
    note: str
    timestamp: datetime = Field(default_factory=datetime.now)

class Visita(BaseModel):
    id: str
    date: date
    time: time
    location: str
    technician: str
    service_type: str
    status: Status = Status.SCHEDULED
    status_history: List[StatusHistoryItem] = []
    notes: List[NoteItem] = []
    checklist_items: List[str] = []

class PostVisitNotes(BaseModel):
    visita_id: str
    observacoes_tecnico: str

class VisitFilter(BaseModel):
    technicians: Optional[List[str]] = Field(None, description="List of technician names to filter by.")
    statuses: Optional[List[Status]] = Field(None, description="List of visit statuses (Enum) to filter by.")
    start_date: date = Field(..., description="Start date of the consultation window.")
    end_date: date = Field(..., description="End date of the consultation window.")

# --- Modelos de Usuário e Autenticação (Corrigidos) ---

class Role(str, Enum):
    MANAGER = "manager"
    TECHNICIAN = "technician"

# Modelo Base/Público - sem senhas
class User(BaseModel):
    username: str
    email: str
    role: Role

# Modelo para criar usuário - inclui a senha
class UserCreate(User):
    password: str

# Modelo para representar o usuário no DB - inclui a senha com hash
class UserInDB(User):
    hashed_password: str

# Modelos para o Token JWT
class TokenData(BaseModel):
    username: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
