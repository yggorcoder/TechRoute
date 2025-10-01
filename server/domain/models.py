from pydantic import BaseModel, Field
from datetime import date, time, datetime
from typing import List, Optional
from enum import Enum

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

class Visita(BaseModel):
    id: str
    date: date
    time: time
    location: str
    technician: str
    service_type: str
    status: Status = Status.SCHEDULED
    status_history: List[StatusHistoryItem] = []
    checklist_items: List[str] = []