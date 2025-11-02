import axios from "axios";

const API_ROOT = process.env.REACT_APP_API_URL || "http://localhost:5000";
export const api = axios.create({ baseURL: `${API_ROOT}/api` });
export const Users = {
  list: (params = {}) => api.get("/users", { params }),
  create: (body) => api.post("/users", body),
  update: (id, body) => api.put(`/users/${id}`, body),
  remove: (id) => api.delete(`/users/${id}`),
};

