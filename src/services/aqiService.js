import api from "./api";

export const getCurrentAqi = async (lat, lon) => {
  return await api.get(`/api/aqi/current?lat=${lat}&lon=${lon}`);
};

export const compareAqi = async (lat1, lon1, lat2, lon2) => {
  return await api.get(`/api/aqi/compare?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`);
};

export const getAqiHistory = async (lat, lon) => {
  return await api.get(`/api/aqi/history?lat=${lat}&lon=${lon}`);
};
