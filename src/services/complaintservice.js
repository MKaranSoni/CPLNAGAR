import api from "./api";

export const createComplaint = async (complaintData) => {
  return await api.post(
    "/api/complaints",
    complaintData
  );
};

export const getAllComplaints = async () => {
  return await api.get(
    "/api/complaints"
  );
};