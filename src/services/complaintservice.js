import api from "./api";

export const createComplaint = async (formData) => {
  return await api.post(
    "/api/complaints/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getAllComplaints = async () => {
  return await api.get("/api/complaints");
};