from fastapi import APIRouter, HTTPException
from domain.models import Visita, StatusUpdate
from application.services import VisitService

router = APIRouter()
visit_service = VisitService()

@router.post("/visits")
async def create_visit_router(visit: Visita):
    return visit_service.create_visit(visit)

@router.get("/visits")
async def get_all_visits_router():
    return visit_service.get_all_visits()

@router.patch("/visitas/{visita_id}/status")
async def update_visit_status(visita_id: str, update_data: StatusUpdate):
    try:
        return visit_service.atualizar_status(visita_id, update_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))