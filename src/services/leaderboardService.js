import api from "./api";

export const getWardLeaderboard = async () => {
    return api.get('/api/leaderboard/ward');
};
