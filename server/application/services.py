from domain.models import Visita, StatusUpdate, Status, StatusHistoryItem
from datetime import date, time, datetime

class VisitService:
    def __init__(self):
        # Simulate an in-memory database
        self.visits = [
            {
                "id": "1", "date": date(2024, 7, 26), "time": time(14, 30),
                "location": "123 Flower Street", "technician": "Carlos Silva",
                "service_type": "Fiber Installation", "status": Status.SCHEDULED,
                "status_history": [StatusHistoryItem(status=Status.SCHEDULED, timestamp=datetime.now())],
                "checklist_items": []
            },
            {
                "id": "2", "date": date(2024, 7, 27), "time": time(10, 0),
                "location": "456 Main Avenue", "technician": "Ana Souza",
                "service_type": "Router Maintenance", "status": Status.IN_PROGRESS,
                "status_history": [
                    StatusHistoryItem(status=Status.SCHEDULED, timestamp=datetime.now()),
                    StatusHistoryItem(status=Status.IN_PROGRESS, timestamp=datetime.now(), comment="Technician on the way.")
                ],
                "checklist_items": []
            },
            {
                "id": "3", "date": date(2024, 7, 28), "time": time(16, 0),
                "location": "789 Central Square", "technician": "Pedro Costa",
                "service_type": "Cable Repair", "status": Status.COMPLETED,
                "status_history": [StatusHistoryItem(status=Status.COMPLETED, timestamp=datetime.now())],
                "checklist_items": []
            }
        ]

    def create_visit(self, visit: Visita):
        # In a real app, you'd save to a database
        visit.status_history.append(StatusHistoryItem(status=visit.status, timestamp=datetime.now()))
        self.visits.append(visit.model_dump())
        return {"message": "Visit processed successfully!", "data": visit.model_dump()}

    def get_all_visits(self):
        return self.visits

    def atualizar_status(self, visita_id: str, update_data: StatusUpdate):
        visit_to_update = None
        for v in self.visits:
            if v['id'] == visita_id:
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
            old_date = visit_to_update['date']
            old_time = visit_to_update['time']
            
            # Update the visit's main date and time
            visit_to_update['date'] = update_data.new_date
            visit_to_update['time'] = update_data.new_time

            # Prepend auto-comment to user's comment
            reschedule_note = f"Rescheduled from {old_date.strftime('%Y-%m-%d')} {old_time.strftime('%H:%M')}."
            final_comment = f"{reschedule_note} {update_data.comment}"

        # Create and add the new status to the history
        new_history_item = StatusHistoryItem(
            status=update_data.new_status,
            comment=final_comment,
            timestamp=datetime.now()
        )
        # Pydantic models in history need to be dicts to be JSON serializable if they aren't already
        visit_to_update['status_history'].append(new_history_item.model_dump())

        # Update the main status to the new status
        visit_to_update['status'] = update_data.new_status

        print(f"Visit status {visita_id} updated to {update_data.new_status.value}")

        return {"message": "Visit status updated successfully!"}
