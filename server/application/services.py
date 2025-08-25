# Business Logics

from domain.models import Visit

class VisitService:
    def create_visit(self, visit: Visit):
        print(f"Business logic for the visit: {visit,dict()}")
        # logic for database saving here
        return {"mesage": "Visit processed successfully!", "data": visit.model_dump()}