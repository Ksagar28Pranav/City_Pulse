import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);

export const createReport = (data, token) =>
  API.post("/reports", data, { headers: { Authorization: `Bearer ${token}` } });

export const getMyReports = (token) =>
  API.get("/reports/mine", { headers: { Authorization: `Bearer ${token}` } });

export const getAllReports = (token) =>
  API.get("/reports", { headers: { Authorization: `Bearer ${token}` } });

export const getOverdueReports = (token) =>
  API.get("/reports/overdue", { headers: { Authorization: `Bearer ${token}` } });

export const getWarningReports = (token) =>
  API.get("/reports/warnings", { headers: { Authorization: `Bearer ${token}` } });

export const updateReportStatus = (id, status, token) =>
  API.patch(`/reports/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });