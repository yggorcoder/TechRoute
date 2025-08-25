from fastapi import APIRouter
from domain.models import Visit
from application.services import VisitService

router = APIRouter()
visit_service = VisitService()

@router.post("/visits")
async def create_visit_router(visit: Visit):
    return visit_service.create_visit(visit)
