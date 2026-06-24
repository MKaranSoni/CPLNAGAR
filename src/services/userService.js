import api from "./api";

export const getCurrentUser = async () => {
    return api.get('/api/users/me');
};

export const getUserStats = async () => {
    return api.get('/api/users/me/stats');
};
