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

// POST /visitas/{visit_id}/notas
export async function addNoteToVisit(visitId, noteData) {
  const res = await api.post(`/visitas/${visitId}/notas`, noteData);
  return res.data;
}

// PUT /visitas/{visit_id}/status
export async function updateVisitStatus(visitId, statusData) {
  const res = await api.put(`/visitas/${visitId}/status`, statusData);
  return res.data;
}

// GET /dashboard/visits
export async function fetchDashboardVisits(params) {
  const res = await api.get(`/dashboard/visits?${params.toString()}`);
  return res.data;
}
