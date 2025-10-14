from domain.models import Visita, StatusUpdate, Status, StatusHistoryItem, PostVisitNotes, NoteItem, VisitFilter
from datetime import date, time, datetime

from typing import List

class VisitService:
    def __init__(self):
        # Simulate an in-memory database with Visita objects
        self.visits: List[Visita] = [
            Visita(
                id="1", date=date(2025, 10, 26), time=time(14, 30),
                location="123 Flower Street", technician="Carlos Silva",
                service_type="Fiber Installation", status=Status.SCHEDULED,
                status_history=[StatusHistoryItem(status=Status.SCHEDULED, timestamp=datetime.now())],
                notes=[],
                checklist_items=[]
            ),
            Visita(
                id="2", date=date(2025, 10, 27), time=time(10, 0),
                location="456 Main Avenue", technician="Ana Souza",
                service_type="Router Maintenance", status=Status.IN_PROGRESS,
                status_history=[
                    StatusHistoryItem(status=Status.SCHEDULED, timestamp=datetime.now()),
                    StatusHistoryItem(status=Status.IN_PROGRESS, timestamp=datetime.now(), comment="Technician on the way.")
                ],
                notes=[],
                checklist_items=[]
            ),
            Visita(
                id="3", date=date(2025, 10, 28), time=time(16, 0),
                location="789 Central Square", technician="Pedro Costa",
                service_type="Cable Repair", status=Status.COMPLETED,
                status_history=[StatusHistoryItem(status=Status.COMPLETED, timestamp=datetime.now())],
                notes=[NoteItem(note="Service completed successfully. All systems are operational.", timestamp=datetime.now())],
                checklist_items=[]
            )
        ]

    def create_visit(self, visit: Visita) -> Visita:
        # In a real app, you'd save to a database
        visit.status_history.append(StatusHistoryItem(status=visit.status, timestamp=datetime.now()))
        self.visits.append(visit)
        return visit

    def get_all_visits(self) -> List[Visita]:
        return self.visits
    
    def get_visits_by_technician(self, technician_name: str) -> List[Visita]:
        return [
            visit for visit in self.visits if visit.technician == technician_name
        ]

    def get_filtered_visits(self, filters: VisitFilter) -> List[Visita]:
        filtered_visits = self.visits

        if filters.technicians:
            filtered_visits = [
                v for v in filtered_visits if v.technician in filters.technicians
            ]

        if filters.statuses:
            filtered_visits = [
                v for v in filtered_visits if v.status in filters.statuses
            ]

        if filters.start_date:
            filtered_visits = [
                v for v in filtered_visits if v.date >= filters.start_date
            ]

        if filters.end_date:
            filtered_visits = [
                v for v in filtered_visits if v.date <= filters.end_date
            ]

        return filtered_visits

    def atualizar_status(self, visita_id: str, update_data: StatusUpdate) -> Visita:
        visit_to_update = None
        for v in self.visits:
            if v.id == visita_id:
                visit_to_update = v
                break

        if not visit_to_update:
            raise ValueError("Visit not found")

        # Business rule validation
        if update_data.new_status in [Status.RESCHEDULED, Status.CANCELLED]:
            if not update_data.comment or not update_data.comment.strip():
                raise ValueError("A comment is required for rescheduling or cancellations.")

        final_comment = update_data.comment

        # If rescheduling, handle date/time change
        if update_data.new_status == Status.RESCHEDULED and update_data.new_date and update_data.new_time:
            old_date = visit_to_update.date
            old_time = visit_to_update.time
            
            # Update the visit's main date and time
            visit_to_update.date = update_data.new_date
            visit_to_update.time = update_data.new_time

            # Prepend auto-comment to user's comment
            reschedule_note = f"Rescheduled from {old_date.strftime('%Y-%m-%d')} {old_time.strftime('%H:%M')}."
            final_comment = f"{reschedule_note} {update_data.comment}"

        # Create and add the new status to the history
        new_history_item = StatusHistoryItem(
            status=update_data.new_status,
            comment=final_comment,
            timestamp=datetime.now()
        )
        visit_to_update.status_history.append(new_history_item)

        # Update the main status to the new status
        visit_to_update.status = update_data.new_status

        print(f"Visit status {visita_id} updated to {update_data.new_status.value}")

        return visit_to_update

    def salvar_observacoes(self, notes: PostVisitNotes) -> Visita:
        visit_to_update = None
        for v in self.visits:
            if v.id == notes.visita_id:
                visit_to_update = v
                break

        if not visit_to_update:
            raise ValueError("Visit not found")

        # Validate if status allows adding notes
        if visit_to_update.status not in [Status.COMPLETED, Status.IN_PROGRESS]:
            raise ValueError(f"Cannot add notes to a visit with status '{visit_to_update.status}'.")

        new_note = NoteItem(note=notes.observacoes_tecnico, timestamp=datetime.now())
        visit_to_update.notes.append(new_note)

        print(f"Post-visit note added to visit {notes.visita_id}")

        return visit_to_update
