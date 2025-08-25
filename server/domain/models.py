from pydantic import BaseModel
from datetime import date, time
from typing import List

class Visit(BaseModel):
    date: date
    time: time
    location: str
    technician: str
    service_type: str
    checklist_items: List[str] = []
    


