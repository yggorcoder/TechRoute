from fastapi import APIRouter, HTTPException, Depends, Query
from domain.models import Visita, StatusUpdate, PostVisitNotes, VisitFilter, Status
from application.services import VisitService
from typing import List, Optional
from datetime import date
from application.security import get_current_user
from domain.models import UserInDB

router = APIRouter()
visit_service = VisitService()

@router.post("/visits")
async def create_visit_router(visit: Visita, current_user: UserInDB = Depends(get_current_user)):
    return visit_service.create_visit(visit)

@router.get("/visits")
async def get_all_visits_router(current_user: UserInDB = Depends(get_current_user)):
    # agora, esta função só executa se o token for válido.
    # a variável current_user contém dados do usuário logado.

    # lógica de permissão:
    if current_user.role == "manager":
        return visit_service.get_all_visits()
    else:
        return visit_service.get_visits_by_technician(current_user.username)


@router.get("/dashboard/visits", response_model=List[Visita])
def list_dashboard_visits_router(
    technicians: Optional[List[str]] = Query(None),
    statuses: Optional[List[Status]] = Query(None),
    start_date: date = Query(...),
    end_date: date = Query(...)
):
    filters = VisitFilter(
        technicians=technicians,
        statuses=statuses,
        start_date=start_date,
        end_date=end_date
    )
    return visit_service.get_filtered_visits(filters)

@router.patch("/visits/{visita_id}/status")
async def update_visit_status(visita_id: str, update_data: StatusUpdate):
    try:
        return visit_service.atualizar_status(visita_id, update_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/visits/{visita_id}/notas")
async def add_post_visit_notes_router(visita_id: str, notes_data: PostVisitNotes):
    try:
        notes_data.visita_id = visita_id
        return visit_service.salvar_observacoes(notes_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))