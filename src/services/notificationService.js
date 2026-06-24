import api from "./api";

export const getMyNotifications = async () => {
  return await api.get("/api/notifications");
};

export const getAllNotifications = async () => {
  return await api.get("/api/notifications/all");
};

export const markNotificationAsRead = async (id) => {
  return await api.put(`/api/notifications/${id}/read`);
};

export const respondToClosure = async (id, accept) => {
  return await api.post(`/api/notifications/${id}/respond`, { accept });
};
