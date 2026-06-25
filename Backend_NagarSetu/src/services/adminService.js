import api from "./api";

export const getAdminStats = async () => {
  return await api.get("/api/admin/stats");
};

export const getCommunityFeed = async () => {
  return await api.get("/api/complaints/feed");
};

export const getCategoryStats = async () => {
  return await api.get("/api/admin/stats/categories");
};

export const getTopComplaints = async (limit = 10) => {
  return await api.get(`/api/admin/complaints/top?limit=${limit}`);
};

export const getRecentComplaints = async (limit = 10) => {
  return await api.get(`/api/admin/complaints/recent?limit=${limit}`);
};