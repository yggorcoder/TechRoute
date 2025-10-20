import { api } from "../api";

// GET /visits
export async function fetchVisits() {
  const res = await api.get("/visits");
  return res.data;
}

// POST /visits
export async function createVisit(visitData) {
  const res = await api.post("/visits", visitData);
  return res.data;
}

// PATCH /visits/{visit_id}/notas
export async function addNoteToVisit(visitId, noteData) {
  const res = await api.patch(`/visits/${visitId}/notas`, noteData);
  return res.data;
}

// PATCH /visits/{visit_id}/status
export async function updateVisitStatus(visitId, statusData) {
  const res = await api.patch(`/visits/${visitId}/status`, statusData);
  return res.data;
}

// GET /dashboard/visits
export async function fetchDashboardVisits(params) {
  const res = await api.get(`/dashboard/visits?${params.toString()}`);
  return res.data;
}
